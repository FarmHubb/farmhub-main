import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/userModel';

// Local strategy for phone number and password authentication
passport.use(new LocalStrategy({ usernameField: 'phoneNumber' }, async (phoneNumber, password, done) => {
    try {
        const user = await User.findOne({ phoneNumber }).exec();
        if (!user) {
            return done(null, false, { message: 'Invalid Phone Number' });
        }
        const passwordOK = await user.comparePassword(password);
        if (!passwordOK) {
            return done(null, false, { message: 'Invalid Password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize user to store user ID in the session
passport.serializeUser((user, done) => done(null, user._id));

// Deserialize user to retrieve user from ID in the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).populate('cart.product');
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

// Export passport initialization, session, and setUser middleware
export default {
    initialize: passport.initialize,
    session: passport.session,
    setUser: (req, res, next) => {
        res.locals.user = req.user;
        return next();
    }
};
