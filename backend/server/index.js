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

config();
const app = express();
connectDB(); // Connect to MongoDB

// Bodyparser setup
app.use(bodyparser.json({ limit: "150mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "150mb", extended: true, parameterLimit: 50000 }));

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
    secret: 'secret', // Secret used to sign the session ID cookie
    resave: true, // Forces the session to be saved back to the session store, even if it wasn't modified during the request
    saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
    })
}));
app.use(auth.initialize); // Initialize Passport.js authentication
app.use(auth.session); // Use Passport.js session middleware
app.use(auth.setUser); // Set the authenticated user in the request object

// Routes
app.get('/', function (req, res) {
    res.send('Welcome to our API');
});
// Mount routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);
paymentRoutes(app);
// Error handling middleware
app.use((err, req, res, next) => {
    process.env.NODE_ENV === 'production'
        ? res.status(500).json({ message: 'Internal Server Error' })
        : res.status(500).json({
            name: err.name,
            message: err.message,
            code: err.code,
            stack: err.stack,
            error: err
        });
    console.error(err);
});

// Server
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
