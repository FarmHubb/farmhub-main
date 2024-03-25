import axios from 'axios';

// Controller function to handle predictions
export const predict = async (req, res) => {
    try {
        const inputValues = req.body;
        console.log("Received input values:", inputValues);

        const pythonApiUrl = 'http://localhost:5000/ai/predict';
        const response = await axios.post(pythonApiUrl, inputValues, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);

        const predictionResult = response.data.prediction;
        res.json({ prediction: predictionResult });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to handle fertilizer predictions
export const predictFertilizer = async (req, res) => {
    try {
        const inputValues = req.body;
        const pythonApiUrl = 'http://localhost:5000/ai/predict/fertilizer';
        const response = await axios.post(pythonApiUrl, inputValues, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const predictionResult = response.data;
        res.json({ prediction: predictionResult });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
