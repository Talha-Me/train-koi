import express from 'express';
const router = express.Router();
import * as trainController from '../controllers/trainController.js';

// প্রতিটি রুটের জন্য কন্ট্রোলারের সঠিক ফাংশন কল করা
router.post('/update', trainController.updateTrainLocation);
router.get('/all', trainController.getAllTrains);
router.get('/:trainId', trainController.getTrainById);

export default router;
