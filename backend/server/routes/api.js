import express from 'express';
import axios from 'axios';
const router = express.Router();

// Import controller functions
import { predict, predictFertilizer } from '../controllers/predictionController.js';



const cropRoutes= (app)=>{
    
// Route to handle predictions with a POST request
app.route('/ai/predict').post(predict);

// Route to handle fertilizer predictions with a POST request
app.route('/ai/predict/fertilizer').post(predictFertilizer);

}

export default cropRoutes;