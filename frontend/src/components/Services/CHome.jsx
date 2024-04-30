import React from "react";
import { Link } from "react-router-dom";
import { Tilt } from "react-tilt";

const FeatureCard = ({ to, imageSrc, title, description }) => (
  <Tilt className="h-auto" options={{ max: 45, scale: 1, speed: 450 }}>
    <Link to={to} className="flex flex-col items-center">
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-2xl shadow-yellow-300 dark:bg-green-950 dark:border-green-900">
        <img className="rounded-t-lg h-72" src={imageSrc} alt={title} />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  </Tilt>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-bghome bg-cover bg-center">
      <div className="flex items-center justify-center h-screen text-black">
        <div className="text-center  space-y-8">
          <h1 className="text-6xl font-bold">
            Boost Your Crop Yield with Surja Predictions
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10 text-4xl">
            <FeatureCard
              to="/crop-prediction"
              imageSrc="/images/images/rice.jpg"
              title="Crop Prediction"
              description="Discover the best crops to cultivate based on your local conditions."
            />
            <FeatureCard
              to="/fertilizer-prediction"
              imageSrc="/images/images/fertiliser.jpg"
              title="Fertilizer Prediction"
              description="Get the recommended fertilizer for your crops based on your local conditions."
            />
            {/* <FeatureCard
              to="/disease-detection"
              imageSrc="/images/images/disease.jpg"
              title="Disease Prediction"
              description="Identify potential diseases in your crops and learn how to cure them."
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
