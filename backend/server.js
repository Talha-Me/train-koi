const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios'); // axios যুক্ত করা হয়েছে
const connectDB = require('./config/db');
const Train = require('./models/Train');
const Message = require('./models/Message'); // নতুন মডেল ইমপোর্ট

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

// --- API Routes ---

/**
 * ১. নির্দিষ্ট ট্রেনের লোকেশন ডাটা পাওয়া (Initial Load)
 */
app.get('/api/train-location/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    const trainData = await Train.findOne({ trainId: parseInt(trainId) });
    
    if (!trainData || !trainData.lastLocation.lat) {
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
 * ২. কন্টাক্ট ফরম থেকে মেসেজ সেভ করা (নতুন রুট)
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
      const { trainId, lat, lng, speed, delay, index, progress } = data;

      const updatedTrain = await Train.findOneAndUpdate(
        { trainId: parseInt(trainId) }, 
        { 
          $set: { 
            speed: speed || 0,
            delay: delay || 0,
            currentStationIndex: index || 0,
            progress: progress || 0,
            "lastLocation.lat": lat, 
            "lastLocation.lng": lng,
            "lastLocation.updatedAt": new Date() 
          }
        },
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
      
      console.log(`Live Update: Train ${trainId} - Speed: ${speed} - Delay: ${delay}`);
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

// --- Self-Ping Logic (Render-এ সার্ভারকে ২৪ ঘণ্টা সচল রাখতে) ---
const SERVER_URL = 'https://train-koi.onrender.com'; // আপনার Render URL পাওয়ার পর এটি চেক করে নেবেন

setInterval(async () => {
  try {
    await axios.get(SERVER_URL);
    console.log('Self-ping successful: Server is awake!');
  } catch (error) {
    console.error('Self-ping failed:', error.message);
  }
}, 12 * 60 * 1000); // প্রতি ১৪ মিনিটে একবার সার্ভারকে কল করবে