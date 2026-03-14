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

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// --- সলিড ডাটা: সরাসরি কোডের ভেতরে ---
const trainsDataMap = {
  "794": {
    stations: [
      { arrival: "START", departure: "12:10 pm" },
      { arrival: "12:50 pm", departure: "12:55 pm" },
      { arrival: "01:20 pm", departure: "01:23 pm" },
      { arrival: "02:12 pm", departure: "02:20 pm" },
      { arrival: "03:00 pm", departure: "03:20 pm" },
      { arrival: "04:13 pm", departure: "04:16 pm" },
      { arrival: "04:50 pm", departure: "04:55 pm" },
      { arrival: "05:36 pm", departure: "05:39 pm" },
      { arrival: "10:10 pm", departure: "END" }
    ]
  }
};

const parseToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string' || ["START", "END", "---"].includes(timeStr)) return null;
  const match = timeStr.toLowerCase().match(/(\d+):(\d+)\s*(am|pm)/);
  if (!match) return null;
  let h = parseInt(match[1]);
  let m = parseInt(match[2]);
  if (match[3] === 'pm' && h < 12) h += 12;
  if (match[3] === 'am' && h === 12) h = 0;
  return h * 60 + m;
};

// মিনিটকে "1h 10m" ফরম্যাটে রূপান্তর করার ফাংশন
const formatDelay = (min) => {
  if (min <= 0) return "On Time";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ==========================================
// ১. API Routes
// ==========================================

// রুট রাউট
app.get('/', (req, res) => {
  res.send('TrainKoi Backend Server is Running...');
});

// ট্রেনের বর্তমান লোকেশন পাওয়ার API
app.get('/api/train-location/:trainId', async (req, res) => {
  try {
    const trainId = parseInt(req.params.trainId);
    const trainData = await Train.findOne({ trainId: trainId });
    
    if (!trainData) {
      return res.status(404).json({ message: "Train not found in database" });
    }
    
    res.json({
      trainId: trainData.trainId,
      lat: trainData.lastLocation?.lat,
      lng: trainData.lastLocation?.lng,
      speed: trainData.speed || 0,
      delay: trainData.delay || 0,
      delayText: formatDelay(trainData.delay || 0), // API তেও টেক্সট ফরম্যাট পাঠানো হলো
      updatedAt: trainData.lastLocation?.updatedAt,
      index: trainData.currentStationIndex || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/ping', (req, res) => res.send('pong'));

// ==========================================
// ২. Socket logic
// ==========================================
io.on("connection", (socket) => {
  console.log("New Client Connected:", socket.id);

  socket.on("send_location", async (data) => {
    try {
      const { trainId, lat, lng, speed, index, manualDelay } = data;
      let calcDelay = 0;
      const tidString = String(trainId);

      const now = new Date();
      const bdt = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const currentMin = (bdt.getHours() * 60) + bdt.getMinutes();

      if (trainsDataMap[tidString]) {
        const station = trainsDataMap[tidString].stations[parseInt(index) || 0];
        if (station) {
          const schedTimeStr = (station.arrival === "START") ? station.departure : station.arrival;
          const schedMin = parseToMinutes(schedTimeStr);
          if (schedMin !== null) {
            let diff = currentMin - schedMin;
            if (diff < -720) diff += 1440;
            if (diff > 720) diff -= 1440;
            
            calcDelay = diff > 0 ? Math.round(diff) : 0;

            // --- গতিভিত্তিক ডিলে অ্যাডজাস্টমেন্ট (Smart ETA) ---
            // যদি ট্রেনের গতি ৫০ কিমি/ঘণ্টার বেশি হয়, তবে প্রতি মিনিটে আমরা সামান্য ডিলে কভার করার লজিক দিচ্ছি
            if (speed > 50 && calcDelay > 0) {
              const recoveryFactor = Math.floor(speed / 60); // স্পিড যত বেশি, রিকভারি তত বাড়বে
              calcDelay = Math.max(0, calcDelay - recoveryFactor);
            }
          }
        }
      }

      const finalDelay = (manualDelay !== undefined && manualDelay !== null && manualDelay !== "") 
                         ? parseInt(manualDelay) : calcDelay;

      const updateObj = {
        "lastLocation.lat": parseFloat(lat) || 0,
        "lastLocation.lng": parseFloat(lng) || 0,
        "lastLocation.updatedAt": new Date(),
        delay: finalDelay,
        currentStationIndex: parseInt(index) || 0,
        speed: parseFloat(speed) || 0
      };

      await Train.findOneAndUpdate(
        { trainId: parseInt(trainId) },
        { $set: updateObj },
        { upsert: true, new: true }
      );

      io.emit("receive_location", {
        trainId: parseInt(trainId),
        lat: updateObj["lastLocation.lat"],
        lng: updateObj["lastLocation.lng"],
        speed: updateObj.speed,
        delay: finalDelay,
        delayText: formatDelay(finalDelay), // ফ্রন্টেন্ডের জন্য "1h 10m" ফরম্যাট
        updatedAt: updateObj["lastLocation.updatedAt"],
        index: updateObj.currentStationIndex
      });

    } catch (err) {
      console.error("Socket Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

// ১২ মিনিট পর পর সেলফ-পিং
const SELF_URL = 'https://train-koi.onrender.com/ping';

setInterval(async () => {
  try {
    const response = await axios.get(SELF_URL);
    console.log(`[Self-Ping] Status: ${response.status} - Server kept alive at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error(`[Self-Ping] Error: ${err.message}`);
  }
}, 720000);