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


const trainsDataMap = {
  // --- সলিড ডাটা: পঞ্চগড় এক্সপ্রেস (৭৯৩ ও ৭৯৪) ---
  // ঢাকা থেকে পঞ্চগড়
  "793": {
    stations: [
      { arrival: "START", departure: "11:30 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "11:53 pm", departure: "11:58 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "03:27 am", departure: "03:30 am" }, // নাটোর (Index: 2)
      { arrival: "04:25 am", departure: "04:30 am" }, // সান্তাহার (Index: 3)
      { arrival: "05:01 am", departure: "05:04 am" }, // জয়পুরহাট (Index: 4)
      { arrival: "06:05 am", departure: "06:25 am" }, // পার্বতীপুর (Index: 5)
      { arrival: "06:58 am", departure: "07:03 am" }, // দিনাজপুর (Index: 6)
      { arrival: "08:05 am", departure: "08:08 am" }, // পীরগঞ্জ (Index: 7)
      { arrival: "08:33 am", departure: "08:36 am" }, // ঠাকুরগাঁও (Index: 8)
      { arrival: "09:50 am", departure: "END" }      // পঞ্চগড় (Index: 9)
    ]
  },
  // পঞ্চগড় থেকে ঢাকা
  "794": {
    stations: [
      { arrival: "START", departure: "12:10 pm" }, // পঞ্চগড় (Index: 0)
      { arrival: "12:50 pm", departure: "12:55 pm" }, // ঠাকুরগাঁও (Index: 1)
      { arrival: "01:20 pm", departure: "01:23 pm" }, // পীরগঞ্জ (Index: 2)
      { arrival: "02:12 pm", departure: "02:20 pm" }, // দিনাজপুর (Index: 3)
      { arrival: "03:00 pm", departure: "03:20 pm" }, // পার্বতীপুর (Index: 4)
      { arrival: "04:13 pm", departure: "04:16 pm" }, // জয়পুরহাট (Index: 5)
      { arrival: "04:50 pm", departure: "04:55 pm" }, // সান্তাহার (Index: 6)
      { arrival: "05:36 pm", departure: "05:39 pm" }, // নাটোর (Index: 7)
      { arrival: "10:10 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 8)
    ]
  },
  // --- লালমণি এক্সপ্রেস (৭৫১ ও ৭৫২) ---
  // ঢাকা থেকে লালমনিরহাট
  "751": {
    stations: [
      { arrival: "START", departure: "09:45 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "10:13 pm", departure: "10:18 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "10:55 pm", departure: "11:00 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "12:18 am", departure: "12:23 am" }, // টাঙ্গাইল (Index: 3)
      { arrival: "12:55 am", departure: "01:05 am" }, // বঙ্গবন্ধু সেতু পূর্ব (Index: 4)
      { arrival: "01:28 am", departure: "01:30 am" }, // শহীদ এম মনসুর আলী (Index: 5)
      { arrival: "02:02 am", departure: "02:04 am" }, // উল্লাপাড়া (Index: 6)
      { arrival: "02:32 am", departure: "02:34 am" }, // বড়াল ব্রিজ (Index: 7)
      { arrival: "02:54 am", departure: "02:56 am" }, // আজিজ নগর (Index: 8)
      { arrival: "03:25 am", departure: "03:28 am" }, // নাটোর (Index: 9)
      { arrival: "04:30 am", departure: "04:40 am" }, // সান্তাহার (Index: 10)
      { arrival: "05:25 am", departure: "05:35 am" }, // বগুড়া (Index: 11)
      { arrival: "06:53 am", departure: "06:58 am" }, // গাইবান্ধা (Index: 12)
      { arrival: "08:05 am", departure: "08:15 am" }, // কাউনিয়া (Index: 13)
      { arrival: "08:40 am", departure: "END" }      // লালমনিরহাট (Index: 14)
    ]
  },
  // লালমনিরহাট থেকে ঢাকা
  "752": {
    stations: [
      { arrival: "START", departure: "10:40 am" }, // লালমনিরহাট (Index: 0)
      { arrival: "11:05 am", departure: "11:15 am" }, // কাউনিয়া (Index: 1)
      { arrival: "12:20 pm", departure: "12:25 pm" }, // গাইবান্ধা (Index: 2)
      { arrival: "01:45 pm", departure: "01:55 pm" }, // বগুড়া (Index: 3)
      { arrival: "02:40 pm", departure: "02:50 pm" }, // সান্তাহার (Index: 4)
      { arrival: "03:45 pm", departure: "03:48 pm" }, // নাটোর (Index: 5)
      { arrival: "04:12 pm", departure: "04:14 pm" }, // আজিজ নগর (Index: 6)
      { arrival: "04:36 pm", departure: "04:38 pm" }, // বড়াল ব্রিজ (Index: 7)
      { arrival: "05:07 pm", departure: "05:09 pm" }, // উল্লাপাড়া (Index: 8)
      { arrival: "05:40 pm", departure: "05:42 pm" }, // শহীদ এম মনসুর আলী (Index: 9)
      { arrival: "06:15 pm", departure: "06:25 pm" }, // বঙ্গবন্ধু সেতু পূর্ব (Index: 10)
      { arrival: "07:03 pm", departure: "07:08 pm" }, // টাঙ্গাইল (Index: 11)
      { arrival: "08:25 pm", departure: "08:30 pm" }, // জয়দেবপুর (Index: 12)
      { arrival: "09:05 pm", departure: "09:10 pm" }, // ঢাকা বিমানবন্দর (Index: 13)
      { arrival: "09:40 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 14)
    ]
  },

// --- দ্রুতযান এক্সপ্রেস (৭৫৭ ও ৭৫৮) ---
  // ঢাকা থেকে পঞ্চগড়
  "757": {
    stations: [
      { arrival: "START", departure: "08:45 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "09:08 pm", departure: "09:13 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "09:36 pm", departure: "09:38 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "10:32 pm", departure: "10:34 pm" }, // টাঙ্গাইল (Index: 3)
      { arrival: "10:54 pm", departure: "10:56 pm" }, // ইব্রাহিমাবাদ (Index: 4)
      { arrival: "11:17 pm", departure: "11:19 pm" }, // জামতৈল (Index: 5)
      { arrival: "11:56 pm", departure: "11:58 pm" }, // চাটমোহর (Index: 6)
      { arrival: "12:49 am", departure: "12:52 am" }, // নাটোর (Index: 7)
      { arrival: "01:13 am", departure: "01:16 am" }, // আহসানগঞ্জ (Index: 8)
      { arrival: "01:55 am", departure: "02:00 am" }, // সান্তাহার (Index: 9)
      { arrival: "02:20 am", departure: "02:22 am" }, // আক্কেলপুর (Index: 10)
      { arrival: "02:37 am", departure: "02:39 am" }, // জয়পুরহাট (Index: 11)
      { arrival: "02:50 am", departure: "02:52 am" }, // পাঁচবিবি (Index: 12)
      { arrival: "03:12 am", departure: "03:14 am" }, // বিরামপুর (Index: 13)
      { arrival: "03:25 am", departure: "03:27 am" }, // ফুলবাড়ী (Index: 14)
      { arrival: "03:50 am", departure: "04:10 am" }, // পার্বতীপুর (Index: 15)
      { arrival: "04:25 am", departure: "04:27 am" }, // চিরিরবন্দর (Index: 16)
      { arrival: "04:45 am", departure: "04:50 am" }, // দিনাজপুর (Index: 17)
      { arrival: "05:20 am", departure: "05:22 am" }, // সেতাবগঞ্জ (Index: 18)
      { arrival: "05:36 am", departure: "05:39 am" }, // পীরগঞ্জ (Index: 19)
      { arrival: "06:02 am", departure: "06:05 am" }, // ঠাকুরগাঁও (Index: 20)
      { arrival: "06:22 am", departure: "06:38 am" }, // রুহিয়া (Index: 21)
      { arrival: "07:10 am", departure: "END" }      // পঞ্চগড় (Index: 22)
    ]
  },
  // পঞ্চগড় থেকে ঢাকা
  "758": {
    stations: [
      { arrival: "START", departure: "07:20 am" }, // পঞ্চগড় (Index: 0)
      { arrival: "07:46 am", departure: "07:48 am" }, // রুহিয়া (Index: 1)
      { arrival: "08:02 am", departure: "08:05 am" }, // ঠাকুরগাঁও (Index: 2)
      { arrival: "08:46 am", departure: "08:48 am" }, // পীরগঞ্জ (Index: 3)
      { arrival: "09:02 am", departure: "09:04 am" }, // সেতাবগঞ্জ (Index: 4)
      { arrival: "09:36 am", departure: "09:46 am" }, // দিনাজপুর (Index: 5)
      { arrival: "10:05 am", departure: "10:07 am" }, // চিরিরবন্দর (Index: 6)
      { arrival: "10:25 am", departure: "10:45 am" }, // পার্বতীপুর (Index: 7)
      { arrival: "11:03 am", departure: "11:06 am" }, // ফুলবাড়ী (Index: 8)
      { arrival: "11:17 am", departure: "11:20 am" }, // বিরামপুর (Index: 9)
      { arrival: "11:40 am", departure: "11:42 am" }, // পাঁচবিবি (Index: 10)
      { arrival: "11:53 am", departure: "11:56 am" }, // জয়পুরহাট (Index: 11)
      { arrival: "12:09 pm", departure: "12:11 pm" }, // আক্কেলপুর (Index: 12)
      { arrival: "12:35 pm", departure: "12:40 pm" }, // সান্তাহার (Index: 13)
      { arrival: "01:14 pm", departure: "01:16 pm" }, // আহসানগঞ্জ (Index: 14)
      { arrival: "01:38 pm", departure: "01:41 pm" }, // নাটোর (Index: 15)
      { arrival: "02:26 pm", departure: "02:28 pm" }, // ঈশ্বরদী বাইপাস (Index: 16)
      { arrival: "02:48 pm", departure: "02:51 pm" }, // চাটমোহর (Index: 17)
      { arrival: "03:28 pm", departure: "03:30 pm" }, // জামতৈল (Index: 18)
      { arrival: "03:56 pm", departure: "03:58 pm" }, // ইব্রাহিমাবাদ (Index: 19)
      { arrival: "04:18 pm", departure: "04:28 pm" }, // টাঙ্গাইল (Index: 20)
      { arrival: "05:48 pm", departure: "05:53 pm" }, // জয়দেবপুর (Index: 21)
      { arrival: "06:55 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 22)
    ]
  },
  // --- কুড়িগ্রাম এক্সপ্রেস (৭৯৭ ও ৭৯৮) ---
  // ঢাকা থেকে কুড়িগ্রাম
  "797": {
    stations: [
      { arrival: "START", departure: "08:00 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "08:23 pm", departure: "08:28 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "12:15 am", departure: "12:17 am" }, // নাটোর (Index: 2)
      { arrival: "12:31 am", departure: "12:33 am" }, // মাধনগর (Index: 3)
      { arrival: "01:05 am", departure: "01:10 am" }, // সান্তাহার (Index: 4)
      { arrival: "01:55 am", departure: "01:58 am" }, // জয়পুরহাট (Index: 5)
      { arrival: "03:00 am", departure: "03:10 am" }, // পার্বতীপুর (Index: 6)
      { arrival: "03:29 am", departure: "03:31 am" }, // বদরগঞ্জ (Index: 7)
      { arrival: "03:58 am", departure: "04:03 am" }, // রংপুর (Index: 8)
      { arrival: "04:25 am", departure: "04:28 am" }, // কাউনিয়া (Index: 9)
      { arrival: "05:10 am", departure: "END" }      // কুড়িগ্রাম (Index: 10)
    ]
  },
  // কুড়িগ্রাম থেকে ঢাকা
  "798": {
    stations: [
      { arrival: "START", departure: "07:10 am" }, // কুড়িগ্রাম (Index: 0)
      { arrival: "07:50 am", departure: "07:53 am" }, // কাউনিয়া (Index: 1)
      { arrival: "08:13 am", departure: "08:23 am" }, // রংপুর (Index: 2)
      { arrival: "08:51 am", departure: "08:54 am" }, // বদরগঞ্জ (Index: 3)
      { arrival: "09:25 am", departure: "09:45 am" }, // পার্বতীপুর (Index: 4)
      { arrival: "10:42 am", departure: "10:45 am" }, // জয়পুরহাট (Index: 5)
      { arrival: "11:20 am", departure: "11:30 am" }, // সান্তাহার (Index: 6)
      { arrival: "12:02 pm", departure: "12:04 pm" }, // মাধনগর (Index: 7)
      { arrival: "12:19 pm", departure: "12:22 pm" }, // নাটোর (Index: 8)
      { arrival: "05:05 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 9)
    ]
  },

// --- রংপুর এক্সপ্রেস (৭৭১ ও ৭৭২) ---
  // ঢাকা থেকে রংপুর
  "771": {
    stations: [
      { arrival: "START", departure: "09:10 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "09:33 am", departure: "09:38 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "11:33 am", departure: "11:35 am" }, // ইব্রাহিমাবাদ (Index: 2)
      { arrival: "12:31 pm", departure: "12:34 pm" }, // চাটমোহর (Index: 3)
      { arrival: "01:43 pm", departure: "01:46 pm" }, // নাটোর (Index: 4)
      { arrival: "02:45 pm", departure: "02:50 pm" }, // সান্তাহার (Index: 5)
      { arrival: "03:13 pm", departure: "03:15 pm" }, // তালোড়া (Index: 6)
      { arrival: "03:36 pm", departure: "03:41 pm" }, // বগুড়া (Index: 7)
      { arrival: "04:11 pm", departure: "04:13 pm" }, // সোনাতলা (Index: 8)
      { arrival: "04:30 pm", departure: "04:40 pm" }, // বোনারপাড়া (Index: 9)
      { arrival: "05:03 pm", departure: "05:08 pm" }, // গাইবান্ধা (Index: 10)
      { arrival: "05:37 pm", departure: "05:40 pm" }, // বামনডাঙ্গা (Index: 11)
      { arrival: "05:58 pm", departure: "06:00 pm" }, // পীরগাছা (Index: 12)
      { arrival: "06:16 pm", departure: "06:36 pm" }, // কাউনিয়া (Index: 13)
      { arrival: "07:00 pm", departure: "END" }      // রংপুর (Index: 14)
    ]
  },
  // রংপুর থেকে ঢাকা
  "772": {
    stations: [
      { arrival: "START", departure: "08:00 pm" }, // রংপুর (Index: 0)
      { arrival: "08:20 pm", departure: "08:40 pm" }, // কাউনিয়া (Index: 1)
      { arrival: "08:56 pm", departure: "08:58 pm" }, // পীরগাছা (Index: 2)
      { arrival: "09:15 pm", departure: "09:18 pm" }, // বামনডাঙ্গা (Index: 3)
      { arrival: "09:47 pm", departure: "09:52 pm" }, // গাইবান্ধা (Index: 4)
      { arrival: "10:15 pm", departure: "10:25 pm" }, // বোনারপাড়া (Index: 5)
      { arrival: "10:42 pm", departure: "10:44 pm" }, // সোনাতলা (Index: 6)
      { arrival: "11:15 pm", departure: "11:20 pm" }, // বগুড়া (Index: 7)
      { arrival: "11:40 pm", departure: "11:42 pm" }, // তালোড়া (Index: 8)
      { arrival: "12:10 am", departure: "12:15 am" }, // সান্তাহার (Index: 9)
      { arrival: "01:25 am", departure: "01:28 am" }, // নাটোর (Index: 10)
      { arrival: "03:34 am", departure: "03:36 am" }, // ইব্রাহিমাবাদ (Index: 11)
      { arrival: "06:00 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },
  // --- নীলসাগর এক্সপ্রেস (৭৬৫ ও ৭৬৬) ---
  // ঢাকা থেকে চিলাহাটি
  "765": {
    stations: [
      { arrival: "START", departure: "06:45 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "07:08 am", departure: "07:13 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "07:36 am", departure: "07:39 am" }, // জয়দেবপুর (Index: 2)
      { arrival: "08:54 am", departure: "09:03 am" }, // ইব্রাহিমাবাদ (Index: 3)
      { arrival: "10:16 am", departure: "10:18 am" }, // মুলাডুলি (Index: 4)
      { arrival: "10:57 am", departure: "11:00 am" }, // নাটোর (Index: 5)
      { arrival: "11:20 am", departure: "11:22 am" }, // আহসানগঞ্জ (Index: 6)
      { arrival: "11:55 am", departure: "12:05 pm" }, // সান্তাহার (Index: 7)
      { arrival: "12:38 pm", departure: "12:40 pm" }, // আক্‌কেলপুর (Index: 8)
      { arrival: "12:54 pm", departure: "12:57 pm" }, // জয়পুরহাট (Index: 9)
      { arrival: "01:25 pm", departure: "01:28 pm" }, // বিরামপুর (Index: 10)
      { arrival: "01:39 pm", departure: "01:42 pm" }, // ফুলবাড়ী (Index: 11)
      { arrival: "02:00 pm", departure: "02:10 pm" }, // পার্বতীপুর (Index: 12)
      { arrival: "02:27 pm", departure: "02:31 pm" }, // সৈয়দপুর (Index: 13)
      { arrival: "02:50 pm", departure: "02:55 pm" }, // নীলফামারী (Index: 14)
      { arrival: "03:16 pm", departure: "03:26 pm" }, // ডোমার (Index: 15)
      { arrival: "04:00 pm", departure: "END" }      // চিলাহাটি (Index: 16)
    ]
  },
  // চিলাহাটি থেকে ঢাকা
  "766": {
    stations: [
      { arrival: "START", departure: "08:00 pm" }, // চিলাহাটি (Index: 0)
      { arrival: "08:18 pm", departure: "08:21 pm" }, // ডোমার (Index: 1)
      { arrival: "08:37 pm", departure: "08:40 pm" }, // নীলফামারী (Index: 2)
      { arrival: "08:59 pm", departure: "09:04 pm" }, // সৈয়দপুর (Index: 3)
      { arrival: "09:20 pm", departure: "09:40 pm" }, // পার্বতীপুর (Index: 4)
      { arrival: "09:58 pm", departure: "10:00 pm" }, // ফুলবাড়ী (Index: 5)
      { arrival: "10:11 pm", departure: "10:14 pm" }, // বিরামপুর (Index: 6)
      { arrival: "10:43 pm", departure: "10:46 pm" }, // জয়পুরহাট (Index: 7)
      { arrival: "11:00 pm", departure: "11:02 pm" }, // আক্‌কেলপুর (Index: 8)
      { arrival: "11:20 pm", departure: "11:25 pm" }, // সান্তাহার (Index: 9)
      { arrival: "11:47 pm", departure: "11:49 pm" }, // আহসানগঞ্জ (Index: 10)
      { arrival: "12:10 am", departure: "12:13 am" }, // নাটোর (Index: 11)
      { arrival: "01:12 am", departure: "01:14 am" }, // মুলাডুলি (Index: 12)
      { arrival: "02:46 am", departure: "02:49 am" }, // ইব্রাহিমাবাদ (Index: 13)
      { arrival: "04:11 am", departure: "04:15 am" }, // জয়দেবপুর (Index: 14)
      { arrival: "05:25 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 15)
    ]
  },

// --- চিলাহাটি এক্সপ্রেস (৮০৫ ও ৮০৬) ---
  // ঢাকা থেকে চিলাহাটি
  "805": {
    stations: [
      { arrival: "START", departure: "05:00 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "05:23 pm", departure: "05:28 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "05:51 pm", departure: "05:54 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "08:55 pm", departure: "08:57 pm" }, // ঈশ্বরদী বাইপাস (Index: 3)
      { arrival: "09:27 pm", departure: "09:30 pm" }, // নাটোর (Index: 4)
      { arrival: "10:30 pm", departure: "10:35 pm" }, // সান্তাহার (Index: 5)
      { arrival: "11:19 pm", departure: "11:22 pm" }, // জয়পুরহাট (Index: 6)
      { arrival: "11:51 pm", departure: "11:53 pm" }, // বিরামপুর (Index: 7)
      { arrival: "12:04 am", departure: "12:06 am" }, // ফুলবাড়ী (Index: 8)
      { arrival: "12:40 am", departure: "01:00 am" }, // পার্বতীপুর (Index: 9)
      { arrival: "01:17 am", departure: "01:22 am" }, // সৈয়দপুর (Index: 10)
      { arrival: "01:41 am", departure: "01:44 am" }, // নীলফামারী (Index: 11)
      { arrival: "02:00 am", departure: "02:03 am" }, // ডোমার (Index: 12)
      { arrival: "02:45 am", departure: "END" }      // চিলাহাটি (Index: 13)
    ]
  },
  // চিলাহাটি থেকে ঢাকা
  "806": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // চিলাহাটি (Index: 0)
      { arrival: "06:18 am", departure: "06:21 am" }, // ডোমার (Index: 1)
      { arrival: "06:37 am", departure: "06:40 am" }, // নীলফামারী (Index: 2)
      { arrival: "06:59 am", departure: "07:04 am" }, // সৈয়দপুর (Index: 3)
      { arrival: "07:20 am", departure: "07:30 am" }, // পার্বতীপুর (Index: 4)
      { arrival: "07:48 am", departure: "07:50 am" }, // ফুলবাড়ী (Index: 5)
      { arrival: "08:01 am", departure: "08:03 am" }, // বিরামপুর (Index: 6)
      { arrival: "08:32 am", departure: "08:35 am" }, // জয়পুরহাট (Index: 7)
      { arrival: "09:15 am", departure: "09:20 am" }, // সান্তাহার (Index: 8)
      { arrival: "10:01 am", departure: "10:04 am" }, // নাটোর (Index: 9)
      { arrival: "10:34 am", departure: "10:36 am" }, // ঈশ্বরদী বাইপাস (Index: 10)
      { arrival: "01:52 pm", departure: "01:55 pm" }, // জয়দেবপুর (Index: 11)
      { arrival: "02:55 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },
  // --- ধূমকেতু এক্সপ্রেস (৭৬৯ ও ৭৭০) ---
  // ঢাকা থেকে রাজশাহী
  "769": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "06:23 am", departure: "06:28 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "06:51 am", departure: "06:53 am" }, // জয়দেবপুর (Index: 2)
      { arrival: "07:47 am", departure: "07:49 am" }, // টাঙ্গাইল (Index: 3)
      { arrival: "08:09 am", departure: "08:11 am" }, // ইব্রাহিমাবাদ (Index: 4)
      { arrival: "08:27 am", departure: "08:30 am" }, // শহীদ এম মনসুর আলী (Index: 5)
      { arrival: "08:38 am", departure: "08:44 am" }, // জামতৈল (Index: 6)
      { arrival: "08:56 am", departure: "08:59 am" }, // উল্লাপাড়া (Index: 7)
      { arrival: "09:28 am", departure: "09:31 am" }, // বড়াল ব্রিজ (Index: 8)
      { arrival: "09:44 am", departure: "09:47 am" }, // চাটমোহর (Index: 9)
      { arrival: "10:12 am", departure: "10:15 am" }, // ঈশ্বরদী বাইপাস (Index: 10)
      { arrival: "10:33 am", departure: "10:36 am" }, // আব্দুলপুর (Index: 11)
      { arrival: "10:47 am", departure: "10:49 am" }, // আড়ানী (Index: 12)
      { arrival: "11:40 am", departure: "END" }      // রাজশাহী (Index: 13)
    ]
  },
  // রাজশাহী থেকে ঢাকা
  "770": {
    stations: [
      { arrival: "START", departure: "11:20 pm" }, // রাজশাহী (Index: 0)
      { arrival: "11:51 pm", departure: "11:51 pm" }, // আড়ানী (Index: 1)
      { arrival: "12:05 am", departure: "12:07 am" }, // আব্দুলপুর (Index: 2)
      { arrival: "12:22 am", departure: "12:25 am" }, // ঈশ্বরদী বাইপাস (Index: 3)
      { arrival: "12:45 am", departure: "12:48 am" }, // চাটমোহর (Index: 4)
      { arrival: "01:05 am", departure: "01:08 am" }, // বড়াল ব্রিজ (Index: 5)
      { arrival: "01:57 am", departure: "01:59 am" }, // শহীদ এম মনসুর আলী (Index: 6)
      { arrival: "02:16 am", departure: "02:18 am" }, // ইব্রাহিমাবাদ (Index: 7)
      { arrival: "03:32 am", departure: "03:35 am" }, // জয়দেবপুর (Index: 8)
      { arrival: "04:40 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 9)
    ]
  },

// --- সিরাজগঞ্জ এক্সপ্রেস (৭৭৫ ও ৭৭৬) ---
  // সিরাজগঞ্জ থেকে ঢাকা
  "775": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // সিরাজগঞ্জ (Index: 0)
      { arrival: "06:08 am", departure: "06:10 am" }, // সিরাজগঞ্জ রায়পুর (Index: 1)
      { arrival: "06:25 am", departure: "06:45 am" }, // জামতৈল (Index: 2)
      { arrival: "06:53 am", departure: "06:56 am" }, // শহীদ এম মনসুর আলী (Index: 3)
      { arrival: "07:03 am", departure: "07:06 am" }, // সায়দাবাদ (Index: 4)
      { arrival: "07:18 am", departure: "07:20 am" }, // ইব্রাহিমাবাদ (Index: 5)
      { arrival: "07:40 am", departure: "07:48 am" }, // টাঙ্গাইল (Index: 6)
      { arrival: "08:12 am", departure: "08:12 am" }, // মির্জাপুর (Index: 7)
      { arrival: "08:31 am", departure: "08:33 am" }, // হাই-টেক সিটি (Index: 8)
      { arrival: "09:14 am", departure: "09:17 am" }, // জয়দেবপুর (Index: 9)
      { arrival: "09:43 am", departure: "09:46 am" }, // ঢাকা বিমানবন্দর (Index: 10)
      { arrival: "10:15 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 11)
    ]
  },
  // ঢাকা থেকে সিরাজগঞ্জ
  "776": {
    stations: [
      { arrival: "START", departure: "04:15 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "04:38 pm", departure: "04:43 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "05:06 pm", departure: "05:09 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "05:42 pm", departure: "05:42 pm" }, // মির্জাপুর (Index: 3)
      { arrival: "06:11 pm", departure: "06:13 pm" }, // টাঙ্গাইল (Index: 4)
      { arrival: "06:33 pm", departure: "06:39 pm" }, // ইব্রাহিমাবাদ (Index: 5)
      { arrival: "06:55 pm", departure: "06:57 pm" }, // শহীদ এম মনসুর আলী (Index: 6)
      { arrival: "07:05 pm", departure: "07:30 pm" }, // জামতৈল (Index: 7)
      { arrival: "07:43 pm", departure: "07:45 pm" }, // সিরাজগঞ্জ রায়পুর (Index: 8)
      { arrival: "08:10 pm", departure: "END" }      // সিরাজগঞ্জ (Index: 9)
    ]
  },
  // --- বনলতা এক্সপ্রেস (৭৯১ ও ৭৯২) ---
  // ঢাকা থেকে চাঁপাইনবাবগঞ্জ
  "791": {
    stations: [
      { arrival: "START", departure: "01:30 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "01:53 pm", departure: "01:58 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "05:45 pm", departure: "06:05 pm" }, // রাজশাহী (Index: 2)
      { arrival: "07:15 pm", departure: "END" }      // চাঁপাইনবাবগঞ্জ (Index: 3)
    ]
  },
  // চাঁপাইনবাবগঞ্জ থেকে ঢাকা
  "792": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // চাঁপাইনবাবগঞ্জ (Index: 0)
      { arrival: "06:50 am", departure: "07:00 am" }, // রাজশাহী (Index: 1)
      { arrival: "11:35 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 2)
    ]
  },

// --- তিস্তা এক্সপ্রেস (৭০৭ ও ৭০৮) ---
  // ঢাকা থেকে দেওয়ানগঞ্জ বাজার
  "707": {
    stations: [
      { arrival: "START", departure: "07:30 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "07:53 am", departure: "07:58 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "08:23 am", departure: "08:26 am" }, // জয়দেবপুর (Index: 2)
      { arrival: "09:44 am", departure: "09:47 am" }, // গফরগাঁও (Index: 3)
      { arrival: "10:32 am", departure: "10:35 am" }, // ময়মনসিংহ (Index: 4)
      { arrival: "11:03 am", departure: "11:05 am" }, // পিয়ারপুর (Index: 5)
      { arrival: "11:36 am", departure: "11:40 am" }, // জামালপুর টাউন (Index: 6)
      { arrival: "11:56 am", departure: "11:58 am" }, // মেলান্দহ বাজার (Index: 7)
      { arrival: "12:16 pm", departure: "12:18 pm" }, // ইসলামপুর বাজার (Index: 8)
      { arrival: "12:50 pm", departure: "END" }      // দেওয়ানগঞ্জ বাজার (Index: 9)
    ]
  },
  // দেওয়ানগঞ্জ বাজার থেকে ঢাকা
  "708": {
    stations: [
      { arrival: "START", departure: "03:00 pm" }, // দেওয়ানগঞ্জ বাজার (Index: 0)
      { arrival: "03:14 pm", departure: "03:16 pm" }, // ইসলামপুর বাজার (Index: 1)
      { arrival: "03:31 pm", departure: "03:33 pm" }, // মেলান্দহ বাজার (Index: 2)
      { arrival: "03:51 pm", departure: "03:56 pm" }, // জামালপুর টাউন (Index: 3)
      { arrival: "04:26 pm", departure: "04:28 pm" }, // পিয়ারপুর (Index: 4)
      { arrival: "05:03 pm", departure: "05:06 pm" }, // ময়মনসিংহ (Index: 5)
      { arrival: "05:52 pm", departure: "05:54 pm" }, // গফরগাঁও (Index: 6)
      { arrival: "07:47 pm", departure: "07:52 pm" }, // ঢাকা বিমানবন্দর (Index: 7)
      { arrival: "08:30 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 8)
    ]
  },

// --- পারাবত এক্সপ্রেস (৭০৯ ও ৭১০) ---
  // ঢাকা থেকে সিলেট
  "709": {
    stations: [
      { arrival: "START", departure: "06:20 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "06:43 am", departure: "06:48 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "07:58 am", departure: "08:00 am" }, // ভৈরব বাজার (Index: 2)
      { arrival: "08:33 am", departure: "08:35 am" }, // ব্রাহ্মণবাড়িয়া (Index: 3)
      { arrival: "09:05 am", departure: "09:07 am" }, // আজমপুর (Index: 4)
      { arrival: "09:48 am", departure: "09:50 am" }, // শায়েস্তাগঞ্জ (Index: 5)
      { arrival: "10:35 am", departure: "10:38 am" }, // শ্রীমঙ্গল (Index: 6)
      { arrival: "10:54 am", departure: "10:56 am" }, // ভানুগাছ (Index: 7)
      { arrival: "11:23 am", departure: "11:28 am" }, // কুলাউড়া (Index: 8)
      { arrival: "11:53 am", departure: "11:55 am" }, // মাইজগাঁও (Index: 9)
      { arrival: "12:45 pm", departure: "END" }      // সিলেট (Index: 10)
    ]
  },
  // সিলেট থেকে ঢাকা
  "710": {
    stations: [
      { arrival: "START", departure: "03:45 pm" }, // সিলেট (Index: 0)
      { arrival: "04:16 pm", departure: "04:18 pm" }, // মাইজগাঁও (Index: 1)
      { arrival: "04:46 pm", departure: "04:51 pm" }, // কুলাউড়া (Index: 2)
      { arrival: "05:13 pm", departure: "05:15 pm" }, // ভানুগাছ (Index: 3)
      { arrival: "05:31 pm", departure: "05:36 pm" }, // শ্রীমঙ্গল (Index: 4)
      { arrival: "06:23 pm", departure: "06:25 pm" }, // শায়েস্তাগঞ্জ (Index: 5)
      { arrival: "07:12 pm", departure: "07:14 pm" }, // আজমপুর (Index: 6)
      { arrival: "07:44 pm", departure: "07:47 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 7)
      { arrival: "08:14 pm", departure: "08:16 pm" }, // ভৈরব বাজার (Index: 8)
      { arrival: "09:47 pm", departure: "09:52 pm" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "10:40 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },
  // --- উপকূল এক্সপ্রেস (৭১১ ও ৭১২) ---
  // নোয়াখালী থেকে ঢাকা
  "711": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // নোয়াখালী (Index: 0)
      { arrival: "06:07 am", departure: "06:09 am" }, // মাইজদী কোর্ট (Index: 1)
      { arrival: "06:23 am", departure: "06:25 am" }, // চৌমুহনী (Index: 2)
      { arrival: "06:34 am", departure: "06:36 am" }, // বজরা (Index: 3)
      { arrival: "06:45 am", departure: "06:47 am" }, // সোনাইমুড়ী (Index: 4)
      { arrival: "07:00 am", departure: "07:02 am" }, // নাথেরপেটুয়া (Index: 5)
      { arrival: "07:25 am", departure: "07:30 am" }, // লাকসাম জংশন (Index: 6)
      { arrival: "07:52 am", departure: "07:54 am" }, // কুমিল্লা (Index: 7)
      { arrival: "08:24 am", departure: "08:26 am" }, // কসবা (Index: 8)
      { arrival: "08:50 am", departure: "08:53 am" }, // আখাউড়া জংশন (Index: 9)
      { arrival: "09:11 am", departure: "09:15 am" }, // ব্রাহ্মণবাড়িয়া (Index: 10)
      { arrival: "09:30 am", departure: "09:32 am" }, // আশুগঞ্জ (Index: 11)
      { arrival: "10:05 am", departure: "10:07 am" }, // নরসিংদী (Index: 12)
      { arrival: "10:47 am", departure: "10:52 am" }, // ঢাকা বিমানবন্দর (Index: 13)
      { arrival: "11:20 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 14)
    ]
  },
  // ঢাকা থেকে নোয়াখালী
  "712": {
    stations: [
      { arrival: "START", departure: "03:10 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "03:33 pm", departure: "03:38 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "04:17 pm", departure: "04:20 pm" }, // নরসিংদী (Index: 2)
      { arrival: "04:50 pm", departure: "04:53 pm" }, // ভৈরব বাজার (Index: 3)
      { arrival: "05:00 pm", departure: "05:03 pm" }, // আশুগঞ্জ (Index: 4)
      { arrival: "05:17 pm", departure: "05:21 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 5)
      { arrival: "05:47 pm", departure: "05:50 pm" }, // আখাউড়া জংশন (Index: 6)
      { arrival: "06:06 pm", departure: "06:08 pm" }, // কসবা (Index: 7)
      { arrival: "06:38 pm", departure: "06:40 pm" }, // কুমিল্লা (Index: 8)
      { arrival: "07:03 pm", departure: "07:06 pm" }, // লাকসাম জংশন (Index: 9)
      { arrival: "07:28 pm", departure: "07:30 pm" }, // নাথেরপেটুয়া (Index: 10)
      { arrival: "07:42 pm", departure: "07:44 pm" }, // সোনাইমুড়ী (Index: 11)
      { arrival: "07:53 pm", departure: "07:55 pm" }, // বজরা (Index: 12)
      { arrival: "08:04 pm", departure: "08:06 pm" }, // চৌমুহনী (Index: 13)
      { arrival: "08:20 pm", departure: "08:22 pm" }, // মাইজদী কোর্ট (Index: 14)
      { arrival: "08:40 pm", departure: "END" }      // নোয়াখালী (Index: 15)
    ]
  },

// --- করতোয়া এক্সপ্রেস (৭১৩ ও ৭১৪) ---
  // সান্তাহার থেকে বুড়িমারী
  "713": {
    stations: [
      { arrival: "START", departure: "09:25 am" }, // সান্তাহার (Index: 0)
      { arrival: "10:09 am", departure: "10:19 am" }, // বগুড়া (Index: 1)
      { arrival: "10:51 am", departure: "10:53 am" }, // সোনাতলা (Index: 2)
      { arrival: "11:03 am", departure: "11:05 am" }, // মহিমাগঞ্জ (Index: 3)
      { arrival: "11:15 am", departure: "11:20 am" }, // বোনারপাড়া (Index: 4)
      { arrival: "11:59 am", departure: "12:04 pm" }, // গাইবান্ধা (Index: 5)
      { arrival: "12:33 pm", departure: "12:35 pm" }, // বামনডাঙ্গা (Index: 6)
      { arrival: "12:53 pm", departure: "12:55 pm" }, // পীরগাছা (Index: 7)
      { arrival: "01:12 pm", departure: "01:15 pm" }, // কাউনিয়া (Index: 8)
      { arrival: "01:22 pm", departure: "01:24 pm" }, // তিস্তা জংশন (Index: 9)
      { arrival: "01:40 pm", departure: "01:50 pm" }, // লালমনিরহাট (Index: 10)
      { arrival: "02:05 pm", departure: "02:07 pm" }, // আদিতমারী (Index: 11)
      { arrival: "02:25 pm", departure: "02:27 pm" }, // কাঁকিনা (Index: 12)
      { arrival: "02:34 pm", departure: "02:36 pm" }, // তুষভান্ডার (Index: 13)
      { arrival: "03:02 pm", departure: "03:04 pm" }, // হাতিবান্ধা (Index: 14)
      { arrival: "03:16 pm", departure: "03:18 pm" }, // বড়খাতা (Index: 15)
      { arrival: "03:27 pm", departure: "03:29 pm" }, // বাউরা (Index: 16)
      { arrival: "03:44 pm", departure: "03:47 pm" }, // পাটগ্রাম (Index: 17)
      { arrival: "04:00 pm", departure: "END" }      // বুড়িমারী (Index: 18)
    ]
  },
  // বুড়িমারী থেকে সান্তাহার
  "714": {
    stations: [
      { arrival: "START", departure: "04:20 pm" }, // বুড়িমারী (Index: 0)
      { arrival: "04:33 pm", departure: "04:36 pm" }, // পাটগ্রাম (Index: 1)
      { arrival: "04:51 pm", departure: "04:53 pm" }, // বাউরা (Index: 2)
      { arrival: "05:02 pm", departure: "05:04 pm" }, // বড়খাতা (Index: 3)
      { arrival: "05:16 pm", departure: "05:19 pm" }, // হাতিবান্ধা (Index: 4)
      { arrival: "05:43 pm", departure: "05:45 pm" }, // তুষভান্ডার (Index: 5)
      { arrival: "05:52 pm", departure: "05:54 pm" }, // কাঁকিনা (Index: 6)
      { arrival: "06:08 pm", departure: "06:10 pm" }, // আদিতমারী (Index: 7)
      { arrival: "06:25 pm", departure: "06:45 pm" }, // লালমনিরহাট (Index: 8)
      { arrival: "07:01 pm", departure: "07:03 pm" }, // তিস্তা জংশন (Index: 9)
      { arrival: "07:10 pm", departure: "07:13 pm" }, // কাউনিয়া (Index: 10)
      { arrival: "07:28 pm", departure: "07:31 pm" }, // পীরগাছা (Index: 11)
      { arrival: "07:48 pm", departure: "07:50 pm" }, // বামনডাঙ্গা (Index: 12)
      { arrival: "08:20 pm", departure: "08:23 pm" }, // গাইবান্ধা (Index: 13)
      { arrival: "08:45 pm", departure: "08:50 pm" }, // বোনারপাড়া (Index: 14)
      { arrival: "09:00 pm", departure: "09:02 pm" }, // মহিমাগঞ্জ (Index: 15)
      { arrival: "09:11 pm", departure: "09:13 pm" }, // সোনাতলা (Index: 16)
      { arrival: "09:45 pm", departure: "09:50 pm" }, // বগুড়া (Index: 17)
      { arrival: "10:40 pm", departure: "END" }      // সান্তাহার (Index: 18)
    ]
  },
  // --- জয়ন্তিকা এক্সপ্রেস (৭১৭ ও ৭১৮) ---
  // ঢাকা থেকে সিলেট
  "717": {
    stations: [
      { arrival: "START", departure: "11:15 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "11:38 am", departure: "11:43 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "12:55 pm", departure: "12:57 pm" }, // আশুগঞ্জ (Index: 2)
      { arrival: "01:11 pm", departure: "01:15 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 3)
      { arrival: "01:37 pm", departure: "01:39 pm" }, // আজমপুর (Index: 4)
      { arrival: "01:52 pm", departure: "01:54 pm" }, // মুুকুন্দপুর (Index: 5)
      { arrival: "02:04 pm", departure: "02:06 pm" }, // হরষপুর (Index: 6)
      { arrival: "02:30 pm", departure: "02:33 pm" }, // মনতলা (Index: 7)
      { arrival: "02:47 pm", departure: "02:49 pm" }, // নোয়াপাড়া - সিলেট (Index: 8)
      { arrival: "03:00 pm", departure: "03:02 pm" }, // শাহজীবাজার (Index: 9)
      { arrival: "03:21 pm", departure: "03:24 pm" }, // শায়েস্তাগঞ্জ (Index: 10)
      { arrival: "04:01 pm", departure: "04:04 pm" }, // শ্রীমঙ্গল (Index: 11)
      { arrival: "04:23 pm", departure: "04:25 pm" }, // ভানুগাছ (Index: 12)
      { arrival: "05:05 pm", departure: "05:09 pm" }, // কুলাউড়া (Index: 13)
      { arrival: "05:33 pm", departure: "05:35 pm" }, // মাইজগাঁও (Index: 14)
      { arrival: "07:00 pm", departure: "END" }      // সিলেট (Index: 15)
    ]
  },
  // সিলেট থেকে ঢাকা
  "718": {
    stations: [
      { arrival: "START", departure: "12:00 pm" }, // সিলেট (Index: 0)
      { arrival: "12:48 pm", departure: "12:50 pm" }, // মাইজগাঁও (Index: 1)
      { arrival: "01:17 pm", departure: "01:20 pm" }, // কুলাউড়া (Index: 2)
      { arrival: "02:19 pm", departure: "02:21 pm" }, // ভানুগাছ (Index: 3)
      { arrival: "02:40 pm", departure: "02:45 pm" }, // শ্রীমঙ্গল (Index: 4)
      { arrival: "03:22 pm", departure: "03:25 pm" }, // শায়েস্তাগঞ্জ (Index: 5)
      { arrival: "03:37 pm", departure: "03:39 pm" }, // শাহজীবাজার (Index: 6)
      { arrival: "03:50 pm", departure: "03:52 pm" }, // নোয়াপাড়া - সিলেট (Index: 7)
      { arrival: "04:07 pm", departure: "04:09 pm" }, // মনতলা (Index: 8)
      { arrival: "04:18 pm", departure: "04:20 pm" }, // হরষপুর (Index: 9)
      { arrival: "04:30 pm", departure: "04:32 pm" }, // মুুকুন্দপুর (Index: 10)
      { arrival: "04:46 pm", departure: "04:48 pm" }, // আজমপুর (Index: 11)
      { arrival: "05:09 pm", departure: "05:13 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 12)
      { arrival: "05:28 pm", departure: "05:30 pm" }, // আশুগঞ্জ (Index: 13)
      { arrival: "06:40 pm", departure: "06:45 pm" }, // ঢাকা বিমানবন্দর (Index: 14)
      { arrival: "07:15 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 15)
    ]
  },

// --- পাহাড়িকা এক্সপ্রেস (৭১৯ ও ৭২০) ---
  // চট্টগ্রাম থেকে সিলেট
  "719": {
    stations: [
      { arrival: "START", departure: "07:50 am" }, // চট্টগ্রাম (Index: 0)
      { arrival: "09:14 am", departure: "09:16 am" }, // ফেনী জংশন (Index: 1)
      { arrival: "09:43 am", departure: "09:45 am" }, // নাঙ্গলকোট (Index: 2)
      { arrival: "10:00 am", departure: "10:03 am" }, // লাকসাম জংশন (Index: 3)
      { arrival: "10:26 am", departure: "10:28 am" }, // কুমিল্লা (Index: 4)
      { arrival: "10:58 am", departure: "11:00 am" }, // কসবা (Index: 5)
      { arrival: "11:30 am", departure: "11:35 am" }, // আখাউড়া জংশন (Index: 6)
      { arrival: "12:05 pm", departure: "12:07 pm" }, // হরষপুর (Index: 7)
      { arrival: "12:28 pm", departure: "12:30 pm" }, // নোয়াপাড়া - সিলেট (Index: 8)
      { arrival: "12:50 pm", departure: "12:53 pm" }, // শায়েস্তাগঞ্জ (Index: 9)
      { arrival: "01:30 pm", departure: "01:35 pm" }, // শ্রীমঙ্গল (Index: 10)
      { arrival: "01:55 pm", departure: "01:57 pm" }, // ভানুগাছ (Index: 11)
      { arrival: "02:06 pm", departure: "02:08 pm" }, // শমশেরনগর (Index: 12)
      { arrival: "02:32 pm", departure: "02:35 pm" }, // কুলাউড়া (Index: 13)
      { arrival: "02:48 pm", departure: "02:50 pm" }, // বরমচাল (Index: 14)
      { arrival: "03:04 pm", departure: "03:06 pm" }, // মাইজগাঁও (Index: 15)
      { arrival: "03:55 pm", departure: "END" }      // সিলেট (Index: 16)
    ]
  },
  // সিলেট থেকে চট্টগ্রাম
  "720": {
    stations: [
      { arrival: "START", departure: "10:30 am" }, // সিলেট (Index: 0)
      { arrival: "11:09 am", departure: "11:11 am" }, // মাইজগাঁও (Index: 1)
      { arrival: "11:55 am", departure: "11:58 am" }, // কুলাউড়া (Index: 2)
      { arrival: "12:21 pm", departure: "12:23 pm" }, // শমশেরনগর (Index: 3)
      { arrival: "12:32 pm", departure: "12:34 pm" }, // ভানুগাছ (Index: 4)
      { arrival: "12:57 pm", departure: "01:02 pm" }, // শ্রীমঙ্গল (Index: 5)
      { arrival: "01:54 pm", departure: "01:57 pm" }, // শায়েস্তাগঞ্জ (Index: 6)
      { arrival: "02:17 pm", departure: "02:19 pm" }, // নোয়াপাড়া - সিলেট (Index: 7)
      { arrival: "02:39 pm", departure: "02:41 pm" }, // হরষপুর (Index: 8)
      { arrival: "03:20 pm", departure: "03:25 pm" }, // আখাউড়া জংশন (Index: 9)
      { arrival: "03:41 pm", departure: "03:43 pm" }, // কসবা (Index: 10)
      { arrival: "04:13 pm", departure: "04:15 pm" }, // কুমিল্লা (Index: 11)
      { arrival: "04:38 pm", departure: "04:40 pm" }, // লাকসাম জংশন (Index: 12)
      { arrival: "04:55 pm", departure: "04:57 pm" }, // নাঙ্গলকোট (Index: 13)
      { arrival: "05:24 pm", departure: "05:26 pm" }, // ফেনী জংশন (Index: 14)
      { arrival: "06:55 pm", departure: "END" }      // চট্টগ্রাম (Index: 15)
    ]
  },
  // --- মহানগর এক্সপ্রেস (৭২১ ও ৭২২) ---
  // চট্টগ্রাম থেকে ঢাকা
  "721": {
    stations: [
      { arrival: "START", departure: "12:30 pm" }, // চট্টগ্রাম (Index: 0)
      { arrival: "12:56 pm", departure: "12:58 pm" }, // কুমিরা (Index: 1)
      { arrival: "01:57 pm", departure: "01:59 pm" }, // ফেনী জংশন (Index: 2)
      { arrival: "02:24 pm", departure: "02:26 pm" }, // নাঙ্গলকোট (Index: 3)
      { arrival: "02:42 pm", departure: "02:44 pm" }, // লাকসাম জংশন (Index: 4)
      { arrival: "03:06 pm", departure: "03:08 pm" }, // কুমিল্লা (Index: 5)
      { arrival: "03:38 pm", departure: "03:40 pm" }, // কসবা (Index: 6)
      { arrival: "04:05 pm", departure: "04:08 pm" }, // আখাউড়া জংশন (Index: 7)
      { arrival: "04:26 pm", departure: "04:30 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 8)
      { arrival: "04:45 pm", departure: "04:47 pm" }, // আশুগঞ্জ (Index: 9)
      { arrival: "04:55 pm", departure: "04:57 pm" }, // ভৈরব বাজার (Index: 10)
      { arrival: "05:27 pm", departure: "05:29 pm" }, // নরসিংদী (Index: 11)
      { arrival: "06:40 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },
  // ঢাকা থেকে চট্টগ্রাম
  "722": {
    stations: [
      { arrival: "START", departure: "09:20 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "09:43 pm", departure: "09:48 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "10:27 pm", departure: "10:30 pm" }, // নরসিংদী (Index: 2)
      { arrival: "11:00 pm", departure: "11:03 pm" }, // ভৈরব বাজার (Index: 3)
      { arrival: "11:11 pm", departure: "11:13 pm" }, // আশুগঞ্জ (Index: 4)
      { arrival: "11:28 pm", departure: "11:31 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 5)
      { arrival: "11:55 pm", departure: "11:58 pm" }, // আখাউড়া জংশন (Index: 6)
      { arrival: "12:14 am", departure: "12:16 am" }, // কসবা (Index: 7)
      { arrival: "12:46 am", departure: "12:48 am" }, // কুমিল্লা (Index: 8)
      { arrival: "01:10 am", departure: "01:12 am" }, // লাকসাম জংশন (Index: 9)
      { arrival: "01:26 am", departure: "01:28 am" }, // নাঙ্গলকোট (Index: 10)
      { arrival: "01:53 am", departure: "01:55 am" }, // ফেনী জংশন (Index: 11)
      { arrival: "02:55 am", departure: "02:57 am" }, // কুমিরা (Index: 12)
      { arrival: "03:30 am", departure: "END" }      // চট্টগ্রাম (Index: 13)
    ]
  },

// --- উদয়ন এক্সপ্রেস (৭২৩ ও ৭২৪) ---
  // চট্টগ্রাম থেকে সিলেট
  "723": {
    stations: [
      { arrival: "START", departure: "09:45 pm" }, // চট্টগ্রাম (Index: 0)
      { arrival: "11:04 pm", departure: "11:07 pm" }, // ফেনী জংশন (Index: 1)
      { arrival: "11:45 pm", departure: "11:47 pm" }, // লাকসাম জংশন (Index: 2)
      { arrival: "12:09 am", departure: "12:12 am" }, // কুমিল্লা (Index: 3)
      { arrival: "01:05 am", departure: "01:10 am" }, // আখাউড়া জংশন (Index: 4)
      { arrival: "02:29 am", departure: "02:32 am" }, // শায়েস্তাগঞ্জ (Index: 5)
      { arrival: "03:10 am", departure: "03:13 am" }, // শ্রীমঙ্গল (Index: 6)
      { arrival: "03:38 am", departure: "03:40 am" }, // শমশেরনগর (Index: 7)
      { arrival: "04:04 am", departure: "04:07 am" }, // কুলাউড়া (Index: 8)
      { arrival: "04:35 am", departure: "04:37 am" }, // মাইজগাঁও (Index: 9)
      { arrival: "05:45 am", departure: "END" }      // সিলেট (Index: 10)
    ]
  },
  // সিলেট থেকে চট্টগ্রাম
  "724": {
    stations: [
      { arrival: "START", departure: "10:00 pm" }, // সিলেট (Index: 0)
      { arrival: "10:39 pm", departure: "10:41 pm" }, // মাইজগাঁও (Index: 1)
      { arrival: "10:58 pm", departure: "11:00 pm" }, // বরমচাল (Index: 2)
      { arrival: "11:13 pm", departure: "11:16 pm" }, // কুলাউড়া (Index: 3)
      { arrival: "11:40 pm", departure: "11:42 pm" }, // শমশেরনগর (Index: 4)
      { arrival: "12:08 am", departure: "12:13 am" }, // শ্রীমঙ্গল (Index: 5)
      { arrival: "12:50 am", departure: "12:53 am" }, // শায়েস্তাগঞ্জ (Index: 6)
      { arrival: "02:15 am", departure: "02:20 am" }, // আখাউড়া জংশন (Index: 7)
      { arrival: "03:03 am", departure: "03:05 am" }, // কুমিল্লা (Index: 8)
      { arrival: "03:27 am", departure: "03:29 am" }, // লাকসাম জংশন (Index: 9)
      { arrival: "04:07 am", departure: "04:09 am" }, // ফেনী জংশন (Index: 10)
      { arrival: "05:35 am", departure: "END" }      // চট্টগ্রাম (Index: 11)
    ]
  },
  // --- মেঘনা এক্সপ্রেস (৭২৯ ও ৭৩০) ---
  // চট্টগ্রাম থেকে চাঁদপুর
  "729": {
    stations: [
      { arrival: "START", departure: "05:15 pm" }, // চট্টগ্রাম (Index: 0)
      { arrival: "05:40 pm", departure: "05:42 pm" }, // কুমিরা (Index: 1)
      { arrival: "06:40 pm", departure: "06:43 pm" }, // ফেনী জংশন (Index: 2)
      { arrival: "07:05 pm", departure: "07:07 pm" }, // হাসানপুর (Index: 3)
      { arrival: "07:15 pm", departure: "07:17 pm" }, // নাঙ্গলকোট (Index: 4)
      { arrival: "07:35 pm", departure: "07:55 pm" }, // লাকসাম জংশন (Index: 5)
      { arrival: "08:10 pm", departure: "08:12 pm" }, // চিতোষী রোড (Index: 6)
      { arrival: "08:21 pm", departure: "08:23 pm" }, // মেহের (Index: 7)
      { arrival: "08:37 pm", departure: "08:39 pm" }, // হাজীগঞ্জ (Index: 8)
      { arrival: "08:52 pm", departure: "08:54 pm" }, // মধু রোড (Index: 9)
      { arrival: "09:08 pm", departure: "09:10 pm" }, // চাঁদপুর কোর্ট (Index: 10)
      { arrival: "09:25 pm", departure: "END" }      // চাঁদপুর (Index: 11)
    ]
  },
  // চাঁদপুর থেকে চট্টগ্রাম
  "730": {
    stations: [
      { arrival: "START", departure: "05:00 am" }, // চাঁদপুর (Index: 0)
      { arrival: "05:05 am", departure: "05:07 am" }, // চাঁদপুর কোর্ট (Index: 1)
      { arrival: "05:22 am", departure: "05:24 am" }, // মধু রোড (Index: 2)
      { arrival: "05:35 am", departure: "05:37 am" }, // হাজীগঞ্জ (Index: 3)
      { arrival: "05:50 am", departure: "05:52 am" }, // মেহের (Index: 4)
      { arrival: "06:04 am", departure: "06:06 am" }, // চিতোষী রোড (Index: 5)
      { arrival: "06:20 am", departure: "06:40 am" }, // লাকসাম জংশন (Index: 6)
      { arrival: "06:54 am", departure: "06:56 am" }, // নাঙ্গলকোট (Index: 7)
      { arrival: "07:03 am", departure: "07:05 am" }, // হাসানপুর (Index: 8)
      { arrival: "07:27 am", departure: "07:30 am" }, // ফেনী জংশন (Index: 9)
      { arrival: "08:30 am", departure: "08:32 am" }, // কুমিরা (Index: 10)
      { arrival: "09:00 am", departure: "END" }      // চট্টগ্রাম (Index: 11)
    ]
  },

// --- অগ্নিবীণা এক্সপ্রেস (৭৩৫ ও ৭৩৬) ---
  // ঢাকা থেকে তারাকান্দি
  "735": {
    stations: [
      { arrival: "START", departure: "11:30 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "11:53 am", departure: "11:55 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "12:20 pm", departure: "12:22 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "01:05 pm", departure: "01:07 pm" }, // গফরগাঁও (Index: 3)
      { arrival: "01:50 pm", departure: "01:55 pm" }, // ময়মনসিংহ (Index: 4)
      { arrival: "03:00 pm", departure: "03:05 pm" }, // জামালপুর টাউন (Index: 5)
      { arrival: "04:18 pm", departure: "04:20 pm" }, // সরিষাবাড়ী (Index: 6)
      { arrival: "04:50 pm", departure: "END" }      // তারাকান্দি (Index: 7)
    ]
  },
  // তারাকান্দি থেকে ঢাকা
  "736": {
    stations: [
      { arrival: "START", departure: "06:30 pm" }, // তারাকান্দি (Index: 0)
      { arrival: "06:58 pm", departure: "07:00 pm" }, // সরিষাবাড়ী (Index: 1)
      { arrival: "07:40 pm", departure: "07:45 pm" }, // জামালপুর টাউন (Index: 2)
      { arrival: "09:00 pm", departure: "09:05 pm" }, // ময়মনসিংহ (Index: 3)
      { arrival: "09:40 pm", departure: "09:42 pm" }, // গফরগাঁও (Index: 4)
      { arrival: "10:25 pm", departure: "10:27 pm" }, // জয়দেবপুর (Index: 5)
      { arrival: "10:50 pm", departure: "10:52 pm" }, // ঢাকা বিমানবন্দর (Index: 6)
      { arrival: "11:50 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 7)
    ]
  },
  // --- এগারোসিন্ধুর প্রভাতী (৭৩৭ ও ৭৩৮) ---
  // ঢাকা থেকে কিশোরগঞ্জ
  "737": {
    stations: [
      { arrival: "START", departure: "07:15 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "07:38 am", departure: "07:43 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "08:22 am", departure: "08:24 am" }, // নরসিংদী (Index: 2)
      { arrival: "08:53 am", departure: "09:13 am" }, // ভৈরব বাজার (Index: 3)
      { arrival: "09:32 am", departure: "09:34 am" }, // কুলিয়ারচর (Index: 4)
      { arrival: "09:42 am", departure: "09:44 am" }, // বাজিতপুর (Index: 5)
      { arrival: "09:52 am", departure: "09:54 am" }, // সরারচর (Index: 6)
      { arrival: "10:10 am", departure: "10:12 am" }, // মানিকখালী (Index: 7)
      { arrival: "10:22 am", departure: "10:24 am" }, // গচিহাটা (Index: 8)
      { arrival: "11:10 am", departure: "END" }      // কিশোরগঞ্জ (Index: 9)
    ]
  },
  // কিশোরগঞ্জ থেকে ঢাকা
  "738": {
    stations: [
      { arrival: "START", departure: "06:30 am" }, // কিশোরগঞ্জ (Index: 0)
      { arrival: "06:45 am", departure: "06:47 am" }, // গচিহাটা (Index: 1)
      { arrival: "06:57 am", departure: "06:59 am" }, // মানিকখালী (Index: 2)
      { arrival: "07:15 am", departure: "07:17 am" }, // সরারচর (Index: 3)
      { arrival: "07:25 am", departure: "07:27 am" }, // বাজিতপুর (Index: 4)
      { arrival: "07:35 am", departure: "07:37 am" }, // কুলিয়ারচর (Index: 5)
      { arrival: "08:00 am", departure: "08:20 am" }, // ভৈরব বাজার (Index: 6)
      { arrival: "08:38 am", departure: "08:40 am" }, // মেথিকান্দা (Index: 7)
      { arrival: "09:02 am", departure: "09:04 am" }, // নরসিংদী (Index: 8)
      { arrival: "09:53 am", departure: "09:58 am" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "10:35 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },

// --- উপবন এক্সপ্রেস (৭৩৯ ও ৭৪০) ---
  // ঢাকা থেকে সিলেট
  "739": {
    stations: [
      { arrival: "START", departure: "10:00 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "10:23 pm", departure: "10:28 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "11:09 pm", departure: "11:11 pm" }, // নরসিংদী (Index: 2)
      { arrival: "11:40 pm", departure: "11:43 pm" }, // ভৈরব বাজার (Index: 3)
      { arrival: "01:22 am", departure: "01:25 am" }, // শায়েস্তাগঞ্জ (Index: 4)
      { arrival: "02:09 am", departure: "02:11 am" }, // শ্রীমঙ্গল (Index: 5)
      { arrival: "02:30 am", departure: "02:32 am" }, // ভানুগাছ (Index: 6)
      { arrival: "02:41 am", departure: "02:43 am" }, // শমশেরনগর (Index: 7)
      { arrival: "03:08 am", departure: "03:11 am" }, // কুলাউড়া (Index: 8)
      { arrival: "03:25 am", departure: "03:27 am" }, // বরমচাল (Index: 9)
      { arrival: "03:43 am", departure: "03:45 am" }, // মাইজগাঁও (Index: 10)
      { arrival: "05:00 am", departure: "END" }      // সিলেট (Index: 11)
    ]
  },
  // সিলেট থেকে ঢাকা
  "740": {
    stations: [
      { arrival: "START", departure: "11:30 pm" }, // সিলেট (Index: 0)
      { arrival: "12:09 am", departure: "12:11 am" }, // মাইজগাঁও (Index: 1)
      { arrival: "12:28 am", departure: "12:30 am" }, // বরমচাল (Index: 2)
      { arrival: "12:43 am", departure: "12:46 am" }, // কুলাউড়া (Index: 3)
      { arrival: "01:09 am", departure: "01:11 am" }, // শমশেরনগর (Index: 4)
      { arrival: "01:20 am", departure: "01:22 am" }, // ভানুগাছ (Index: 5)
      { arrival: "01:41 am", departure: "01:44 am" }, // শ্রীমঙ্গল (Index: 6)
      { arrival: "02:30 am", departure: "02:33 am" }, // শায়েস্তাগঞ্জ (Index: 7)
      { arrival: "04:03 am", departure: "04:06 am" }, // ভৈরব বাজার (Index: 8)
      { arrival: "05:12 am", departure: "05:17 am" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "05:40 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },

// --- তূর্ণা এক্সপ্রেস (৭৪১ ও ৭৪২) ---
  // চট্টগ্রাম থেকে ঢাকা
  "741": {
    stations: [
      { arrival: "START", departure: "11:30 pm" }, // চট্টগ্রাম (Index: 0)
      { arrival: "12:50 am", departure: "12:52 am" }, // ফেনী জংশন (Index: 1)
      { arrival: "01:30 am", departure: "01:32 am" }, // লাকসাম জংশন (Index: 2)
      { arrival: "01:55 am", departure: "01:57 am" }, // কুমিল্লা (Index: 3)
      { arrival: "02:47 am", departure: "02:50 am" }, // আখাউড়া জংশন (Index: 4)
      { arrival: "03:07 am", departure: "03:10 am" }, // ব্রাহ্মণবাড়িয়া (Index: 5)
      { arrival: "03:30 am", departure: "03:33 am" }, // ভৈরব বাজার (Index: 6)
      { arrival: "05:10 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 7)
    ]
  },
  // ঢাকা থেকে চট্টগ্রাম
  "742": {
    stations: [
      { arrival: "START", departure: "11:15 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "11:38 pm", departure: "11:43 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "12:49 am", departure: "12:52 am" }, // ভৈরব বাজার (Index: 2)
      { arrival: "01:12 am", departure: "01:16 am" }, // ব্রাহ্মণবাড়িয়া (Index: 3)
      { arrival: "01:47 am", departure: "01:50 am" }, // আখাউড়া জংশন (Index: 4)
      { arrival: "02:33 am", departure: "02:35 am" }, // কুমিল্লা (Index: 5)
      { arrival: "02:58 am", departure: "03:00 am" }, // লাকসাম জংশন (Index: 6)
      { arrival: "03:40 am", departure: "03:42 am" }, // ফেনী জংশন (Index: 7)
      { arrival: "05:15 am", departure: "END" }      // চট্টগ্রাম (Index: 8)
    ]
  },
  // --- যমুনা এক্সপ্রেস (৭৪৫ ও ৭৪৬) ---
  // ঢাকা থেকে তারাকান্দি
  "745": {
    stations: [
      { arrival: "START", departure: "04:45 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "05:08 pm", departure: "05:13 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "05:38 pm", departure: "05:41 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "06:17 pm", departure: "06:19 pm" }, // শ্রীপুর (Index: 3)
      { arrival: "06:56 pm", departure: "06:58 pm" }, // কাওরাইদ (Index: 4)
      { arrival: "07:22 pm", departure: "07:25 pm" }, // গফরগাঁও (Index: 5)
      { arrival: "08:32 pm", departure: "08:37 pm" }, // ময়মনসিংহ (Index: 6)
      { arrival: "09:13 pm", departure: "09:15 pm" }, // বিদ্যাগঞ্জ (Index: 7)
      { arrival: "09:28 pm", departure: "09:30 pm" }, // পিয়রপুর (Index: 8)
      { arrival: "09:41 pm", departure: "09:43 pm" }, // নরন্দি (Index: 9)
      { arrival: "10:05 pm", departure: "10:09 pm" }, // জামালপুর টাউন (Index: 10)
      { arrival: "10:58 pm", departure: "11:01 pm" }, // সরিষাবাড়ী (Index: 11)
      { arrival: "11:30 pm", departure: "END" }      // তারাকান্দি (Index: 12)
    ]
  },
  // তারাকান্দি থেকে ঢাকা
  "746": {
    stations: [
      { arrival: "START", departure: "02:00 am" }, // তারাকান্দি (Index: 0)
      { arrival: "02:15 am", departure: "02:18 am" }, // সরিষাবাড়ী (Index: 1)
      { arrival: "03:06 am", departure: "03:11 am" }, // জামালপুর টাউন (Index: 2)
      { arrival: "03:33 am", departure: "03:35 am" }, // নরন্দি (Index: 3)
      { arrival: "03:46 am", departure: "03:48 am" }, // পিয়রপুর (Index: 4)
      { arrival: "04:01 am", departure: "04:03 am" }, // বিদ্যাগঞ্জ (Index: 5)
      { arrival: "04:25 am", departure: "04:30 am" }, // ময়মনসিংহ (Index: 6)
      { arrival: "05:16 am", departure: "05:18 am" }, // গফরগাঁও (Index: 7)
      { arrival: "05:42 am", departure: "05:44 am" }, // কাওরাইদ (Index: 8)
      { arrival: "06:15 am", departure: "06:17 am" }, // শ্রীপুর (Index: 9)
      { arrival: "06:55 am", departure: "06:57 am" }, // জয়দেবপুর (Index: 10)
      { arrival: "07:23 am", departure: "07:28 am" }, // ঢাকা বিমানবন্দর (Index: 11)
      { arrival: "08:00 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },

// --- এগারোসিন্ধুর গোধূলি (৭৪৯ ও ৭৫০) ---
  // ঢাকা থেকে কিশোরগঞ্জ
  "749": {
    stations: [
      { arrival: "START", departure: "06:45 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "07:08 pm", departure: "07:13 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "07:55 pm", departure: "07:57 pm" }, // নরসিংদী (Index: 2)
      { arrival: "08:30 pm", departure: "08:50 pm" }, // ভৈরব বাজার (Index: 3)
      { arrival: "09:07 pm", departure: "09:09 pm" }, // কুলিয়ারচর (Index: 4)
      { arrival: "09:17 pm", departure: "09:19 pm" }, // বাজিতপুর (Index: 5)
      { arrival: "09:28 pm", departure: "09:30 pm" }, // সরারচর (Index: 6)
      { arrival: "09:47 pm", departure: "09:49 pm" }, // মানিকখালী (Index: 7)
      { arrival: "10:05 pm", departure: "10:07 pm" }, // গচিহাটা (Index: 8)
      { arrival: "10:40 pm", departure: "END" }      // কিশোরগঞ্জ (Index: 9)
    ]
  },
  // কিশোরগঞ্জ থেকে ঢাকা
  "750": {
    stations: [
      { arrival: "START", departure: "12:50 pm" }, // কিশোরগঞ্জ (Index: 0)
      { arrival: "01:06 pm", departure: "01:08 pm" }, // গচিহাটা (Index: 1)
      { arrival: "01:31 pm", departure: "01:33 pm" }, // মানিকখালী (Index: 2)
      { arrival: "01:52 pm", departure: "01:54 pm" }, // সরারচর (Index: 3)
      { arrival: "02:03 pm", departure: "02:05 pm" }, // বাজিতপুর (Index: 4)
      { arrival: "02:13 pm", departure: "02:15 pm" }, // কুলিয়ারচর (Index: 5)
      { arrival: "02:40 pm", departure: "03:00 pm" }, // ভৈরব বাজার (Index: 6)
      { arrival: "03:13 pm", departure: "03:15 pm" }, // মেথিকান্দা (Index: 7)
      { arrival: "03:29 pm", departure: "03:31 pm" }, // নরসিংদী (Index: 8)
      { arrival: "04:12 pm", departure: "04:17 pm" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "04:45 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },
  // --- দোলনচাঁপা এক্সপ্রেস (৭৬৭ ও ৭৬৮) ---
  // পঞ্চগড় থেকে সান্তাহার
  "768": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // পঞ্চগড় (Index: 0)
      { arrival: "06:21 am", departure: "06:23 am" }, // কিসমত (Index: 1)
      { arrival: "06:33 am", departure: "06:35 am" }, // রুহিয়া (Index: 2)
      { arrival: "06:51 am", departure: "06:54 am" }, // ঠাকুরগাঁও রোড (Index: 3)
      { arrival: "07:13 am", departure: "07:15 am" }, // ভোমরাদহ (Index: 4)
      { arrival: "07:25 am", departure: "07:27 am" }, // পীরগঞ্জ (Index: 5)
      { arrival: "07:43 am", departure: "07:46 am" }, // সেতাবগঞ্জ (Index: 6)
      { arrival: "08:21 am", departure: "08:31 am" }, // দিনাজপুর (Index: 7)
      { arrival: "08:50 am", departure: "08:52 am" }, // চিরিরবন্দর (Index: 8)
      { arrival: "09:15 am", departure: "09:40 am" }, // পার্বতীপুর জংশন (Index: 9)
      { arrival: "09:52 am", departure: "09:54 am" }, // খোলাহাটি (Index: 10)
      { arrival: "10:05 am", departure: "10:08 am" }, // বদরগঞ্জ (Index: 11)
      { arrival: "10:35 am", departure: "10:40 am" }, // রংপুর (Index: 12)
      { arrival: "11:05 am", departure: "11:25 am" }, // কাউনিয়া জংশন (Index: 13)
      { arrival: "11:42 am", departure: "11:45 am" }, // পীরগাছা (Index: 14)
      { arrival: "12:04 pm", departure: "12:07 pm" }, // বামনডাঙ্গা (Index: 15)
      { arrival: "12:52 pm", departure: "12:57 pm" }, // গাইবান্ধা (Index: 16)
      { arrival: "01:13 pm", departure: "01:33 pm" }, // বাদিয়াখালী (Index: 17)
      { arrival: "01:43 pm", departure: "01:48 pm" }, // বোনারপাড়া (Index: 18)
      { arrival: "01:57 pm", departure: "01:59 pm" }, // মহিমাগঞ্জ (Index: 19)
      { arrival: "02:10 pm", departure: "02:12 pm" }, // সোনাতলা (Index: 20)
      { arrival: "02:49 pm", departure: "03:05 pm" }, // বগুড়া (Index: 21)
      { arrival: "03:43 pm", departure: "03:45 pm" }, // তালোড়া (Index: 22)
      { arrival: "04:15 pm", departure: "END" }      // সান্তাহার জংশন (Index: 23)
    ]
  },
  // সান্তাহার থেকে পঞ্চগড়
  "767": {
    stations: [
      { arrival: "START", departure: "11:00 am" }, // সান্তাহার জংশন (Index: 0)
      { arrival: "11:28 am", departure: "11:30 am" }, // তালোড়া (Index: 1)
      { arrival: "11:53 am", departure: "12:01 pm" }, // বগুড়া (Index: 2)
      { arrival: "12:50 pm", departure: "12:52 pm" }, // সোনাতলা (Index: 3)
      { arrival: "01:02 pm", departure: "01:04 pm" }, // মহিমাগঞ্জ (Index: 4)
      { arrival: "01:13 pm", departure: "01:18 pm" }, // বোনারপাড়া (Index: 5)
      { arrival: "01:28 pm", departure: "01:30 pm" }, // বাদিয়াখালী (Index: 6)
      { arrival: "01:45 pm", departure: "01:50 pm" }, // গাইবান্ধা (Index: 7)
      { arrival: "02:21 pm", departure: "02:24 pm" }, // বামনডাঙ্গা (Index: 8)
      { arrival: "02:42 pm", departure: "02:45 pm" }, // পীরগাছা (Index: 9)
      { arrival: "03:05 pm", departure: "03:25 pm" }, // কাউনিয়া জংশন (Index: 10)
      { arrival: "03:48 pm", departure: "03:58 pm" }, // রংপুর (Index: 11)
      { arrival: "04:26 pm", departure: "04:29 pm" }, // বদরগঞ্জ (Index: 12)
      { arrival: "04:40 pm", departure: "04:42 pm" }, // খোলাহাটি (Index: 13)
      { arrival: "04:55 pm", departure: "05:20 pm" }, // পার্বতীপুর জংশন (Index: 14)
      { arrival: "05:40 pm", departure: "05:43 pm" }, // চিরিরবন্দর (Index: 15)
      { arrival: "06:05 pm", departure: "06:13 pm" }, // দিনাজপুর (Index: 16)
      { arrival: "06:48 pm", departure: "06:50 pm" }, // সেতাবগঞ্জ (Index: 17)
      { arrival: "07:06 pm", departure: "07:08 pm" }, // পীরগঞ্জ (Index: 18)
      { arrival: "07:18 pm", departure: "07:20 pm" }, // ভোমরাদহ (Index: 19)
      { arrival: "07:38 pm", departure: "07:41 pm" }, // ঠাকুরগাঁও রোড (Index: 20)
      { arrival: "08:00 pm", departure: "08:02 pm" }, // রুহিয়া (Index: 21)
      { arrival: "08:12 pm", departure: "08:14 pm" }, // কিসমত (Index: 22)
      { arrival: "08:40 pm", departure: "END" }      // পঞ্চগড় (Index: 23)
    ]
  },

// --- কালনী এক্সপ্রেস (৭৭৩ ও ৭৭৪) ---
  // ঢাকা থেকে সিলেট
  "773": {
    stations: [
      { arrival: "START", departure: "02:55 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "03:17 pm", departure: "03:22 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "04:46 pm", departure: "04:49 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 2)
      { arrival: "05:12 pm", departure: "05:14 pm" }, // আজমপুর (Index: 3)
      { arrival: "05:34 pm", departure: "05:36 pm" }, // হরষপুর (Index: 4)
      { arrival: "06:12 pm", departure: "06:15 pm" }, // শায়েস্তাগঞ্জ (Index: 5)
      { arrival: "06:52 pm", departure: "06:55 pm" }, // শ্রীমঙ্গল (Index: 6)
      { arrival: "07:22 pm", departure: "07:26 pm" }, // শমশেরনগর (Index: 7)
      { arrival: "07:49 pm", departure: "07:51 pm" }, // কুলাউড়া (Index: 8)
      { arrival: "08:20 pm", departure: "08:23 pm" }, // মাইজগাঁও (Index: 9)
      { arrival: "09:30 pm", departure: "END" }      // সিলেট (Index: 10)
    ]
  },
  // সিলেট থেকে ঢাকা
  "774": {
    stations: [
      { arrival: "START", departure: "06:15 am" }, // সিলেট (Index: 0)
      { arrival: "06:55 am", departure: "06:57 am" }, // মাইজগাঁও (Index: 1)
      { arrival: "07:23 am", departure: "07:26 am" }, // কুলাউড়া (Index: 2)
      { arrival: "07:50 am", departure: "07:52 am" }, // শমশেরনগর (Index: 3)
      { arrival: "08:17 am", departure: "08:20 am" }, // শ্রীমঙ্গল (Index: 4)
      { arrival: "08:57 am", departure: "09:05 am" }, // শায়েস্তাগঞ্জ (Index: 5)
      { arrival: "09:52 am", departure: "09:54 am" }, // হরষপুর (Index: 6)
      { arrival: "10:20 am", departure: "10:22 am" }, // আজমপুর (Index: 7)
      { arrival: "10:48 am", departure: "10:51 am" }, // ব্রাহ্মণবাড়িয়া (Index: 8)
      { arrival: "11:10 am", departure: "11:13 am" }, // ভৈরব বাজার (Index: 9)
      { arrival: "11:43 am", departure: "11:45 am" }, // নরসিংদী (Index: 10)
      { arrival: "12:24 pm", departure: "12:29 pm" }, // ঢাকা বিমানবন্দর (Index: 11)
      { arrival: "12:55 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },
  // --- হাওর এক্সপ্রেস (৭৭৭ ও ৭৭৮) ---
  // ঢাকা থেকে মোহনগঞ্জ
  "777": {
    stations: [
      { arrival: "START", departure: "10:15 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "10:38 pm", departure: "10:43 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "11:08 pm", departure: "11:10 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "12:27 am", departure: "12:29 am" }, // গফরগাঁও (Index: 3)
      { arrival: "01:15 am", departure: "01:35 am" }, // ময়মনসিংহ (Index: 4)
      { arrival: "02:00 am", departure: "02:05 am" }, // গৌরীপুর (Index: 5)
      { arrival: "02:18 am", departure: "02:21 am" }, // শ্যামগঞ্জ (Index: 6)
      { arrival: "02:40 am", departure: "02:43 am" }, // নেত্রকোনা (Index: 7)
      { arrival: "02:57 am", departure: "02:59 am" }, // ঠাকুরাকোণা (Index: 8)
      { arrival: "03:10 am", departure: "03:13 am" }, // বারহাট্টা (Index: 9)
      { arrival: "04:10 am", departure: "END" }      // মোহনগঞ্জ (Index: 10)
    ]
  },
  // মোহনগঞ্জ থেকে ঢাকা
  "778": {
    stations: [
      { arrival: "START", departure: "08:00 am" }, // মোহনগঞ্জ (Index: 0)
      { arrival: "08:14 am", departure: "08:16 am" }, // বারহাট্টা (Index: 1)
      { arrival: "08:26 am", departure: "08:28 am" }, // ঠাকুরাকোণা (Index: 2)
      { arrival: "08:47 am", departure: "08:52 am" }, // নেত্রকোনা (Index: 3)
      { arrival: "09:15 am", departure: "09:18 am" }, // শ্যামগঞ্জ (Index: 4)
      { arrival: "09:31 am", departure: "09:34 am" }, // গৌরীপুর (Index: 5)
      { arrival: "10:14 am", departure: "10:34 am" }, // ময়মনসিংহ (Index: 6)
      { arrival: "11:19 am", departure: "11:22 am" }, // গফরগাঁও (Index: 7)
      { arrival: "12:53 pm", departure: "12:55 pm" }, // জয়দেবপুর (Index: 8)
      { arrival: "01:22 pm", departure: "01:25 pm" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "01:55 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },

// --- কিশোরগঞ্জ এক্সপ্রেস (৭৮১ ও ৭৮২) ---
  // ঢাকা থেকে কিশোরগঞ্জ
  "781": {
    stations: [
      { arrival: "START", departure: "10:30 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "10:52 am", departure: "10:57 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "11:36 am", departure: "11:39 am" }, // নরসিংদী (Index: 2)
      { arrival: "11:57 am", departure: "11:59 am" }, // মেথিকান্দা (Index: 3)
      { arrival: "12:15 pm", departure: "12:35 pm" }, // ভৈরব বাজার (Index: 4)
      { arrival: "12:54 pm", departure: "12:56 pm" }, // কুলিয়ারচর (Index: 5)
      { arrival: "01:04 pm", departure: "01:06 pm" }, // বাজিতপুর (Index: 6)
      { arrival: "01:14 pm", departure: "01:16 pm" }, // সরারচর (Index: 7)
      { arrival: "01:31 pm", departure: "01:33 pm" }, // মানিকখালী (Index: 8)
      { arrival: "01:40 pm", departure: "01:42 pm" }, // গচিহাটা (Index: 9)
      { arrival: "02:10 pm", departure: "END" }      // কিশোরগঞ্জ (Index: 10)
    ]
  },
  // কিশোরগঞ্জ থেকে ঢাকা
  "782": {
    stations: [
      { arrival: "START", departure: "04:00 pm" }, // কিশোরগঞ্জ (Index: 0)
      { arrival: "04:15 pm", departure: "04:17 pm" }, // গচিহাটা (Index: 1)
      { arrival: "04:27 pm", departure: "04:29 pm" }, // মানিকখালী (Index: 2)
      { arrival: "04:45 pm", departure: "04:47 pm" }, // সরারচর (Index: 3)
      { arrival: "04:55 pm", departure: "04:57 pm" }, // বাজিতপুর (Index: 4)
      { arrival: "05:05 pm", departure: "05:07 pm" }, // কুলিয়ারচর (Index: 5)
      { arrival: "05:28 pm", departure: "05:48 pm" }, // ভৈরব বাজার (Index: 6)
      { arrival: "06:04 pm", departure: "06:06 pm" }, // মেথিকান্দা (Index: 7)
      { arrival: "06:27 pm", departure: "06:30 pm" }, // নরসিংদী (Index: 8)
      { arrival: "07:20 pm", departure: "07:25 pm" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "08:00 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },

// --- বিজয় এক্সপ্রেস (৭৮৫ ও ৭৮৬) ---
  // চট্টগ্রাম থেকে জামালপুর টাউন
  "785": {
    stations: [
      { arrival: "START", departure: "09:15 am" }, // চট্টগ্রাম (Index: 0)
      { arrival: "09:31 am", departure: "09:33 am" }, // ভাটিয়ারী (Index: 1)
      { arrival: "10:39 am", departure: "10:41 am" }, // ফেনী জংশন (Index: 2)
      { arrival: "11:18 am", departure: "11:20 am" }, // লাকসাম জংশন (Index: 3)
      { arrival: "11:42 am", departure: "11:44 am" }, // কুমিল্লা (Index: 4)
      { arrival: "12:35 pm", departure: "12:40 pm" }, // আখাউড়া জংশন (Index: 5)
      { arrival: "01:15 pm", departure: "01:20 pm" }, // ভৈরব বাজার (Index: 6)
      { arrival: "01:52 pm", departure: "01:54 pm" }, // সরারচর (Index: 7)
      { arrival: "02:28 pm", departure: "02:33 pm" }, // কিশোরগঞ্জ (Index: 8)
      { arrival: "03:05 pm", departure: "03:07 pm" }, // আঠারবাড়ী (Index: 9)
      { arrival: "03:35 pm", departure: "03:55 pm" }, // গৌরীপুর (Index: 10)
      { arrival: "04:23 pm", departure: "04:28 pm" }, // ময়মনসিংহ (Index: 11)
      { arrival: "05:06 pm", departure: "05:08 pm" }, // পিয়রপুর (Index: 12)
      { arrival: "06:00 pm", departure: "END" }      // জামালপুর টাউন (Index: 13)
    ]
  },
  // জামালপুর টাউন থেকে চট্টগ্রাম
  "786": {
    stations: [
      { arrival: "START", departure: "08:00 pm" }, // জামালপুর টাউন (Index: 0)
      { arrival: "08:30 pm", departure: "08:32 pm" }, // পিয়রপুর (Index: 1)
      { arrival: "09:05 pm", departure: "09:35 pm" }, // ময়মনসিংহ (Index: 2)
      { arrival: "10:00 pm", departure: "10:20 pm" }, // গৌরীপুর (Index: 3)
      { arrival: "10:47 pm", departure: "10:49 pm" }, // আঠারবাড়ী (Index: 4)
      { arrival: "11:21 pm", departure: "11:26 pm" }, // কিশোরগঞ্জ (Index: 5)
      { arrival: "11:59 pm", departure: "12:01 am" }, // সরারচর (Index: 6)
      { arrival: "12:30 am", departure: "12:35 am" }, // ভৈরব বাজার (Index: 7)
      { arrival: "01:20 am", departure: "01:25 am" }, // আখাউড়া জংশন (Index: 8)
      { arrival: "02:08 am", departure: "02:10 am" }, // কুমিল্লা (Index: 9)
      { arrival: "02:32 am", departure: "02:35 am" }, // লাকসাম জংশন (Index: 10)
      { arrival: "03:15 am", departure: "03:17 am" }, // ফেনী জংশন (Index: 11)
      { arrival: "04:25 am", departure: "04:27 am" }, // ভাটিয়ারী (Index: 12)
      { arrival: "05:00 am", departure: "END" }      // চট্টগ্রাম (Index: 13)
    ]
  },
  // --- কপোতাক্ষ এক্সপ্রেস (৭১৫ ও ৭১৬) ---
  // খুলনা থেকে রাজশাহী
  "715": {
    stations: [
      { arrival: "START", departure: "06:45 am" }, // খুলনা (Index: 0)
      { arrival: "07:18 am", departure: "07:20 am" }, // নওয়াপাড়া (Index: 1)
      { arrival: "07:48 am", departure: "07:51 am" }, // যশোর (Index: 2)
      { arrival: "08:18 am", departure: "08:20 am" }, // মোবারকগঞ্জ (Index: 3)
      { arrival: "08:31 am", departure: "08:33 am" }, // কোটচাঁদপুর (Index: 4)
      { arrival: "08:42 am", departure: "08:44 am" }, // সফদরপুর (Index: 5)
      { arrival: "09:02 am", departure: "09:05 am" }, // দর্শনা হল্ট (Index: 6)
      { arrival: "09:24 am", departure: "09:27 am" }, // চুয়াডাঙ্গা (Index: 7)
      { arrival: "09:42 am", departure: "09:44 am" }, // আলমডাঙ্গা (Index: 8)
      { arrival: "10:00 am", departure: "10:03 am" }, // পোড়াদহ (Index: 9)
      { arrival: "10:13 am", departure: "10:15 am" }, // মিরপুর (Index: 10)
      { arrival: "10:25 am", departure: "10:27 am" }, // ভেড়ামারা (Index: 11)
      { arrival: "10:39 am", departure: "10:41 am" }, // পাকশী (Index: 12)
      { arrival: "10:50 am", departure: "11:10 am" }, // ঈশ্বরদী (Index: 13)
      { arrival: "11:22 am", departure: "11:24 am" }, // আজিজ নগর (Index: 14)
      { arrival: "11:45 am", departure: "11:47 am" }, // আব্দুলপুর (Index: 15)
      { arrival: "12:20 pm", departure: "END" }      // রাজশাহী (Index: 16)
    ]
  },
  // রাজশাহী থেকে খুলনা
  "716": {
    stations: [
      { arrival: "START", departure: "02:30 pm" }, // রাজশাহী (Index: 0)
      { arrival: "03:16 pm", departure: "03:18 pm" }, // আজিজ নগর (Index: 1)
      { arrival: "03:30 pm", departure: "03:45 pm" }, // ঈশ্বরদী (Index: 2)
      { arrival: "03:55 pm", departure: "03:57 pm" }, // পাকশী (Index: 3)
      { arrival: "04:09 pm", departure: "04:12 pm" }, // ভেড়ামারা (Index: 4)
      { arrival: "04:22 pm", departure: "04:24 pm" }, // মিরপুর (Index: 5)
      { arrival: "04:34 pm", departure: "04:37 pm" }, // পোড়াদহ (Index: 6)
      { arrival: "04:53 pm", departure: "04:55 pm" }, // আলমডাঙ্গা (Index: 7)
      { arrival: "05:11 pm", departure: "05:14 pm" }, // চুয়াডাঙ্গা (Index: 8)
      { arrival: "05:34 pm", departure: "05:37 pm" }, // দর্শনা হল্ট (Index: 9)
      { arrival: "05:55 pm", departure: "05:58 pm" }, // সফদরপুর (Index: 10)
      { arrival: "06:14 pm", departure: "06:16 pm" }, // কোটচাঁদপুর (Index: 11)
      { arrival: "06:28 pm", departure: "06:30 pm" }, // মোবারকগঞ্জ (Index: 12)
      { arrival: "07:05 pm", departure: "07:10 pm" }, // যশোর (Index: 13)
      { arrival: "07:38 pm", departure: "07:41 pm" }, // নওয়াপাড়া (Index: 14)
      { arrival: "08:25 pm", departure: "END" }      // খুলনা (Index: 15)
    ]
  },

// --- সুন্দরবন এক্সপ্রেস (৭২৫ ও ৭২৬) ---
  // খুলনা থেকে ঢাকা
  "725": {
    stations: [
      { arrival: "START", departure: "09:45 pm" }, // খুলনা (Index: 0)
      { arrival: "09:57 pm", departure: "09:59 pm" }, // দৌলতপুর (Index: 1)
      { arrival: "10:22 pm", departure: "10:25 pm" }, // নওয়াপাড়া (Index: 2)
      { arrival: "10:53 pm", departure: "10:57 pm" }, // যশোর (Index: 3)
      { arrival: "11:24 pm", departure: "11:26 pm" }, // মোবারকগঞ্জ (Index: 4)
      { arrival: "11:38 pm", departure: "11:40 pm" }, // কোটচাঁদপুর (Index: 5)
      { arrival: "12:05 am", departure: "12:07 am" }, // দর্শনা হল্ট (Index: 6)
      { arrival: "12:21 am", departure: "12:24 am" }, // চুয়াডাঙ্গা (Index: 7)
      { arrival: "12:40 am", departure: "12:42 am" }, // আলমডাঙ্গা (Index: 8)
      { arrival: "12:58 am", departure: "01:00 am" }, // পোড়াদহ (Index: 9)
      { arrival: "01:12 am", departure: "01:15 am" }, // কুষ্টিয়া কোর্ট (Index: 10)
      { arrival: "01:51 am", departure: "01:53 am" }, // পাংশা (Index: 11)
      { arrival: "02:35 am", departure: "02:45 am" }, // রাজবাড়ী (Index: 12)
      { arrival: "03:12 am", departure: "03:15 am" }, // ফরিদপুর (Index: 13)
      { arrival: "03:45 am", departure: "03:47 am" }, // ভাঙ্গা (Index: 14)
      { arrival: "05:10 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 15)
    ]
  },
  // ঢাকা থেকে খুলনা
  "726": {
    stations: [
      { arrival: "START", departure: "08:00 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "09:07 am", departure: "09:09 am" }, // ভাঙ্গা (Index: 1)
      { arrival: "09:39 am", departure: "09:42 am" }, // ফরিদপুর (Index: 2)
      { arrival: "10:15 am", departure: "10:25 am" }, // রাজবাড়ী (Index: 3)
      { arrival: "10:59 am", departure: "11:01 am" }, // পাংশা (Index: 4)
      { arrival: "11:35 am", departure: "11:38 am" }, // কুষ্টিয়া কোর্ট (Index: 5)
      { arrival: "11:50 am", departure: "11:53 am" }, // পোড়াদহ (Index: 6)
      { arrival: "12:09 pm", departure: "12:11 pm" }, // আলমডাঙ্গা (Index: 7)
      { arrival: "12:27 pm", departure: "12:30 pm" }, // চুয়াডাঙ্গা (Index: 8)
      { arrival: "12:50 pm", departure: "12:53 pm" }, // দর্শনা হল্ট (Index: 9)
      { arrival: "01:16 pm", departure: "01:18 pm" }, // কোটচাঁদপুর (Index: 10)
      { arrival: "01:30 pm", departure: "01:33 pm" }, // মোবারকগঞ্জ (Index: 11)
      { arrival: "02:04 pm", departure: "02:08 pm" }, // যশোর (Index: 12)
      { arrival: "02:41 pm", departure: "02:44 pm" }, // নওয়াপাড়া (Index: 13)
      { arrival: "03:08 pm", departure: "03:10 pm" }, // দৌলতপুর (Index: 14)
      { arrival: "03:40 pm", departure: "END" }      // খুলনা (Index: 15)
    ]
  },
  // --- রূপসা এক্সপ্রেস (৭২৭ ও ৭২৮) ---
  // খুলনা থেকে চিলাহাটি
  "727": {
    stations: [
      { arrival: "START", departure: "07:15 am" }, // খুলনা (Index: 0)
      { arrival: "07:48 am", departure: "07:51 am" }, // নওয়াপাড়া (Index: 1)
      { arrival: "08:19 am", departure: "08:23 am" }, // যশোর (Index: 2)
      { arrival: "08:50 am", departure: "08:52 am" }, // মোবারকগঞ্জ (Index: 3)
      { arrival: "09:03 am", departure: "09:05 am" }, // কোটচাঁদপুর (Index: 4)
      { arrival: "09:41 am", departure: "09:44 am" }, // দর্শনা হল্ট (Index: 5)
      { arrival: "10:03 am", departure: "10:06 am" }, // চুয়াডাঙ্গা (Index: 6)
      { arrival: "10:21 am", departure: "10:23 am" }, // আলমডাঙ্গা (Index: 7)
      { arrival: "10:39 am", departure: "10:42 am" }, // পোড়াদহ (Index: 8)
      { arrival: "10:59 am", departure: "11:02 am" }, // ভেড়ামারা (Index: 9)
      { arrival: "11:14 am", departure: "11:16 am" }, // পাকশী (Index: 10)
      { arrival: "11:25 am", departure: "11:40 am" }, // ঈশ্বরদী (Index: 11)
      { arrival: "12:13 pm", departure: "12:16 pm" }, // নাটোর (Index: 12)
      { arrival: "12:57 pm", departure: "01:00 pm" }, // আহসানগঞ্জ (Index: 13)
      { arrival: "01:25 pm", departure: "01:30 pm" }, // সান্তাহার (Index: 14)
      { arrival: "01:50 pm", departure: "01:52 pm" }, // আক্কেলপুর (Index: 15)
      { arrival: "02:05 pm", departure: "02:08 pm" }, // জয়পুরহাট (Index: 16)
      { arrival: "02:36 pm", departure: "02:38 pm" }, // বিরামপুর (Index: 17)
      { arrival: "02:49 pm", departure: "02:51 pm" }, // ফুলবাড়ী (Index: 18)
      { arrival: "03:10 pm", departure: "03:20 pm" }, // পার্বতীপুর (Index: 19)
      { arrival: "03:37 pm", departure: "03:42 pm" }, // সৈয়দপুর (Index: 20)
      { arrival: "04:05 pm", departure: "04:08 pm" }, // নীলফামারী (Index: 21)
      { arrival: "04:24 pm", departure: "04:27 pm" }, // ডোমার (Index: 22)
      { arrival: "05:00 pm", departure: "END" }      // চিলাহাটি (Index: 23)
    ]
  },
  // চিলাহাটি থেকে খুলনা
  "728": {
    stations: [
      { arrival: "START", departure: "08:30 am" }, // চিলাহাটি (Index: 0)
      { arrival: "08:48 am", departure: "08:51 am" }, // ডোমার (Index: 1)
      { arrival: "09:07 am", departure: "09:10 am" }, // নীলফামারী (Index: 2)
      { arrival: "09:30 am", departure: "09:35 am" }, // সৈয়দপুর (Index: 3)
      { arrival: "09:55 am", departure: "10:15 am" }, // পার্বতীপুর (Index: 4)
      { arrival: "10:36 am", departure: "10:39 am" }, // ফুলবাড়ী (Index: 5)
      { arrival: "10:50 am", departure: "10:53 am" }, // বিরামপুর (Index: 6)
      { arrival: "11:22 am", departure: "11:25 am" }, // জয়পুরহাট (Index: 7)
      { arrival: "11:39 am", departure: "11:41 am" }, // আক্কেলপুর (Index: 8)
      { arrival: "12:00 pm", departure: "12:05 pm" }, // সান্তাহার (Index: 9)
      { arrival: "12:28 pm", departure: "12:31 pm" }, // আহসানগঞ্জ (Index: 10)
      { arrival: "12:55 pm", departure: "01:00 pm" }, // নাটোর (Index: 11)
      { arrival: "01:40 pm", departure: "02:00 pm" }, // ঈশ্বরদী (Index: 12)
      { arrival: "02:10 pm", departure: "02:12 pm" }, // পাকশী (Index: 13)
      { arrival: "02:24 pm", departure: "02:27 pm" }, // ভেড়ামারা (Index: 14)
      { arrival: "02:44 pm", departure: "02:47 pm" }, // পোড়াদহ (Index: 15)
      { arrival: "03:02 pm", departure: "03:04 pm" }, // আলমডাঙ্গা (Index: 16)
      { arrival: "03:20 pm", departure: "03:23 pm" }, // চুয়াডাঙ্গা (Index: 17)
      { arrival: "03:45 pm", departure: "03:48 pm" }, // দর্শনা হল্ট (Index: 18)
      { arrival: "04:14 pm", departure: "04:16 pm" }, // কোটচাঁদপুর (Index: 19)
      { arrival: "04:28 pm", departure: "04:30 pm" }, // মোবারকগঞ্জ (Index: 20)
      { arrival: "04:58 pm", departure: "05:08 pm" }, // যশোর (Index: 21)
      { arrival: "05:36 pm", departure: "05:39 pm" }, // নওয়াপাড়া (Index: 22)
      { arrival: "06:25 pm", departure: "END" }      // খুলনা (Index: 23)
    ]
  },

// --- বরেন্দ্র এক্সপ্রেস (৭৩১ ও ৭৩২) ---
  // রাজশাহী থেকে চিলাহাটি
  "731": {
    stations: [
      { arrival: "START", departure: "03:00 pm" }, // রাজশাহী (Index: 0)
      { arrival: "03:40 pm", departure: "04:00 pm" }, // আব্দুলপুর (Index: 1)
      { arrival: "04:17 pm", departure: "04:20 pm" }, // নাটোর (Index: 2)
      { arrival: "04:41 pm", departure: "04:44 pm" }, // আহসানগঞ্জ (Index: 3)
      { arrival: "05:20 pm", departure: "05:30 pm" }, // সান্তাহার (Index: 4)
      { arrival: "05:50 pm", departure: "05:52 pm" }, // আক্কেলপুর (Index: 5)
      { arrival: "06:07 pm", departure: "06:10 pm" }, // জয়পুরহাট (Index: 6)
      { arrival: "06:28 pm", departure: "06:30 pm" }, // পাঁচবিবি (Index: 7)
      { arrival: "06:50 pm", departure: "06:53 pm" }, // বিরামপুর (Index: 8)
      { arrival: "07:04 pm", departure: "07:07 pm" }, // ফুলবাড়ী (Index: 9)
      { arrival: "07:25 pm", departure: "07:45 pm" }, // পার্বতীপুর (Index: 10)
      { arrival: "08:11 pm", departure: "08:14 pm" }, // সৈয়দপুর (Index: 11)
      { arrival: "08:33 pm", departure: "08:36 pm" }, // নীলফামারী (Index: 12)
      { arrival: "08:58 pm", departure: "09:01 pm" }, // ডোমার (Index: 13)
      { arrival: "09:30 pm", departure: "END" }      // চিলাহাটি (Index: 14)
    ]
  },
  // চিলাহাটি থেকে রাজশাহী
  "732": {
    stations: [
      { arrival: "START", departure: "05:00 am" }, // চিলাহাটি (Index: 0)
      { arrival: "05:18 am", departure: "05:21 am" }, // ডোমার (Index: 1)
      { arrival: "05:36 am", departure: "05:39 am" }, // নীলফামারী (Index: 2)
      { arrival: "06:04 am", departure: "06:08 am" }, // সৈয়দপুর (Index: 3)
      { arrival: "06:25 am", departure: "06:45 am" }, // পার্বতীপুর (Index: 4)
      { arrival: "07:03 am", departure: "07:06 am" }, // ফুলবাড়ী (Index: 5)
      { arrival: "07:17 am", departure: "07:20 am" }, // বিরামপুর (Index: 6)
      { arrival: "07:33 am", departure: "07:35 am" }, // হিলি (Index: 7)
      { arrival: "07:45 am", departure: "07:47 am" }, // পাঁচবিবি (Index: 8)
      { arrival: "07:58 am", departure: "08:01 am" }, // জয়পুরহাট (Index: 9)
      { arrival: "08:15 am", departure: "08:17 am" }, // আক্কেলপুর (Index: 10)
      { arrival: "08:40 am", departure: "08:45 am" }, // সান্তাহার (Index: 11)
      { arrival: "09:07 am", departure: "09:10 am" }, // আহসানগঞ্জ (Index: 12)
      { arrival: "09:32 am", departure: "09:35 am" }, // নাটোর (Index: 13)
      { arrival: "09:55 am", departure: "10:15 am" }, // আব্দুলপুর (Index: 14)
      { arrival: "11:10 am", departure: "END" }      // রাজশাহী (Index: 15)
    ]
  },
  // --- তিতুমীর এক্সপ্রেস (৭৩৩ ও ৭৩৪) ---
  // রাজশাহী থেকে চিলাহাটি
  "733": {
    stations: [
      { arrival: "START", departure: "06:20 am" }, // রাজশাহী (Index: 0)
      { arrival: "07:00 am", departure: "07:20 am" }, // আব্দুলপুর (Index: 1)
      { arrival: "07:47 am", departure: "07:51 am" }, // নাটোর (Index: 2)
      { arrival: "08:05 am", departure: "08:07 am" }, // মাধনগর (Index: 3)
      { arrival: "08:16 am", departure: "08:19 am" }, // আহসানগঞ্জ (Index: 4)
      { arrival: "08:45 am", departure: "08:50 am" }, // সান্তাহার (Index: 5)
      { arrival: "09:10 am", departure: "09:12 am" }, // আক্কেলপুর (Index: 6)
      { arrival: "09:20 am", departure: "09:22 am" }, // জামালগঞ্জ (Index: 7)
      { arrival: "09:30 am", departure: "09:33 am" }, // জয়পুরহাট (Index: 8)
      { arrival: "09:44 am", departure: "09:46 am" }, // পাঁচবিবি (Index: 9)
      { arrival: "09:56 am", departure: "09:58 am" }, // হিলি (Index: 10)
      { arrival: "10:10 am", departure: "10:13 am" }, // বিরামপুর (Index: 11)
      { arrival: "10:31 am", departure: "10:34 am" }, // ফুলবাড়ী (Index: 12)
      { arrival: "11:10 am", departure: "11:30 am" }, // পার্বতীপুর (Index: 13)
      { arrival: "11:47 am", departure: "11:52 am" }, // সৈয়দপুর (Index: 14)
      { arrival: "12:11 pm", departure: "12:14 pm" }, // নীলফামারী (Index: 15)
      { arrival: "12:30 pm", departure: "12:33 pm" }, // ডোমার (Index: 16)
      { arrival: "01:00 pm", departure: "END" }      // চিলাহাটি (Index: 17)
    ]
  },
  // চিলাহাটি থেকে রাজশাহী
  "734": {
    stations: [
      { arrival: "START", departure: "03:00 pm" }, // চিলাহাটি (Index: 0)
      { arrival: "03:21 pm", departure: "03:24 pm" }, // ডোমার (Index: 1)
      { arrival: "03:41 pm", departure: "03:44 pm" }, // নীলফামারী (Index: 2)
      { arrival: "04:15 pm", departure: "04:19 pm" }, // সৈয়দপুর (Index: 3)
      { arrival: "04:35 pm", departure: "04:55 pm" }, // পার্বতীপুর (Index: 4)
      { arrival: "05:13 pm", departure: "05:16 pm" }, // ফুলবাড়ী (Index: 5)
      { arrival: "05:27 pm", departure: "05:30 pm" }, // বিরামপুর (Index: 6)
      { arrival: "05:59 pm", departure: "06:01 pm" }, // পাঁচবিবি (Index: 7)
      { arrival: "06:12 pm", departure: "06:15 pm" }, // জয়পুরহাট (Index: 8)
      { arrival: "06:23 pm", departure: "06:25 pm" }, // জামালগঞ্জ (Index: 9)
      { arrival: "06:33 pm", departure: "06:35 pm" }, // আক্কেলপুর (Index: 10)
      { arrival: "06:55 pm", departure: "07:00 pm" }, // সান্তাহার (Index: 11)
      { arrival: "07:22 pm", departure: "07:24 pm" }, // আহসানগঞ্জ (Index: 12)
      { arrival: "07:33 pm", departure: "07:35 pm" }, // মাধনগর (Index: 13)
      { arrival: "07:50 pm", departure: "07:53 pm" }, // নাটোর (Index: 14)
      { arrival: "08:10 pm", departure: "08:30 pm" }, // আব্দুলপুর (Index: 15)
      { arrival: "09:30 pm", departure: "END" }      // রাজশাহী (Index: 16)
    ]
  },

// --- সীমান্ত এক্সপ্রেস (৭৪৭ ও ৭৪৮) ---
  // খুলনা থেকে চিলাহাটি
  "747": {
    stations: [
      { arrival: "START", departure: "09:15 pm" }, // খুলনা (Index: 0)
      { arrival: "09:27 pm", departure: "09:29 pm" }, // দৌলতপুর (Index: 1)
      { arrival: "09:52 pm", departure: "09:55 pm" }, // নওয়াপাড়া (Index: 2)
      { arrival: "10:23 pm", departure: "10:27 pm" }, // যশোর (Index: 3)
      { arrival: "10:54 pm", departure: "10:56 pm" }, // মোবারকগঞ্জ (Index: 4)
      { arrival: "11:08 pm", departure: "11:10 pm" }, // কোটচাঁদপুর (Index: 5)
      { arrival: "11:35 pm", departure: "11:38 pm" }, // দর্শনা হল্ট (Index: 6)
      { arrival: "11:57 pm", departure: "12:00 am" }, // চুয়াডাঙ্গা (Index: 7)
      { arrival: "12:16 am", departure: "12:18 am" }, // আলমডাঙ্গা (Index: 8)
      { arrival: "12:34 am", departure: "12:37 am" }, // পোড়াদহ (Index: 9)
      { arrival: "12:54 am", departure: "12:57 am" }, // ভেড়ামারা (Index: 10)
      { arrival: "01:20 am", departure: "01:30 am" }, // ঈশ্বরদী (Index: 11)
      { arrival: "02:07 am", departure: "02:10 am" }, // নাটোর (Index: 12)
      { arrival: "03:05 am", departure: "03:10 am" }, // সান্তাহার (Index: 13)
      { arrival: "03:30 am", departure: "03:32 am" }, // আক্কেলপুর (Index: 14)
      { arrival: "03:46 am", departure: "03:49 am" }, // জয়পুরহাট (Index: 15)
      { arrival: "04:17 am", departure: "04:19 am" }, // বিরামপুর (Index: 16)
      { arrival: "04:30 am", departure: "04:32 am" }, // ফুলবাড়ী (Index: 17)
      { arrival: "04:50 am", departure: "05:00 am" }, // পার্বতীপুর (Index: 18)
      { arrival: "05:17 am", departure: "05:22 am" }, // সৈয়দপুর (Index: 19)
      { arrival: "05:41 am", departure: "05:45 am" }, // নীলফামারী (Index: 20)
      { arrival: "06:01 am", departure: "06:23 am" }, // ডোমার (Index: 21)
      { arrival: "06:45 am", departure: "END" }      // চিলাহাটি (Index: 22)
    ]
  },
  // চিলাহাটি থেকে খুলনা
  "748": {
    stations: [
      { arrival: "START", departure: "06:30 pm" }, // চিলাহাটি (Index: 0)
      { arrival: "06:48 pm", departure: "06:51 pm" }, // ডোমার (Index: 1)
      { arrival: "07:07 pm", departure: "07:10 pm" }, // নীলফামারী (Index: 2)
      { arrival: "07:29 pm", departure: "07:34 pm" }, // সৈয়দপুর (Index: 3)
      { arrival: "07:50 pm", departure: "08:10 pm" }, // পার্বতীপুর (Index: 4)
      { arrival: "08:28 pm", departure: "08:31 pm" }, // ফুলবাড়ী (Index: 5)
      { arrival: "08:42 pm", departure: "08:45 pm" }, // বিরামপুর (Index: 6)
      { arrival: "09:14 pm", departure: "09:17 pm" }, // জয়পুরহাট (Index: 7)
      { arrival: "09:31 pm", departure: "09:33 pm" }, // আক্কেলপুর (Index: 8)
      { arrival: "09:55 pm", departure: "10:00 pm" }, // সান্তাহার (Index: 9)
      { arrival: "10:40 pm", departure: "10:43 pm" }, // নাটোর (Index: 11)
      { arrival: "11:20 pm", departure: "11:40 pm" }, // ঈশ্বরদী (Index: 12)
      { arrival: "12:00 am", departure: "12:03 am" }, // ভেড়ামারা (Index: 13)
      { arrival: "12:21 am", departure: "12:24 am" }, // পোড়াদহ (Index: 14)
      { arrival: "12:40 am", departure: "12:42 am" }, // আলমডাঙ্গা (Index: 15)
      { arrival: "01:00 am", departure: "01:03 am" }, // চুয়াডাঙ্গা (Index: 16)
      { arrival: "01:24 am", departure: "01:26 am" }, // দর্শনা হল্ট (Index: 17)
      { arrival: "01:50 am", departure: "01:52 am" }, // কোটচাঁদপুর (Index: 18)
      { arrival: "02:04 am", departure: "02:06 am" }, // মোবারকগঞ্জ (Index: 19)
      { arrival: "02:41 am", departure: "02:45 am" }, // যশোর (Index: 20)
      { arrival: "03:13 am", departure: "03:16 am" }, // নওয়াপাড়া (Index: 21)
      { arrival: "03:41 am", departure: "03:43 am" }, // দৌলতপুর (Index: 22)
      { arrival: "04:10 am", departure: "END" }      // খুলনা (Index: 23)
    ]
  },
  // --- সিল্কসিটি এক্সপ্রেস (৭৫৩ ও ৭৫৪) ---
  // ঢাকা থেকে রাজশাহী
  "753": {
    stations: [
      { arrival: "START", departure: "02:30 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "02:53 pm", departure: "02:58 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "03:21 pm", departure: "03:24 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "03:57 pm", departure: "03:59 pm" }, // মির্জাপুর (Index: 3)
      { arrival: "04:26 pm", departure: "04:28 pm" }, // টাঙ্গাইল (Index: 4)
      { arrival: "04:48 pm", departure: "04:50 pm" }, // ইব্রাহিমাবাদ (Index: 5)
      { arrival: "05:06 pm", departure: "05:09 pm" }, // শহীদ এম মনসুর আলী (Index: 6)
      { arrival: "05:17 pm", departure: "05:19 pm" }, // জামতৈল (Index: 7)
      { arrival: "05:31 pm", departure: "05:34 pm" }, // উল্লাপাড়া (Index: 8)
      { arrival: "06:06 pm", departure: "06:09 pm" }, // বড়াল ব্রিজ (Index: 9)
      { arrival: "06:23 pm", departure: "06:28 pm" }, // চাটমোহর (Index: 10)
      { arrival: "06:48 pm", departure: "06:51 pm" }, // ঈশ্বরদী বাইপাস (Index: 11)
      { arrival: "07:06 pm", departure: "07:09 pm" }, // আব্দুলপুর (Index: 12)
      { arrival: "08:20 pm", departure: "END" }      // রাজশাহী (Index: 13)
    ]
  },
  // রাজশাহী থেকে ঢাকা
  "754": {
    stations: [
      { arrival: "START", departure: "07:40 am" }, // রাজশাহী (Index: 0)
      { arrival: "08:20 am", departure: "08:22 am" }, // আব্দুলপুর (Index: 1)
      { arrival: "08:37 am", departure: "08:39 am" }, // ঈশ্বরদী বাইপাস (Index: 2)
      { arrival: "08:58 am", departure: "09:01 am" }, // চাটমোহর (Index: 3)
      { arrival: "09:14 am", departure: "09:17 am" }, // বড়াল ব্রিজ (Index: 4)
      { arrival: "09:36 am", departure: "09:39 am" }, // উল্লাপাড়া (Index: 5)
      { arrival: "09:51 am", departure: "09:53 am" }, // জামতৈল (Index: 6)
      { arrival: "10:01 am", departure: "10:04 am" }, // শহীদ এম মনসুর আলী (Index: 7)
      { arrival: "10:20 am", departure: "10:22 am" }, // ইব্রাহিমাবাদ (Index: 8)
      { arrival: "10:42 am", departure: "10:44 am" }, // টাঙ্গাইল (Index: 9)
      { arrival: "11:08 am", departure: "11:10 am" }, // মির্জাপুর (Index: 10)
      { arrival: "12:05 pm", departure: "12:08 pm" }, // জয়দেবপুর (Index: 11)
      { arrival: "01:10 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },

// --- মধুমতি এক্সপ্রেস (৭৫৫ ও ৭৫৬) ---
  // ঢাকা থেকে রাজশাহী
  "755": {
    stations: [
      { arrival: "START", departure: "03:00 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "03:33 pm", departure: "03:35 pm" }, // শ্রীনগর (Index: 1)
      { arrival: "03:36 pm", departure: "03:38 pm" }, // মাওয়া (Index: 2)
      { arrival: "03:51 pm", departure: "03:53 pm" }, // পদ্মা (Index: 3)
      { arrival: "04:03 pm", departure: "04:05 pm" }, // শিবচর (Index: 4)
      { arrival: "04:28 pm", departure: "04:30 pm" }, // ভাঙ্গা (Index: 5)
      { arrival: "04:45 pm", departure: "04:47 pm" }, // পুকুরিয়া (Index: 6)
      { arrival: "04:48 pm", departure: "04:50 pm" }, // তালমা (Index: 7)
      { arrival: "05:03 pm", departure: "05:06 pm" }, // ফরিদপুর (Index: 8)
      { arrival: "05:18 pm", departure: "05:20 pm" }, // আমিরবাদ (Index: 9)
      { arrival: "05:35 pm", departure: "05:37 pm" }, // পাঁচুরিয়া (Index: 10)
      { arrival: "05:45 pm", departure: "06:00 pm" }, // রাজবাড়ী (Index: 11)
      { arrival: "06:23 pm", departure: "06:25 pm" }, // কালুখালী (Index: 12)
      { arrival: "06:35 pm", departure: "06:37 pm" }, // পাংশা (Index: 13)
      { arrival: "06:51 pm", departure: "06:53 pm" }, // খোকসা (Index: 14)
      { arrival: "07:03 pm", departure: "07:05 pm" }, // কুমারখালী (Index: 15)
      { arrival: "07:22 pm", departure: "07:25 pm" }, // কুষ্টিয়া কোর্ট (Index: 16)
      { arrival: "07:45 pm", departure: "08:10 pm" }, // পোড়াদহ (Index: 17)
      { arrival: "08:20 pm", departure: "08:22 pm" }, // মিরপুর (Index: 18)
      { arrival: "08:32 pm", departure: "08:35 pm" }, // ভেড়ামারা (Index: 19)
      { arrival: "08:47 pm", departure: "08:49 pm" }, // পাকশী (Index: 20)
      { arrival: "09:05 pm", departure: "09:25 pm" }, // ঈশ্বরদী (Index: 21)
      { arrival: "10:30 pm", departure: "END" }      // রাজশাহী (Index: 22)
    ]
  },
  // রাজশাহী থেকে ঢাকা
  "756": {
    stations: [
      { arrival: "START", departure: "06:40 am" }, // রাজশাহী (Index: 0)
      { arrival: "07:40 am", departure: "08:00 am" }, // ঈশ্বরদী (Index: 1)
      { arrival: "08:10 am", departure: "08:12 am" }, // পাকশী (Index: 2)
      { arrival: "08:24 am", departure: "08:27 am" }, // ভেড়ামারা (Index: 3)
      { arrival: "08:37 am", departure: "08:39 am" }, // মিরপুর (Index: 4)
      { arrival: "08:50 am", departure: "09:10 am" }, // পোড়াদহ (Index: 5)
      { arrival: "09:22 am", departure: "09:25 am" }, // কুষ্টিয়া কোর্ট (Index: 6)
      { arrival: "09:42 am", departure: "09:44 am" }, // কুমারখালী (Index: 7)
      { arrival: "10:01 am", departure: "10:03 am" }, // খোকসা (Index: 8)
      { arrival: "10:18 am", departure: "10:20 am" }, // পাংশা (Index: 9)
      { arrival: "10:29 am", departure: "10:31 am" }, // কালুখালী (Index: 10)
      { arrival: "10:50 am", departure: "11:05 am" }, // রাজবাড়ী (Index: 11)
      { arrival: "11:14 am", departure: "11:16 am" }, // পাঁচুরিয়া (Index: 12)
      { arrival: "11:32 am", departure: "11:34 am" }, // আমিরবাদ (Index: 13)
      { arrival: "11:47 am", departure: "11:49 am" }, // ফরিদপুর (Index: 14)
      { arrival: "12:05 pm", departure: "12:07 pm" }, // তালমা (Index: 15)
      { arrival: "12:10 pm", departure: "12:12 pm" }, // পুকুরিয়া (Index: 16)
      { arrival: "12:24 pm", departure: "12:26 pm" }, // ভাঙ্গা (Index: 17)
      { arrival: "12:47 pm", departure: "12:49 pm" }, // শিবচর (Index: 18)
      { arrival: "12:59 pm", departure: "01:01 pm" }, // পদ্মা (Index: 19)
      { arrival: "01:14 pm", departure: "01:16 pm" }, // মাওয়া (Index: 20)
      { arrival: "01:18 pm", departure: "01:20 pm" }, // শ্রীনগর (Index: 21)
      { arrival: "02:00 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 22)
    ]
  },
  // --- পদ্মা এক্সপ্রেস (৭৫৯ ও ৭৬০) ---
  // ঢাকা থেকে রাজশাহী
  "759": {
    stations: [
      { arrival: "START", departure: "10:45 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "11:08 pm", departure: "11:13 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "11:36 pm", departure: "11:38 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "12:32 am", departure: "12:34 am" }, // টাঙ্গাইল (Index: 3)
      { arrival: "12:54 am", departure: "12:56 am" }, // ইব্রাহিমাবাদ (Index: 4)
      { arrival: "01:11 am", departure: "01:14 am" }, // শহীদ এম মনসুর আলী (Index: 5)
      { arrival: "01:30 am", departure: "01:33 am" }, // উল্লাপাড়া (Index: 6)
      { arrival: "01:51 am", departure: "01:53 am" }, // বড়াল ব্রিজ (Index: 7)
      { arrival: "02:07 am", departure: "02:10 am" }, // চাটমোহর (Index: 8)
      { arrival: "02:30 am", departure: "02:33 am" }, // ঈশ্বরদী বাইপাস (Index: 9)
      { arrival: "02:48 am", departure: "02:50 am" }, // আব্দুলপুর (Index: 10)
      { arrival: "03:16 am", departure: "03:18 am" }, // সারদাহ রোড (Index: 11)
      { arrival: "04:00 am", departure: "END" }      // রাজশাহী (Index: 12)
    ]
  },
  // রাজশাহী থেকে ঢাকা
  "760": {
    stations: [
      { arrival: "START", departure: "04:00 pm" }, // রাজশাহী (Index: 0)
      { arrival: "04:17 pm", departure: "04:19 pm" }, // সারদাহ রোড (Index: 1)
      { arrival: "04:45 pm", departure: "04:47 pm" }, // আব্দুলপুর (Index: 2)
      { arrival: "05:01 pm", departure: "05:03 pm" }, // ঈশ্বরদী বাইপাস (Index: 3)
      { arrival: "05:22 pm", departure: "05:25 pm" }, // চাটমোহর (Index: 4)
      { arrival: "05:38 pm", departure: "05:40 pm" }, // বড়াল ব্রিজ (Index: 5)
      { arrival: "05:59 pm", departure: "06:02 pm" }, // উল্লাপাড়া (Index: 6)
      { arrival: "06:18 pm", departure: "06:21 pm" }, // শহীদ এম মনসুর আলী (Index: 7)
      { arrival: "06:38 pm", departure: "06:40 pm" }, // ইব্রাহিমাবাদ (Index: 8)
      { arrival: "07:00 pm", departure: "07:02 pm" }, // টাঙ্গাইল (Index: 9)
      { arrival: "08:14 pm", departure: "08:18 pm" }, // জয়দেবপুর (Index: 10)
      { arrival: "09:15 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 11)
    ]
  },

// --- সাগরদাঁড়ি এক্সপ্রেস (৭৬১ ও ৭৬২) ---
  // খুলনা থেকে রাজশাহী
  "761": {
    stations: [
      { arrival: "START", departure: "04:00 pm" }, // খুলনা (Index: 0)
      { arrival: "04:33 pm", departure: "04:36 pm" }, // নওয়াপাড়া (Index: 1)
      { arrival: "05:03 pm", departure: "05:08 pm" }, // যশোর (Index: 2)
      { arrival: "05:35 pm", departure: "05:37 pm" }, // মোবারকগঞ্জ (Index: 3)
      { arrival: "05:49 pm", departure: "05:51 pm" }, // কোটচাঁদপুর (Index: 4)
      { arrival: "06:00 pm", departure: "06:02 pm" }, // সফদারপুর (Index: 5)
      { arrival: "06:21 pm", departure: "06:24 pm" }, // দর্শনা হল্ট (Index: 6)
      { arrival: "06:43 pm", departure: "06:46 pm" }, // চুয়াডাঙ্গা (Index: 7)
      { arrival: "07:02 pm", departure: "07:04 pm" }, // আলমডাঙ্গা (Index: 8)
      { arrival: "07:20 pm", departure: "07:23 pm" }, // পোড়াদহ (Index: 9)
      { arrival: "07:33 pm", departure: "07:35 pm" }, // মিরপুর (Index: 10)
      { arrival: "07:45 pm", departure: "07:47 pm" }, // ভেড়ামারা (Index: 11)
      { arrival: "07:59 pm", departure: "08:01 pm" }, // পাকশী (Index: 12)
      { arrival: "08:10 pm", departure: "08:30 pm" }, // ঈশ্বরদী (Index: 13)
      { arrival: "08:43 pm", departure: "08:45 pm" }, // আজিম নগর (Index: 14)
      { arrival: "08:53 pm", departure: "08:56 pm" }, // আব্দুলপুর (Index: 15)
      { arrival: "10:00 pm", departure: "END" }      // রাজশাহী (Index: 16)
    ]
  },
  // রাজশাহী থেকে খুলনা
  "762": {
    stations: [
      { arrival: "START", departure: "06:00 am" }, // রাজশাহী (Index: 0)
      { arrival: "06:40 am", departure: "06:42 am" }, // আব্দুলপুর (Index: 1)
      { arrival: "06:51 am", departure: "06:53 am" }, // আজিম নগর (Index: 2)
      { arrival: "07:10 am", departure: "07:30 am" }, // ঈশ্বরদী (Index: 3)
      { arrival: "07:40 am", departure: "07:42 am" }, // পাকশী (Index: 4)
      { arrival: "07:54 am", departure: "07:57 am" }, // ভেড়ামারা (Index: 5)
      { arrival: "08:07 am", departure: "08:09 am" }, // মিরপুর (Index: 6)
      { arrival: "08:19 am", departure: "08:22 am" }, // পোড়াদহ (Index: 7)
      { arrival: "08:38 am", departure: "08:40 am" }, // আলমডাঙ্গা (Index: 8)
      { arrival: "08:56 am", departure: "08:59 am" }, // চুয়াডাঙ্গা (Index: 9)
      { arrival: "09:20 am", departure: "09:23 am" }, // দর্শনা হল্ট (Index: 10)
      { arrival: "09:40 am", departure: "09:42 am" }, // সফদারপুর (Index: 11)
      { arrival: "09:51 am", departure: "09:53 am" }, // কোটচাঁদপুর (Index: 12)
      { arrival: "10:05 am", departure: "10:07 am" }, // মোবারকগঞ্জ (Index: 13)
      { arrival: "10:35 am", departure: "10:39 am" }, // যশোর (Index: 14)
      { arrival: "11:07 am", departure: "11:10 am" }, // নওয়াপাড়া (Index: 15)
      { arrival: "12:10 pm", departure: "END" }      // খুলনা (Index: 16)
    ]
  },
  // --- চিত্রা এক্সপ্রেস (৭৬৩ ও ৭৬৪) ---
  // খুলনা থেকে ঢাকা
  "763": {
    stations: [
      { arrival: "START", departure: "09:00 am" }, // খুলনা (Index: 0)
      { arrival: "09:33 am", departure: "09:36 am" }, // নওয়াপাড়া (Index: 1)
      { arrival: "10:04 am", departure: "10:08 am" }, // যশোর (Index: 2)
      { arrival: "10:49 am", departure: "10:51 am" }, // মোবারকগঞ্জ (Index: 3)
      { arrival: "11:02 am", departure: "11:04 am" }, // কোটচাঁদপুর (Index: 4)
      { arrival: "11:28 am", departure: "11:31 am" }, // দর্শনা হল্ট (Index: 5)
      { arrival: "11:50 am", departure: "11:53 am" }, // চুয়াডাঙ্গা (Index: 6)
      { arrival: "12:09 pm", departure: "12:11 pm" }, // আলমডাঙ্গা (Index: 7)
      { arrival: "12:27 pm", departure: "12:30 pm" }, // পোড়াদহ (Index: 8)
      { arrival: "12:40 pm", departure: "12:42 pm" }, // মিরপুর (Index: 9)
      { arrival: "12:52 pm", departure: "12:55 pm" }, // ভেড়ামারা (Index: 10)
      { arrival: "01:15 pm", departure: "01:25 pm" }, // ঈশ্বরদী (Index: 11)
      { arrival: "01:48 pm", departure: "01:51 pm" }, // চাটমোহর (Index: 12)
      { arrival: "02:06 pm", departure: "02:09 pm" }, // বড়াল ব্রিজ (Index: 13)
      { arrival: "02:27 pm", departure: "02:30 pm" }, // উল্লাপাড়া (Index: 14)
      { arrival: "02:45 pm", departure: "02:48 pm" }, // শহীদ এম মনসুর আলী (Index: 15)
      { arrival: "03:29 pm", departure: "03:32 pm" }, // ইব্রাহিমাবাদ (Index: 16)
      { arrival: "03:52 pm", departure: "03:54 pm" }, // টাঙ্গাইল (Index: 17)
      { arrival: "05:04 pm", departure: "05:07 pm" }, // জয়দেবপুর (Index: 18)
      { arrival: "05:33 pm", departure: "05:36 pm" }, // ঢাকা বিমানবন্দর (Index: 19)
      { arrival: "06:05 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 20)
    ]
  },
  // ঢাকা থেকে খুলনা
  "764": {
    stations: [
      { arrival: "START", departure: "07:30 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "07:53 pm", departure: "07:58 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "08:21 pm", departure: "08:23 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "09:26 pm", departure: "09:28 pm" }, // টাঙ্গাইল (Index: 3)
      { arrival: "09:48 pm", departure: "09:50 pm" }, // ইব্রাহিমাবাদ (Index: 4)
      { arrival: "10:06 pm", departure: "10:09 pm" }, // শহীদ এম মনসুর আলী (Index: 5)
      { arrival: "10:26 pm", departure: "10:29 pm" }, // উল্লাপাড়া (Index: 6)
      { arrival: "10:47 pm", departure: "10:50 pm" }, // বড়াল ব্রিজ (Index: 7)
      { arrival: "11:04 pm", departure: "11:07 pm" }, // চাটমোহর (Index: 8)
      { arrival: "11:45 pm", departure: "11:55 pm" }, // ঈশ্বরদী (Index: 9)
      { arrival: "12:25 am", departure: "12:28 am" }, // ভেড়ামারা (Index: 10)
      { arrival: "12:46 am", departure: "12:49 am" }, // পোড়াদহ (Index: 11)
      { arrival: "01:05 am", departure: "01:07 am" }, // আলমডাঙ্গা (Index: 12)
      { arrival: "01:24 am", departure: "01:27 am" }, // চুয়াডাঙ্গা (Index: 13)
      { arrival: "02:16 am", departure: "02:18 am" }, // কোটচাঁদপুর (Index: 14)
      { arrival: "02:30 am", departure: "02:32 am" }, // মোবারকগঞ্জ (Index: 15)
      { arrival: "03:07 am", departure: "03:12 am" }, // যশোর (Index: 16)
      { arrival: "03:40 am", departure: "03:43 am" }, // নওয়াপাড়া (Index: 17)
      { arrival: "04:40 am", departure: "END" }      // খুলনা (Index: 18)
    ]
  },

// --- ব্রহ্মপুত্র এক্সপ্রেস (৭৪৩ ও ৭৪৪) ---
  // ঢাকা থেকে দেওয়ানগঞ্জ বাজার
  "743": {
    stations: [
      { arrival: "START", departure: "06:15 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "06:38 pm", departure: "06:43 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "07:14 pm", departure: "07:18 pm" }, // জয়দেবপুর (Index: 2)
      { arrival: "07:44 pm", departure: "07:46 pm" }, // শ্রীপুর (Index: 3)
      { arrival: "08:35 pm", departure: "08:37 pm" }, // গফরগাঁও (Index: 4)
      { arrival: "09:23 pm", departure: "09:28 pm" }, // ময়মনসিংহ (Index: 5)
      { arrival: "09:58 pm", departure: "10:00 pm" }, // পিয়রপুর (Index: 6)
      { arrival: "10:22 pm", departure: "10:24 pm" }, // নন্দিনা (Index: 7)
      { arrival: "10:39 pm", departure: "10:42 pm" }, // জামালপুর টাউন (Index: 8)
      { arrival: "10:58 pm", departure: "11:00 pm" }, // মেলান্দহ বাজার (Index: 9)
      { arrival: "11:16 pm", departure: "11:18 pm" }, // ইসলামপুর বাজার (Index: 10)
      { arrival: "11:50 pm", departure: "END" }      // দেওয়ানগঞ্জ বাজার (Index: 11)
    ]
  },
  // দেওয়ানগঞ্জ বাজার থেকে ঢাকা
  "744": {
    stations: [
      { arrival: "START", departure: "06:40 am" }, // দেওয়ানগঞ্জ বাজার (Index: 0)
      { arrival: "06:54 am", departure: "06:59 am" }, // ইসলামপুর বাজার (Index: 1)
      { arrival: "07:15 am", departure: "07:20 am" }, // মেলান্দহ বাজার (Index: 2)
      { arrival: "07:36 am", departure: "07:41 am" }, // জামালপুর টাউন (Index: 3)
      { arrival: "07:54 am", departure: "07:56 am" }, // নন্দিনা (Index: 4)
      { arrival: "08:16 am", departure: "08:18 am" }, // পিয়রপুর (Index: 5)
      { arrival: "08:50 am", departure: "08:55 am" }, // ময়মনসিংহ (Index: 6)
      { arrival: "09:45 am", departure: "09:47 am" }, // গফরগাঁও (Index: 7)
      { arrival: "10:35 am", departure: "10:37 am" }, // শ্রীপুর (Index: 8)
      { arrival: "11:40 am", departure: "11:45 am" }, // ঢাকা বিমানবন্দর (Index: 9)
      { arrival: "12:15 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 10)
    ]
  },
  // --- মহানগর গোধূলী ও প্রভাতী (৭০৩ ও ৭০৪) ---
  // চট্টগ্রাম থেকে ঢাকা
  "703": {
    stations: [
      { arrival: "START", departure: "03:00 pm" }, // চট্টগ্রাম (Index: 0)
      { arrival: "04:20 pm", departure: "04:22 pm" }, // ফেনী (Index: 1)
      { arrival: "04:36 pm", departure: "04:38 pm" }, // গুণবতী (Index: 2)
      { arrival: "05:04 pm", departure: "05:06 pm" }, // লাকসাম (Index: 3)
      { arrival: "05:27 pm", departure: "05:29 pm" }, // কুমিল্লা (Index: 4)
      { arrival: "06:20 pm", departure: "06:23 pm" }, // আখাউড়া (Index: 5)
      { arrival: "06:41 pm", departure: "06:45 pm" }, // ব্রাহ্মণবাড়িয়া (Index: 6)
      { arrival: "07:05 pm", departure: "07:08 pm" }, // ভৈরব বাজার (Index: 7)
      { arrival: "07:36 pm", departure: "07:38 pm" }, // নরসিংদী (Index: 8)
      { arrival: "08:45 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 9)
    ]
  },
  // ঢাকা থেকে চট্টগ্রাম
  "704": {
    stations: [
      { arrival: "START", departure: "07:45 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "08:07 am", departure: "08:12 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "08:51 am", departure: "08:53 am" }, // নরসিংদী (Index: 2)
      { arrival: "09:16 am", departure: "09:19 am" }, // ভৈরব বাজার (Index: 3)
      { arrival: "09:39 am", departure: "09:43 am" }, // ব্রাহ্মণবাড়িয়া (Index: 4)
      { arrival: "10:05 am", departure: "10:08 am" }, // আখাউড়া (Index: 5)
      { arrival: "10:51 am", departure: "10:53 am" }, // কুমিল্লা (Index: 6)
      { arrival: "11:15 am", departure: "11:17 am" }, // লাকসাম (Index: 7)
      { arrival: "11:43 am", departure: "11:45 am" }, // গুণবতী (Index: 8)
      { arrival: "12:00 pm", departure: "12:02 pm" }, // ফেনী (Index: 9)
      { arrival: "01:35 pm", departure: "END" }      // চট্টগ্রাম (Index: 10)
    ]
  },

// --- কক্সবাজার এক্সপ্রেস (৮১৩ ও ৮১৪) ---
  // ঢাকা থেকে কক্সবাজার
  "814": {
    stations: [
      { arrival: "START", departure: "11:00 pm" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "11:23 pm", departure: "11:28 pm" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "03:40 am", departure: "04:20 am" }, // চট্টগ্রাম (Index: 2)
      { arrival: "07:20 am", departure: "END" }      // কক্সবাজার (Index: 3)
    ]
  },
  // কক্সবাজার থেকে ঢাকা
  "813": {
    stations: [
      { arrival: "START", departure: "12:40 pm" }, // কক্সবাজার (Index: 0)
      { arrival: "03:40 pm", departure: "04:00 pm" }, // চট্টগ্রাম (Index: 1)
      { arrival: "08:33 pm", departure: "08:38 pm" }, // ঢাকা বিমানবন্দর (Index: 2)
      { arrival: "09:10 pm", departure: "END" }      // ঢাকা কমলাপুর (Index: 3)
    ]
  },
  // --- একতা এক্সপ্রেস (৭০৫ ও ৭০৬) ---
  // ঢাকা থেকে পঞ্চগড়
  "705": {
    stations: [
      { arrival: "START", departure: "10:15 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "10:38 am", departure: "10:43 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "11:06 am", departure: "11:09 am" }, // জয়দেবপুর (Index: 2)
      { arrival: "12:03 pm", departure: "12:05 pm" }, // টাঙ্গাইল (Index: 3)
      { arrival: "12:25 pm", departure: "12:27 pm" }, // ইব্রাহিমাবাদ (Index: 4)
      { arrival: "12:43 pm", departure: "12:45 pm" }, // শহীদ এম মনসুর আলী (Index: 5)
      { arrival: "01:01 pm", departure: "01:04 pm" }, // উল্লাপাড়া (Index: 6)
      { arrival: "02:09 pm", departure: "02:11 pm" }, // ঈশ্বরদী বাইপাস (Index: 7)
      { arrival: "02:53 pm", departure: "02:57 pm" }, // নাটোর (Index: 8)
      { arrival: "04:00 pm", departure: "04:05 pm" }, // সান্তাহার (Index: 9)
      { arrival: "04:25 pm", departure: "04:27 pm" }, // আক্কেলপুর (Index: 10)
      { arrival: "04:50 pm", departure: "04:53 pm" }, // জয়পুরহাট (Index: 11)
      { arrival: "05:12 pm", departure: "05:14 pm" }, // পাঁচবিবি (Index: 12)
      { arrival: "05:34 pm", departure: "05:37 pm" }, // বিরামপুর (Index: 13)
      { arrival: "05:48 pm", departure: "05:51 pm" }, // ফুলবাড়ী (Index: 14)
      { arrival: "06:15 pm", departure: "06:25 pm" }, // পার্বতীপুর (Index: 15)
      { arrival: "06:40 pm", departure: "06:42 pm" }, // চিরিরবন্দর (Index: 16)
      { arrival: "07:00 pm", departure: "07:05 pm" }, // দিনাজপুর (Index: 17)
      { arrival: "07:35 pm", departure: "07:37 pm" }, // সেতাবগঞ্জ (Index: 18)
      { arrival: "07:51 pm", departure: "07:53 pm" }, // পীরগঞ্জ (Index: 19)
      { arrival: "08:15 pm", departure: "08:18 pm" }, // ঠাকুরগাঁও (Index: 20)
      { arrival: "08:33 pm", departure: "08:35 pm" }, // রুহিয়া (Index: 21)
      { arrival: "09:00 pm", departure: "END" }      // পঞ্চগড় (Index: 22)
    ]
  },
  // পঞ্চগড় থেকে ঢাকা
  "706": {
    stations: [
      { arrival: "START", departure: "09:10 pm" }, // পঞ্চগড় (Index: 0)
      { arrival: "09:34 pm", departure: "09:36 pm" }, // রুহিয়া (Index: 1)
      { arrival: "09:51 pm", departure: "09:54 pm" }, // ঠাকুরগাঁও (Index: 2)
      { arrival: "10:16 pm", departure: "10:18 pm" }, // পীরগঞ্জ (Index: 3)
      { arrival: "10:32 pm", departure: "10:34 pm" }, // সেতাবগঞ্জ (Index: 4)
      { arrival: "11:05 pm", departure: "11:13 pm" }, // দিনাজপুর (Index: 5)
      { arrival: "11:30 pm", departure: "11:32 pm" }, // চিরিরবন্দর (Index: 6)
      { arrival: "11:50 pm", departure: "11:55 pm" }, // পার্বতীপুর (Index: 7)
      { arrival: "12:28 am", departure: "12:31 am" }, // ফুলবাড়ী (Index: 8)
      { arrival: "12:42 am", departure: "12:45 am" }, // বিরামপুর (Index: 9)
      { arrival: "01:05 am", departure: "01:07 am" }, // পাঁচবিবি (Index: 10)
      { arrival: "01:18 am", departure: "01:21 am" }, // জয়পুরহাট (Index: 11)
      { arrival: "01:35 am", departure: "01:37 am" }, // আক্কেলপুর (Index: 12)
      { arrival: "01:55 am", departure: "02:00 am" }, // সান্তাহার (Index: 13)
      { arrival: "02:41 am", departure: "02:44 am" }, // নাটোর (Index: 14)
      { arrival: "04:12 am", departure: "04:15 am" }, // উল্লাপাড়া (Index: 15)
      { arrival: "04:50 am", departure: "04:52 am" }, // ইব্রাহিমাবাদ (Index: 16)
      { arrival: "05:12 am", departure: "05:14 am" }, // টাঙ্গাইল (Index: 17)
      { arrival: "06:18 am", departure: "06:21 am" }, // জয়দেবপুর (Index: 18)
      { arrival: "06:50 am", departure: "06:55 am" }, // ঢাকা বিমানবন্দর (Index: 19)
      { arrival: "07:20 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 20)
    ]
  },

// --- বুড়িমারী এক্সপ্রেস (৮০৯ ও ৮১০) ---
  // বুড়িমারী থেকে ঢাকা
  "810": {
    stations: [
      { arrival: "START", departure: "06:00 pm" }, // বুড়িমারী (Index: 0)
      { arrival: "06:15 pm", departure: "06:20 pm" }, // পাটগ্রাম (Index: 1)
      { arrival: "06:47 pm", departure: "06:50 pm" }, // বড়খাতা (Index: 2)
      { arrival: "07:02 pm", departure: "07:05 pm" }, // হাতিবান্ধা (Index: 3)
      { arrival: "07:33 pm", departure: "07:35 pm" }, // তুষভান্ডার (Index: 4)
      { arrival: "09:33 pm", departure: "09:36 pm" }, // কাউনিয়া (Index: 5)
      { arrival: "10:42 pm", departure: "10:47 pm" }, // গাইবান্ধা (Index: 6)
      { arrival: "11:09 pm", departure: "11:12 pm" }, // বোনারপাড়া (Index: 7)
      { arrival: "11:22 pm", departure: "11:24 pm" }, // মহিমাগঞ্জ (Index: 8)
      { arrival: "12:03 am", departure: "12:08 am" }, // বগুড়া (Index: 9)
      { arrival: "01:00 am", departure: "01:05 am" }, // সান্তাহার (Index: 10)
      { arrival: "02:03 am", departure: "02:13 am" }, // নাটোর (Index: 11)
      { arrival: "06:30 am", departure: "END" }      // ঢাকা কমলাপুর (Index: 12)
    ]
  },
  // ঢাকা থেকে বুড়িমারী
  "809": {
    stations: [
      { arrival: "START", departure: "08:30 am" }, // ঢাকা কমলাপুর (Index: 0)
      { arrival: "08:53 am", departure: "08:58 am" }, // ঢাকা বিমানবন্দর (Index: 1)
      { arrival: "12:30 pm", departure: "12:32 pm" }, // ঈশ্বরদী বাইপাস (Index: 2)
      { arrival: "01:02 pm", departure: "01:05 pm" }, // নাটোর (Index: 3)
      { arrival: "02:15 pm", departure: "02:20 pm" }, // সান্তাহার (Index: 4)
      { arrival: "03:00 pm", departure: "03:05 pm" }, // বগুড়া (Index: 5)
      { arrival: "03:46 pm", departure: "03:48 pm" }, // মহিমাগঞ্জ (Index: 6)
      { arrival: "03:58 pm", departure: "04:03 pm" }, // বোনারপাড়া (Index: 7)
      { arrival: "04:28 pm", departure: "04:33 pm" }, // গাইবান্ধা (Index: 8)
      { arrival: "05:43 pm", departure: "05:46 pm" }, // কাউনিয়া (Index: 9)
      { arrival: "06:10 pm", departure: "07:00 pm" }, // লালমনিরহাট (Index: 10)
      { arrival: "07:25 pm", departure: "07:27 pm" }, // কাঁকিনা (Index: 11)
      { arrival: "07:45 pm", departure: "07:47 pm" }, // তুষভান্ডার (Index: 12)
      { arrival: "08:21 pm", departure: "08:37 pm" }, // হাতিবান্ধা (Index: 13)
      { arrival: "08:48 pm", departure: "08:51 pm" }, // বড়খাতা (Index: 14)
      { arrival: "09:23 pm", departure: "09:28 pm" }, // পাটগ্রাম (Index: 15)
      { arrival: "09:45 pm", departure: "END" }      // বুড়িমারী (Index: 16)
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
      delayText: formatDelay(trainData.delay || 0),
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
      let calculatedDelayMinutes = 0;
      const tidString = String(trainId);

      // টাইমজোন ফিক্স (BD Time)
      const now = new Date();
      const bdtTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const currentTotalMin = (bdtTime.getHours() * 60) + bdtTime.getMinutes();

      if (trainsDataMap[tidString]) {
        const station = trainsDataMap[tidString].stations[parseInt(index) || 0];
        if (station) {
          const schedTimeStr = (station.arrival === "START") ? station.departure : station.arrival;
          const scheduledMin = parseToMinutes(schedTimeStr);
          
          if (scheduledMin !== null) {
            let diff = currentTotalMin - scheduledMin;

            // দিনের পরিবর্তন (Midnight) হ্যান্ডেল করা
            if (diff < -720) diff += 1440;
            if (diff > 720) diff -= 1440;

            // --- স্পিড বাড়লে দেরি কমানোর লজিক (Recovery Logic) ---
            if (diff > 0) {
              if (speed > 50) {
                // স্পিড ৫০ এর বেশি হলে প্রতি ৫ কিমি গতির জন্য ২ মিনিট রিকভারি ফ্যাক্টর
                const recoveryFactor = Math.floor((speed - 50) / 5) * 2;
                diff = diff - recoveryFactor;
              }
            }

            calculatedDelayMinutes = diff > 0 ? Math.round(diff) : 0;
          }
        }
      }

      // ম্যানুয়াল ডিলে থাকলে সেটাই প্রায়োরিটি পাবে, নাহলে ক্যালকুলেটেড ডিলে
      const finalDelay = (manualDelay !== undefined && manualDelay !== null && manualDelay !== "") 
                         ? parseInt(manualDelay) : calculatedDelayMinutes;

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

// ১২ মিনিট পর পর সেলফ-পিং (Server জিন্দা রাখার জন্য)
const SELF_URL = 'https://train-koi.onrender.com/ping';

setInterval(async () => {
  try {
    const response = await axios.get(SELF_URL);
    console.log(`[Self-Ping] Status: ${response.status} - Server kept alive at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error(`[Self-Ping] Error: ${err.message}`);
  }
}, 720000);