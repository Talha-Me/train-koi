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
const moment = require('moment-timezone');
const connectDB = require('./config/db');
const Train = require('./models/Train');
const Message = require('./models/Message');

// --- ডাটা ইমপোর্ট লজিক ---
let trains = [];
try {
  const dataImport = require('../src/data/trainData');
  trains = dataImport.trains || dataImport.default || dataImport;
  console.log("✅ Train Data Loaded. Total Trains:", Array.isArray(trains) ? trains.length : "Error: Not an array");
} catch (err) {
  console.error("❌ Error Loading trainData.js:", err.message);
}

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- HELPERS (FIXED & IMPROVED) ---

const parseToMinutes = (timeStr) => {
  if (!timeStr) return null;
  // সব স্পেস মুছে ছোট হাতের অক্ষরে কনভার্ট করা হচ্ছে যাতে কোনো ফরম্যাটেই ভুল না হয়
  const t = timeStr.toString().toLowerCase().replace(/\s+/g, '').trim();
  if (t === "start" || t === "end" || t === "---") return null;

  // এটি 08:30am, 08:30 am বা 8:30am সব ফরম্যাট ধরবে
  const match = t.match(/(\d+):(\d+)(am|pm)/);
  if (!match) return null;

  let [ , hrs, mins, mod] = match;
  let h = parseInt(hrs);
  if (mod === 'pm' && h < 12) h += 12;
  if (mod === 'am' && h === 12) h = 0;
  return h * 60 + parseInt(mins);
};

// --- API ROUTES ---

app.get('/api/train-location/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    const trainData = await Train.findOne({ trainId: parseInt(trainId) });
    if (!trainData) return res.status(404).json({ message: "No live data found" });
    res.json(trainData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/', (req, res) => res.send("Train Tracking Server is Running..."));
app.get('/ping', (req, res) => res.send('pong'));

// --- SOCKET.IO LOGIC ---

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("send_location", async (data) => {
    try {
      const { trainId, lat, lng, speed, index, progress } = data;
      const targetTrainId = Number(trainId);
      const targetIndex = Number(index) || 0;
      
      let calculatedDelayMinutes = 0; 

      // ট্রেনের ডাটা খুঁজে বের করা (Loose comparison for safety)
      const trainStaticInfo = trains.find(t => Number(t.id) === targetTrainId);
      
      if (trainStaticInfo) {
          const nowInDhaka = moment().tz("Asia/Dhaka");
          const currentTotalMin = (nowInDhaka.hours() * 60) + nowInDhaka.minutes();
          
          const currentStation = trainStaticInfo.stations[targetIndex];
          if (currentStation) {
              const schedTimeStr = (currentStation.arrival === "START" || !currentStation.arrival || currentStation.arrival === "---") 
                                   ? currentStation.departure 
                                   : currentStation.arrival;
              
              const scheduledMin = parseToMinutes(schedTimeStr);
              
              if (scheduledMin !== null) {
                  let diff = currentTotalMin - scheduledMin;

                  // Day cross fix (রাত ১২টার হিসাব)
                  if (diff < -720) diff += 1440; 
                  if (diff > 720) diff -= 1440;

                  // স্পিড রিকভারি লজিক
                  if (diff > 0 && speed > 50) {
                      const recoveryFactor = Math.floor((speed - 50) / 5) * 2;
                      diff = Math.max(0, diff - recoveryFactor);
                  }

                  calculatedDelayMinutes = diff > 0 ? Math.round(diff) : 0;
                  
                  // DEBUG LOG FOR YOU
                  console.log(`[CALC] ID: ${targetTrainId} | Sched: ${schedTimeStr} (${scheduledMin}m) | Now: ${currentTotalMin}m | Delay: ${calculatedDelayMinutes}m`);
              }
          }
      }

      const updatePayload = {
        "lastLocation.lat": lat, 
        "lastLocation.lng": lng,
        "lastLocation.updatedAt": new Date(), 
        delay: calculatedDelayMinutes, 
        currentStationIndex: targetIndex,
        progress: progress || 0,
        speed: speed || 0
      };

      const updatedTrain = await Train.findOneAndUpdate(
        { trainId: targetTrainId }, 
        { $set: updatePayload },
        { upsert: true, new: true } 
      );

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

      console.log(`[OK] Train: ${targetTrainId} | Delay: ${calculatedDelayMinutes}m`);

    } catch (err) {
      console.error("Socket Update Error:", err.message);
    }
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 5001; 
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

setInterval(async () => {
  try { await axios.get('https://train-koi.onrender.com/ping'); } catch (e) {}
}, 12 * 60 * 1000);