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
 * এটি আপনার trainData.js এর ফরম্যাট (যেমন: "12:50 pm") নিখুঁতভাবে রিড করবে
 */
const parseToMinutes = (timeStr) => {
  if (!timeStr || ["START", "END", "---"].includes(timeStr)) return null;
  
  try {
    const cleanTime = timeStr.trim().toLowerCase();
    // Regex টি এমনভাবে সেট করা যাতে am/pm এর আগে স্পেস থাকলেও কাজ করে
    const match = cleanTime.match(/(\d+):(\d+)\s*(am|pm)/);
    
    if (!match) return null;
    
    let hrs = parseInt(match[1]);
    let mins = parseInt(match[2]);
    let mod = match[3];
    
    if (mod === 'pm' && hrs < 12) hrs += 12;
    if (mod === 'am' && hrs === 12) hrs = 0;
    
    return hrs * 60 + mins;
  } catch (e) {
    return null;
  }
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
      const { trainId, lat, lng, speed, index, progress, manualDelay } = data;
      let calculatedDelayMinutes = 0; 
      
      const trainStaticInfo = trains.find(t => t.id === parseInt(trainId));
      
      // ১. টাইমজোন ফিক্স (সার্ভার যেখানেই থাকুক BDT বের করবে)
      const now = new Date();
      const bdtTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const currentTotalMin = (bdtTime.getHours() * 60) + bdtTime.getMinutes();

      if (trainStaticInfo) {
          const currentIndex = parseInt(index) || 0;
          const currentStation = trainStaticInfo.stations[currentIndex];

          if (currentStation) {
              const schedTimeStr = (currentStation.arrival === "START" || !currentStation.arrival) 
                                   ? currentStation.departure 
                                   : currentStation.arrival;
              
              const scheduledMin = parseToMinutes(schedTimeStr);
              
              if (scheduledMin !== null) {
                  // ২. গাণিতিক পার্থক্য (Current Time - Scheduled Time)
                  let diff = currentTotalMin - scheduledMin;

                  // ৩. টাইম লজিক অ্যাডজাস্টমেন্ট (Midnight adjustment)
                  if (diff < -720) diff += 1440; 
                  if (diff > 720) diff -= 1440;

                  // ৪. স্পিড রিকভারি লজিক
                  if (diff > 0 && speed > 50) {
                      const recoveryFactor = Math.floor((speed - 50) / 5) * 2;
                      diff = Math.max(0, diff - recoveryFactor);
                  }

                  calculatedDelayMinutes = diff > 0 ? Math.round(diff) : 0;
              }
          }
      }

      // ৫. ম্যানুয়াল ডিলে থাকলে সেটি অগ্রাধিকার পাবে (Override)
      if (manualDelay !== null && manualDelay !== undefined && manualDelay !== "") {
          calculatedDelayMinutes = parseInt(manualDelay);
      }

      // ৬. ডাটাবেজ আপডেট পে-লোড
      const updatePayload = {
        "lastLocation.lat": parseFloat(lat), 
        "lastLocation.lng": parseFloat(lng),
        "lastLocation.updatedAt": new Date(),
        delay: calculatedDelayMinutes, 
        currentStationIndex: parseInt(index) || 0,
        progress: parseFloat(progress) || 0,
        speed: parseFloat(speed) || 0
      };

      // ৭. ডাটাবেজে সেভ করা
      const updatedTrain = await Train.findOneAndUpdate(
        { trainId: parseInt(trainId) }, 
        { $set: updatePayload },
        { upsert: true, new: true } 
      );

      // ৮. সব ক্লায়েন্টকে আপডেট ব্রডকাস্ট করা
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

      console.log(`[OK] Train: ${trainId} | BDT: ${bdtTime.getHours()}:${bdtTime.getMinutes()} | Delay: ${calculatedDelayMinutes}m`);

    } catch (err) {
      console.error("Socket Error:", err.message);
    }
  });

  socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

const PORT = process.env.PORT || 5001; 
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Self-Ping to keep Render alive
setInterval(async () => {
  try { 
    await axios.get('https://train-koi.onrender.com/ping'); 
  } catch (e) {}
}, 10 * 60 * 1000);