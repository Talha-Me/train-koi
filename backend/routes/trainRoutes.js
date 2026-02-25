const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

// প্রতিটি রুটের জন্য কন্ট্রোলারের সঠিক ফাংশন কল করা
router.post('/update', trainController.updateTrainLocation);
router.get('/all', trainController.getAllTrains);
router.get('/:trainId', trainController.getTrainById);

module.exports = router;