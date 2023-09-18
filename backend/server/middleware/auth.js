import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/userModel';

passport.use(new LocalStrategy({ usernameField: 'phoneNumber' }, async (username, password, done) => {
    try {
        const user = await User.findOne({ phoneNumber: username }).exec();
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

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).populate('cart.product');
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
        res.locals.user = req.user;
        return next();
    }
};