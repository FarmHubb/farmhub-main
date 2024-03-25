import React, { useState } from 'react';
import axios from 'axios';
import {cropImages} from './imagelinks';

function Crop() {
  const [inputValues, setInputValues] = useState({
    Nitrogen: '',
    Phosphorus: '',
    Potassium: '',
    Temperature: '',
    Humidity: '',
    pH: '',
    Rainfall: '',
  });
  const [prediction, setPrediction] = useState('');

  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      // Make a request to your backend for predictions
      const response = await axios.post('http://localhost:5000/ai/predict', inputValues);

      // console.log(response.data.prediction);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error predicting:', error.message);
    }
  };
  const getImageUrl = () => {
    // Log the URL to the console
    // console.log("Image URL:", cropImages[prediction]);
    return cropImages[prediction];
  };

  return (
    
      <div className='min-h-screen bg-bgcrop bg-cover bg-center flex flex-col md:flex-row items-center justify-center gap-8'>
        <div className='min-h-screen flex flex-col  items-center justify-center gap-8'>
      <h1 className='text-xl sm:text-3xl font-extrabold text-white '>Crop Recommendation 🌱</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.keys(inputValues).map((param) => (
              <div key={param} className='flex flex-col items-center'>
                <label className='text-white'>{param}</label>
                <input
                  type='text'
                  className='border-2 p-2 rounded-md'
                  name={param}
                  value={inputValues[param]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <button
            className='px-6 py-3 text-lg font-medium text-white transition duration-300 bg-green-800 border-2 border-transparent rounded-full hover:bg-green-700 focus:outline-none focus:border-green-600 focus:ring focus:ring-green-200'
            onClick={handlePredict}
          >
            Predict
          </button>
        </div>


        <div className="p-5 sm:p-10">
          {prediction && (

            <div className="flex flex-col sm:w-[70%] md:w-full mx-auto bg-white border  border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div className=" object-cover w-full rounded-t-lg md:h-auto md:rounded-none md:rounded-s-lg ">
                <img className="object-cover w-full rounded-t-lg h-52 md:h-52 md:rounded-none md:rounded-s-lg"
                  src={getImageUrl()}
                  alt={`Prediction: ${prediction}`} />
              </div>
              <div className="flex flex-col  justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{prediction}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"> Explore the world of {prediction} cultivation – a crop with remarkable qualities and potential. Elevate your farm's success with this exceptional choice and witness your fields thrive. 🌱 </p>
              </div>
            </div>

          )}
        </div>



      </div>

  );
}

export default Crop;
