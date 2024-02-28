import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, Seller, Customer } from '../models/userModel';
import { CUSTOMER, SELLER } from '../constants';

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
        let user;
        const baseUser = await User.findById(req.params.userId);
        if (baseUser.role === SELLER) {
            user = await Seller.findById(id, 'businessName companyLogo about').populate('cart.product');
        } else if (baseUser.role === CUSTOMER) {
            user = await Customer.findById(id, 'name avatar cart').populate('cart.product');
        } else {
            return res.status(400).json({ message: "Invalid user role" });
        }
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
