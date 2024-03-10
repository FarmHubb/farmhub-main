import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const data = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected with server ${data.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
}