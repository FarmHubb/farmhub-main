import express from 'express';
import bodyparser from 'body-parser';
import connectDB from './config/database';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import auth from './middleware/auth';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes'
require('dotenv').config();
const app = express();

// mongo connection
connectDB();

// bodyparser setup
app.use(bodyparser.json({ limit: "150mb", extended: true }))
app.use(bodyparser.urlencoded({ limit: "150mb", extended: true, parameterLimit: 50000 }))

// cors
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
    })
}))

app.get('/', function(req, res) {
    res.send('Welcome to our API')
})

app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

userRoutes(app);
productRoutes(app);
orderRoutes(app);
paymentRoutes(app);

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);