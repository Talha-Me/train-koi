const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  delay: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  currentStationIndex: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  lastLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date, default: Date.now }
  }
});

// নিশ্চিত করুন এখানে module.exports = mongoose.model আছে
module.exports = mongoose.model('Train', TrainSchema);