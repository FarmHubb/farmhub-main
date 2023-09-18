import mongoose from "mongoose";

mongoose.set('strictQuery', true);
const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((data) => {
        console.log(`MongoDB connected with server ${data.connection.host}`);
    });
}

module.exports = connectDB;