const Train = require('../models/Train');

// ১. লোকেশন আপডেট করার ফাংশন
exports.updateTrainLocation = async (req, res) => {
    try {
        const { trainId, name, lat, lng, delay, speed, currentStationIndex, progress } = req.body;

        const updatedTrain = await Train.findOneAndUpdate(
            { trainId: trainId },
            { 
                $set: { 
                    name, delay, speed, currentStationIndex, progress,
                    "lastLocation.lat": lat, 
                    "lastLocation.lng": lng,
                    "lastLocation.updatedAt": Date.now()
                }
            },
            { upsert: true, new: true }
        );

        // Socket.io ব্রডকাস্ট (সবাইকে জানিয়ে দেওয়া)
        if (req.io) {
            req.io.emit('trainUpdate', updatedTrain);
        }

        res.status(200).json({ success: true, data: updatedTrain });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ২. সব ট্রেনের ডাটা দেখার ফাংশন
exports.getAllTrains = async (req, res) => {
    try {
        const trains = await Train.find();
        res.status(200).json({ success: true, data: trains });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ৩. নির্দিষ্ট একটি ট্রেনের ডাটা দেখার ফাংশন
exports.getTrainById = async (req, res) => {
    try {
        const train = await Train.findOne({ trainId: req.params.trainId });
        if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
        res.status(200).json({ success: true, data: train });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};