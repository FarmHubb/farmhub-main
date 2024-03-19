import bodyparser from 'body-parser';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import session from 'express-session';
import connectDB from './config/database';
import auth from './middleware/auth';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cropRoutes from './routes/api';

config();
const app = express();
connectDB(); // MongoDB connection

// Bodyparser setup
app.use(bodyparser.json({ limit: "150mb", extended: true }))
app.use(bodyparser.urlencoded({ limit: "150mb", extended: true, parameterLimit: 50000 }))

// CORS setup
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// Session and cookies
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
    })
}))
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

// Routes
app.get('/', function(req, res) {
    res.send('Welcome to our API')
})
userRoutes(app);
productRoutes(app);
orderRoutes(app);
paymentRoutes(app);
cropRoutes(app);

app.use((err, req, res, next) => {
    process.env.NODE_ENV === 'production'
        ? res.status(500).json({ message: 'Internal Server Error' })
        : res.status(500).json(err.message);
    console.error(err);
});

// Server
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);