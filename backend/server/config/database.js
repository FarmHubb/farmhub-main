import mongoose from "mongoose";

// Function to connect to the MongoDB database
export default async function connectDB() {
    try {
        // Connect to the MongoDB database using the MONGODB_URL environment variable
        const data = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected with server ${data.connection.host}`);
    } catch (err) {
        // If there is an error connecting to the database, log the error message and exit the process
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
}