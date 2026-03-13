// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const axios = require('axios');
// const connectDB = require('./config/db');
// const Train = require('./models/Train');
// const Message = require('./models/Message');

// // শিডিউল ডাটা ইমপোর্ট
// const { trains } = require('../src/data/trainData'); 

// // কনফিগারেশন
// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);

// // সকেট ইনিশিয়লাইজেশন
// const io = new Server(server, {
//   cors: {
//     origin: "*", 
//     methods: ["GET", "POST"]
//   }
// });

// // --- Helpers (ডিলে ক্যালকুলেশনের জন্য) ---
// const parseToMinutes = (timeStr) => {
//   if (!timeStr || ["START", "END", "---"].includes(timeStr)) return null;
//   const match = timeStr.toLowerCase().match(/(\d+):(\d+)\s*(am|pm)/);
//   if (!match) return null;
//   let [ , hrs, mins, mod] = match;
//   let h = parseInt(hrs);
//   if (mod === 'pm' && h < 12) h += 12;
//   if (mod === 'am' && h === 12) h = 0;
//   return h * 60 + parseInt(mins);
// };

// // --- API Routes ---

// /**
//  * ১. নির্দিষ্ট ট্রেনের লোকেশন ডাটা পাওয়া (Initial Load)
//  */
// app.get('/api/train-location/:trainId', async (req, res) => {
//   try {
//     const { trainId } = req.params;
//     const trainData = await Train.findOne({ trainId: parseInt(trainId) });
    
//     if (!trainData || !trainData.lastLocation || !trainData.lastLocation.lat) {
//       return res.status(404).json({ message: "No live data found for this train" });
//     }
    
//     res.json({
//       trainId: trainData.trainId,
//       lat: trainData.lastLocation.lat,
//       lng: trainData.lastLocation.lng,
//       speed: trainData.speed,
//       delay: trainData.delay,
//       index: trainData.currentStationIndex,
//       progress: trainData.progress,
//       updatedAt: trainData.lastLocation.updatedAt
//     });
//   } catch (error) {
//     console.error("API Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /**
//  * ২. কন্টাক্ট ফরম থেকে মেসেজ সেভ করা
//  */
// app.post('/api/contact', async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;
//     const newMessage = new Message({ name, email, subject, message });
//     await newMessage.save();
//     res.status(201).json({ success: true, message: "Message saved successfully!" });
//   } catch (error) {
//     console.error("Contact API Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });

// app.get('/', (req, res) => res.send("Train Tracking Server is Running..."));

// /**
//  * ৩. Self-Ping রুট (সার্ভারকে জাগিয়ে রাখার জন্য)
//  */
// app.get('/ping', (req, res) => {
//   res.send('pong');
// });

// // --- Socket.io Logic ---

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("send_location", async (data) => {
//     try {
//       const { trainId, lat, lng, speed, index, progress } = data;
      
//       // --- অটোমেটিক ডিলে ক্যালকুলেশন লজিক শুরু (Timezone Fixed) ---
//       let calculatedDelay = 0; 
      
//       const trainStaticInfo = trains.find(t => t.id === parseInt(trainId));
//       if (trainStaticInfo) {
//           // বাংলাদেশের বর্তমান সময় বের করা (UTC + 6 hours)
//           const now = new Date();
//           const bdtTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); 
//           const currentTotalMin = (bdtTime.getUTCHours() * 60) + bdtTime.getUTCMinutes();
          
//           const currentStation = trainStaticInfo.stations[index || 0];
//           if (currentStation) {
//               const schedTimeStr = currentStation.arrival === "START" ? currentStation.departure : currentStation.arrival;
//               const scheduledMin = parseToMinutes(schedTimeStr);
              
//               if (scheduledMin !== null) {
//                   const diff = currentTotalMin - scheduledMin;
//                   calculatedDelay = diff > 0 ? diff : 0;
//               }
//           }
//       }
//       // --- অটোমেটিক ডিলে ক্যালকুলেশন লজিক শেষ ---

//       const updatePayload = {
//         "lastLocation.lat": lat, 
//         "lastLocation.lng": lng,
//         "lastLocation.updatedAt": new Date(),
//         delay: calculatedDelay,
//         currentStationIndex: index || 0,
//         progress: progress || 0
//       };

//       if (speed !== undefined && speed !== null) {
//         updatePayload.speed = speed;
//       }

//       const updatedTrain = await Train.findOneAndUpdate(
//         { trainId: parseInt(trainId) }, 
//         { $set: updatePayload },
//         { upsert: true, new: true } 
//       );

//       const liveUpdate = {
//         trainId: updatedTrain.trainId,
//         lat: updatedTrain.lastLocation.lat,
//         lng: updatedTrain.lastLocation.lng,
//         speed: updatedTrain.speed,
//         delay: updatedTrain.delay,
//         index: updatedTrain.currentStationIndex,
//         progress: updatedTrain.progress,
//         updatedAt: updatedTrain.lastLocation.updatedAt
//       };

//       io.emit("receive_location", liveUpdate); 
//       console.log(`Live Update: Train ${trainId} - Delay: ${calculatedDelay}m - Speed: ${updatedTrain.speed}km/h`);
//     } catch (err) {
//       console.error("Socket Update Error:", err.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // --- সার্ভার স্টার্ট ---
// const PORT = process.env.PORT || 5001; // Frontend calls 5000
// server.listen(PORT, () => {
//   console.log(`-----------------------------------------`);
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`-----------------------------------------`);
// });

// // --- Self-Ping Logic ---
// const RAW_SERVER_URL = 'https://train-koi.onrender.com';
// const SERVER_URL = RAW_SERVER_URL.replace(/\/$/, ""); 

// setInterval(async () => {
//   try {
//     await axios.get(`${SERVER_URL}/ping`);
//     console.log('Self-ping successful: Server is awake!');
//   } catch (error) {
//     console.error('Self-ping failed:', error.message);
//   }
// }, 12 * 60 * 1000);

// testing delay calculation

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const Train = require('./models/Train');
const Message = require('./models/Message');

// শিডিউল ডাটা ইমপোর্ট
const { trains } = require('../src/data/trainData'); 

// কনফিগারেশন
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// সকেট ইনিশিয়লাইজেশন
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- Helpers ---

/**
 * সময়কে (hh:mm am/pm) মিনিটে রূপান্তর করার ফাংশন
 */
const parseToMinutes = (timeStr) => {
  if (!timeStr || ["START", "END", "---"].includes(timeStr)) return null;
  
  // স্পেস বা অতিরিক্ত ক্যারেক্টার ক্লিন করা
  const cleanTime = timeStr.trim().toLowerCase();
  const match = cleanTime.match(/(\d+):(\d+)\s*(am|pm)/);
  
  if (!match) return null;
  
  let [ , hrs, mins, mod] = match;
  let h = parseInt(hrs);
  let m = parseInt(mins);
  
  if (mod === 'pm' && h < 12) h += 12;
  if (mod === 'am' && h === 12) h = 0;
  
  return h * 60 + m;
};

// --- API Routes ---

app.get('/api/train-location/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    const trainData = await Train.findOne({ trainId: parseInt(trainId) });
    if (!trainData) return res.status(404).json({ message: "No data found" });
    res.json(trainData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/', (req, res) => res.send("Train Tracking Server is Running..."));
app.get('/ping', (req, res) => res.send('pong'));

// --- Socket.io Logic ---

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("send_location", async (data) => {
    try {
      const { trainId, lat, lng, speed, index, progress } = data;
      let calculatedDelayMinutes = 0; 
      
      const trainStaticInfo = trains.find(t => t.id === parseInt(trainId));
      
      // বর্তমান বাংলাদেশ সময় বের করা (সার্ভার যেখানেই থাকুক)
      const now = new Date();
      const bdtString = now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
      const bdtDate = new Date(bdtString);
      const currentTotalMin = (bdtDate.getHours() * 60) + bdtDate.getMinutes();
      
      if (trainStaticInfo) {
          const currentIndex = parseInt(index) || 0;
          const currentStation = trainStaticInfo.stations[currentIndex];

          if (currentStation) {
              // ট্রেনের বর্তমান স্টেশনের নির্ধারিত সময় বের করা
              // যদি arrival "START" থাকে তবে departure ধরবে, নাহলে arrival ধরবে
              const schedTimeStr = (currentStation.arrival === "START" || !currentStation.arrival) 
                                   ? currentStation.departure 
                                   : currentStation.arrival;
              
              const scheduledMin = parseToMinutes(schedTimeStr);
              
              if (scheduledMin !== null) {
                  // গাণিতিক পার্থক্য (Current Time - Scheduled Time)
                  let diff = currentTotalMin - scheduledMin;

                  // দিনের পরিবর্তন (Midnight adjustment)
                  // উদাহরণ: শিডিউল ১১:৩০ পিএম, বর্তমান সময় ১২:১০ এএম
                  if (diff < -720) diff += 1440; 
                  if (diff > 720) diff -= 1440;

                  // স্পিড রিকভারি লজিক: ট্রেন যদি লেট থাকে এবং স্পিড ৫০ এর বেশি হয়
                  if (diff > 0 && speed > 50) {
                      // প্রতি ৫ কিমি অতিরিক্ত স্পিডের জন্য ২ মিনিট করে ডিলে কমানো (কাল্পনিক রিকভারি)
                      const recoveryFactor = Math.floor((speed - 50) / 5) * 2;
                      diff = Math.max(0, diff - recoveryFactor);
                  }

                  calculatedDelayMinutes = diff > 0 ? Math.round(diff) : 0;
              }
          }
      }

      // MongoDB আপডেট পে-লোড
      const updatePayload = {
        "lastLocation.lat": parseFloat(lat), 
        "lastLocation.lng": parseFloat(lng),
        "lastLocation.updatedAt": new Date(),
        delay: calculatedDelayMinutes, 
        currentStationIndex: parseInt(index) || 0,
        progress: parseFloat(progress) || 0,
        speed: parseFloat(speed) || 0
      };

      // ডাটাবেজে আপডেট করা
      const updatedTrain = await Train.findOneAndUpdate(
        { trainId: parseInt(trainId) }, 
        { $set: updatePayload },
        { upsert: true, new: true } 
      );

      // ফ্রন্টএন্ডে ডাটা ব্রডকাস্ট করা
      io.emit("receive_location", {
        trainId: updatedTrain.trainId,
        lat: updatedTrain.lastLocation.lat,
        lng: updatedTrain.lastLocation.lng,
        speed: updatedTrain.speed,
        delay: updatedTrain.delay, 
        index: updatedTrain.currentStationIndex,
        progress: updatedTrain.progress,
        updatedAt: updatedTrain.lastLocation.updatedAt
      }); 

      console.log(`[OK] Train: ${trainId} | BDT: ${bdtDate.getHours()}:${bdtDate.getMinutes()} | Delay: ${calculatedDelayMinutes}m`);

    } catch (err) {
      console.error("Socket Error:", err.message);
    }
  });

  socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

// পোর্ট সেটআপ
const PORT = process.env.PORT || 5001; 
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// রেন্ডার সার্ভারকে জাগিয়ে রাখার জন্য সেলফ-পিং (প্রতি ১০ মিনিট পর পর)
setInterval(async () => {
  try { 
    // এখানে আপনার নিজের রেন্ডার ইউআরএলটি নিশ্চিত করুন
    await axios.get('https://train-koi.onrender.com/ping'); 
  } catch (e) {
    console.log("Keep-alive ping failed");
  }
}, 10 * 60 * 1000);