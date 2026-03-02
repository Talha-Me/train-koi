// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const axios = require('axios');
// const connectDB = require('./config/db');
// const Train = require('./models/Train');
// const Message = require('./models/Message');

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

// // --- API Routes ---

// /**
//  * ১. নির্দিষ্ট ট্রেনের লোকেশন ডাটা পাওয়া (Initial Load)
//  * রুট আপডেট করা হয়েছে যাতে স্ল্যাশের কারণে ভুল না হয়
//  */
// app.get('/api/train-location/:trainId', async (req, res) => {
//   try {
//     const { trainId } = req.params;
//     // ট্রেনের আইডি নম্বর হিসেবে খোঁজা হচ্ছে
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
    
//     const newMessage = new Message({
//       name,
//       email,
//       subject,
//       message
//     });

//     await newMessage.save();
//     res.status(201).json({ success: true, message: "Message saved successfully!" });
//   } catch (error) {
//     console.error("Contact API Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });

// // রুট পাথ চেক করার জন্য
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
//       const { trainId, lat, lng, speed, delay, index, progress } = data;

//       const updatedTrain = await Train.findOneAndUpdate(
//         { trainId: parseInt(trainId) }, 
//         { 
//           $set: { 
//             speed: speed || 0,
//             delay: delay || 0,
//             currentStationIndex: index || 0,
//             progress: progress || 0,
//             "lastLocation.lat": lat, 
//             "lastLocation.lng": lng,
//             "lastLocation.updatedAt": new Date() 
//           }
//         },
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
      
//       console.log(`Live Update: Train ${trainId} - Speed: ${speed} - Delay: ${delay}`);
//     } catch (err) {
//       console.error("Socket Update Error:", err.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // --- সার্ভার স্টার্ট ---
// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => {
//   console.log(`-----------------------------------------`);
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`-----------------------------------------`);
// });

// // --- Self-Ping Logic (Render-এ সার্ভারকে ২৪ ঘণ্টা সচল রাখতে) ---
// // এখানে URL চেক করে স্লাশ হ্যান্ডেল করা হয়েছে
// const RAW_SERVER_URL = 'https://train-koi.onrender.com';
// const SERVER_URL = RAW_SERVER_URL.replace(/\/$/, ""); 

// setInterval(async () => {
//   try {
//     // সরাসরি মেইন ইউআরএল বা /ping রুটে রিকোয়েস্ট পাঠানো হচ্ছে
//     await axios.get(`${SERVER_URL}/ping`);
//     console.log('Self-ping successful: Server is awake!');
//   } catch (error) {
//     console.error('Self-ping failed:', error.message);
//   }
// }, 12 * 60 * 1000); // প্রতি ১২ মিনিটে একবার কল করবে

// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const axios = require('axios');
// const connectDB = require('./config/db');
// const Train = require('./models/Train');
// const Message = require('./models/Message');

// // শিডিউল ডাটা ইমপোর্ট - পাথ আপডেট করা হয়েছে আপনার ডিরেক্টরি অনুযায়ী
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
    
//     const newMessage = new Message({
//       name,
//       email,
//       subject,
//       message
//     });

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
      
//       // --- অটোমেটিক ডিলে ক্যালকুলেশন লজিক শুরু ---
//       let calculatedDelay = data.delay || 0;
      
//       const trainStaticInfo = trains.find(t => t.id === parseInt(trainId));
//       if (trainStaticInfo) {
//           const now = new Date();
//           const currentTotalMin = now.getHours() * 60 + now.getMinutes();
          
//           // বর্তমানের সবচেয়ে কাছের স্টেশন বা ইনডেক্স অনুযায়ী শিডিউল বের করা
//           const currentStation = trainStaticInfo.stations[index || 0];
//           if (currentStation) {
//               const schedTimeStr = currentStation.arrival === "START" ? currentStation.departure : currentStation.arrival;
//               const scheduledMin = parseToMinutes(schedTimeStr);
              
//               if (scheduledMin !== null) {
//                   // যদি বর্তমান সময় শিডিউল টাইম থেকে বেশি হয়, তবেই ডিলে হবে
//                   const diff = currentTotalMin - scheduledMin;
//                   calculatedDelay = diff > 0 ? diff : 0;
//               }
//           }
//       }
//       // --- অটোমেটিক ডিলে ক্যালকুলেশন লজিক শেষ ---

//       const updatedTrain = await Train.findOneAndUpdate(
//         { trainId: parseInt(trainId) }, 
//         { 
//           $set: { 
//             speed: speed || 0,
//             delay: calculatedDelay, // স্বয়ংক্রিয়ভাবে ক্যালকুলেটেড ডিলে সেভ হবে
//             currentStationIndex: index || 0,
//             progress: progress || 0,
//             "lastLocation.lat": lat, 
//             "lastLocation.lng": lng,
//             "lastLocation.updatedAt": new Date() 
//           }
//         },
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
      
//       console.log(`Live Update: Train ${trainId} - Speed: ${speed} - Calculated Delay: ${calculatedDelay}`);
//     } catch (err) {
//       console.error("Socket Update Error:", err.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // --- সার্ভার স্টার্ট ---
// const PORT = process.env.PORT || 5001;
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


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const Train = require('./models/Train');
const Message = require('./models/Message');

// শিডিউল ডাটা ইমপোর্ট - পাথ আপডেট করা হয়েছে আপনার ডিরেক্টরি অনুযায়ী
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

// --- Helpers (ডিলে ক্যালকুলেশনের জন্য) ---
const parseToMinutes = (timeStr) => {
  if (!timeStr || ["START", "END", "---"].includes(timeStr)) return null;
  const match = timeStr.toLowerCase().match(/(\d+):(\d+)\s*(am|pm)/);
  if (!match) return null;
  let [ , hrs, mins, mod] = match;
  let h = parseInt(hrs);
  if (mod === 'pm' && h < 12) h += 12;
  if (mod === 'am' && h === 12) h = 0;
  return h * 60 + parseInt(mins);
};

// --- API Routes ---

/**
 * ১. নির্দিষ্ট ট্রেনের লোকেশন ডাটা পাওয়া (Initial Load)
 */
app.get('/api/train-location/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    const trainData = await Train.findOne({ trainId: parseInt(trainId) });
    
    if (!trainData || !trainData.lastLocation || !trainData.lastLocation.lat) {
      return res.status(404).json({ message: "No live data found for this train" });
    }
    
    res.json({
      trainId: trainData.trainId,
      lat: trainData.lastLocation.lat,
      lng: trainData.lastLocation.lng,
      speed: trainData.speed,
      delay: trainData.delay,
      index: trainData.currentStationIndex,
      progress: trainData.progress,
      updatedAt: trainData.lastLocation.updatedAt
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * ২. কন্টাক্ট ফরম থেকে মেসেজ সেভ করা
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved successfully!" });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get('/', (req, res) => res.send("Train Tracking Server is Running..."));

/**
 * ৩. Self-Ping রুট (সার্ভারকে জাগিয়ে রাখার জন্য)
 */
app.get('/ping', (req, res) => {
  res.send('pong');
});

// --- Socket.io Logic ---

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("send_location", async (data) => {
    try {
      const { trainId, lat, lng, speed, index, progress } = data;
      
      // --- অটোমেটিক ডিলে ক্যালকুলেশন লজিক শুরু ---
      let calculatedDelay = 0; 
      
      const trainStaticInfo = trains.find(t => t.id === parseInt(trainId));
      if (trainStaticInfo) {
          const now = new Date();
          // বাংলাদেশের সময় অনুযায়ী ঘন্টা ও মিনিট বের করা
          const currentTotalMin = (now.getHours() * 60) + now.getMinutes();
          
          const currentStation = trainStaticInfo.stations[index || 0];
          if (currentStation) {
              const schedTimeStr = currentStation.arrival === "START" ? currentStation.departure : currentStation.arrival;
              const scheduledMin = parseToMinutes(schedTimeStr);
              
              if (scheduledMin !== null) {
                  const diff = currentTotalMin - scheduledMin;
                  calculatedDelay = diff > 0 ? diff : 0;
              }
          }
      }
      // --- অটোমেটিক ডিলে ক্যালকুলেশন লজিক শেষ ---

      // ডাটাবেজ আপডেট করার জন্য অবজেক্ট তৈরি
      const updatePayload = {
        "lastLocation.lat": lat, 
        "lastLocation.lng": lng,
        "lastLocation.updatedAt": new Date(),
        delay: calculatedDelay,
        currentStationIndex: index || 0,
        progress: progress || 0
      };

      // স্পিড যদি ০ এর বেশি হয় বা ডিফাইনড থাকে তবেই আপডেট হবে, নাহলে আগেরটাই থাকবে
      if (speed !== undefined && speed !== null) {
        updatePayload.speed = speed;
      }

      const updatedTrain = await Train.findOneAndUpdate(
        { trainId: parseInt(trainId) }, 
        { $set: updatePayload },
        { upsert: true, new: true } 
      );

      const liveUpdate = {
        trainId: updatedTrain.trainId,
        lat: updatedTrain.lastLocation.lat,
        lng: updatedTrain.lastLocation.lng,
        speed: updatedTrain.speed,
        delay: updatedTrain.delay,
        index: updatedTrain.currentStationIndex,
        progress: updatedTrain.progress,
        updatedAt: updatedTrain.lastLocation.updatedAt
      };

      io.emit("receive_location", liveUpdate); 
      
      console.log(`Live Update: Train ${trainId} - Speed: ${updatedTrain.speed} - Delay: ${calculatedDelay}`);
    } catch (err) {
      console.error("Socket Update Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- সার্ভার স্টার্ট ---
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`-----------------------------------------`);
});

// --- Self-Ping Logic ---
const RAW_SERVER_URL = 'https://train-koi.onrender.com';
const SERVER_URL = RAW_SERVER_URL.replace(/\/$/, ""); 

setInterval(async () => {
  try {
    await axios.get(`${SERVER_URL}/ping`);
    console.log('Self-ping successful: Server is awake!');
  } catch (error) {
    console.error('Self-ping failed:', error.message);
  }
}, 12 * 60 * 1000);