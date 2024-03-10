import { body } from 'express-validator';
import passport from "passport";
import validator from 'validator';
import { readImage } from "../middleware/imageUtils";
import { sendOTP } from '../middleware/sendOTP';
import { checkValidation } from '../middleware/validation';
import Product from "../models/productModel";
import { Customer, Seller, User } from "../models/userModel";

// -------------------------------- User Authentication --------------------------------

export const login = (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ message: info.message });
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.status(200).json({ message: "User logged in" });
        });
    })(req, res, next);
};

export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.status(200).json({ message: "User logged out" });
    });
};

export const isAuth = (req, res, next) => {
    if (req.user)
        return next();
    res.status(401).json({ message: 'User not logged in' });
};

export const isCustomer = (req, res, next) => {
    if (req.user.role === 'Customer')
        return next();
    res.status(403).json({ message: 'User is not a customer' });
};

export const isSeller = (req, res, next) => {
    if (req.user.role === 'Seller')
        return next();
    res.status(403).json({ message: 'User is not a seller' });
};

// -------------------------------- Manage and View Users --------------------------------

export const readUser = (req, res, next) => {
    res.status(200).json(req.user);
};

export const createCustomer = [

    body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('email', 'Email must be valid').trim().isEmail().escape(),
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation,

    async (req, res, next) => {
        try {
            const existingUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            });

            if (existingUser)
                return res.status(400).json({ message: "User with this email or phone number already exists" });

            const newUser = new Customer({
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                name: req.body.name,
                avatar: req.file && readImage(req.file)
            });
            await newUser.save();

            res.status(201).json(process.env.NODE_ENV === 'production'
                ? { message: "User created successfully" }
                : newUser);
        } catch (err) {
            next(err);
        }
    }
];

export const createSeller = [

    body('bussinessName', 'Business Name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('about', 'About must be a string').optional().isString().trim().escape(),
    body('email', 'Email must be valid').trim().isEmail().escape(),
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation,

    async (req, res, next) => {
        try {
            const existingUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            });

            if (existingUser)
                return res.status(400).json({ message: "User with this email or phone number already exists" });

            const newUser = new Seller({
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                bussinessName: req.body.bussinessName,
                about: req.body.about,
                companyLogo: req.file && readImage(req.file)
            });
            await newUser.save();

            res.status(201).json(process.env.NODE_ENV === 'production'
                ? { message: "User created successfully" }
                : newUser);
        } catch (err) {
            next(err);
        }
    }
];

export const updateCustomer = [

    body('name', 'Name must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('email', 'Email must be valid').optional().trim().isEmail().escape(),
    body('phoneNumber', 'Phone number must be valid').optional().custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation,

    async (req, res, next) => {
        try {
            const user = await Customer.findByIdAndUpdate(
                req.user._id,
                {
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    name: req.body.name,
                    avatar: req.file && readImage(req.file)
                },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            res.status(200).json(process.env.NODE_ENV === 'production'
                ? { message: "User updated successfully" }
                : user
            );
        } catch (err) {
            next(err);
        }
    }
];

export const updateSeller = [

    body('bussinessName', 'Business Name must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('about', 'About must be a string').optional().isString().trim().escape(),
    body('email', 'Email must be valid').optional().trim().isEmail().escape(),
    body('phoneNumber', 'Phone number must be valid').optional().custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation,

    async (req, res, next) => {
        try {
            const user = await Seller.findByIdAndUpdate(
                req.user._id,
                {
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    bussinessName: req.body.bussinessName,
                    about: req.body.about,
                    companyLogo: req.file && readImage(req.file)
                },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            res.status(200).json(process.env.NODE_ENV === 'production'
                ? { message: "User updated successfully" }
                : user
            );
        } catch (err) {
            next(err);
        }
    }
];

export const deleteUser = async (req, res, next) => {
    try {
        if (req.user.role === 'Seller')
            await Product.deleteMany({ userId: req.user._id });

        await User.findByIdAndDelete(req.user._id);
        res.status(204).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- OTP Controllers --------------------------------

export const sendOTPController = [

    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation,

    async (req, res, next) => {
        try {
            if(req.user)
                return res.status(409).json({ message: "Cannot send OTP if user is logged in" });

            const phoneNumber = req.body.phoneNumber;
            const user = await User.findOne({ phoneNumber: phoneNumber });
            if (!user)
                return res.status(404).json({ message: "User not found" });

            const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
            // sendOTP(phoneNumber, otp);
            await User.findOneAndUpdate(
                { phoneNumber: req.body.phoneNumber },
                { otp: otp, otpExpiry: new Date(Date.now() + 5 * 60 * 1000) }, // 5 minutes
                { runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            res.json({ message: "OTP sent successfully" });
        } catch (err) {
            next(err);
        }
    }
];

export const verifyOTP = [

    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    body('otp', 'OTP must be valid').isNumeric().isLength({ min: 6, max: 6 }),
    checkValidation,

    async (req, res, next) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            if (new Date() > user.otpExpiry || req.body.otp !== user.otp)
                res.status(401).json({ message: "Invalid OTP" });
            else {
                req.session.isOtpVerified = true;
                res.status(200).json({ message: "Valid OTP" });
            }

            if (new Date() < user.otpExpiry && req.body.otp !== user.otp)
                return;

            await User.findOneAndUpdate(
                { phoneNumber: req.body.phoneNumber },
                { $unset: { otp: "", otpExpiry: "" } },
                { runValidators: true }
            );
        } catch (err) {
            next(err);
        }
    }
];

// -------------------------------- Manange User Password --------------------------------

export const changePassword = [

    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    body('oldPassword', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            const isMatch = await user.comparePassword(req.body.oldPassword);
            if (!isMatch)
                return res.status(401).json({ message: "Old password is incorrect" });

            if (req.body.password === req.body.oldPassword)
                return res.status(400).json({ message: "New password cannot be same as old password" });

            req.body.phoneNumber = user.phoneNumber;
            updatePassword(req, res, next);
        } catch (err) {
            next(err);
        }
    }
];

export const resetPassword = [

    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            if (!req.session.isOtpVerified)
                return res.status(401).json({
                    message: "Cannot change password if OTP is not verified"
                });

            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            const isMatch = await user.comparePassword(req.body.password);
            if (isMatch)
                return res.status(400).json({ message: "New password cannot be same as old password" });

            updatePassword(req, res, next);
        } catch (err) {
            next(err);
        }
    }
];

const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber },
            { password: req.body.password },
            { runValidators: true }
        );
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        if(!req.user)
            req.session.isOtpVerified = false;

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Manage User Addresses --------------------------------

export const addAddress = [

    body('area', 'Area must be specified.').trim().isLength({ min: 1 }).escape(),
    body('city', 'City must be specified.').trim().isLength({ min: 1 }).escape(),
    body('state', 'State must be specified.').trim().isLength({ min: 1 }).escape(),
    body('country', 'Country must be specified.').trim().isLength({ min: 1 }).escape(),
    body('pincode', 'Pincode must be valid.').trim().isPostalCode('IN').escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { $push: { addresses: req.body } },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            res.status(200).json(user.addresses[user.addresses.length - 1]);
        } catch (err) {
            next(err);
        }
    }
];

export const updateAddress = [

    body('area', 'Area must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('city', 'City must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('state', 'State must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('country', 'Country must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('pincode', 'Pincode must be valid.').optional().trim().isPostalCode('IN').escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            req.body._id = req.params.addressId;
            const user = await User.findOneAndUpdate(
                { _id: req.user._id, "addresses._id": req.params.addressId },
                { $set: { "addresses.$": req.body } },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User or address not found' });

            const address = user.addresses.find(address =>
                address._id.toString() === req.params.addressId
            );
            res.status(200).json(address);
        } catch (err) {
            next(err);
        }
    }
];

export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id, "addresses._id": req.params.addressId },
            { $pull: { addresses: { _id: req.params.addressId } } },
            { runValidators: true }
        );
        if (!user)
            return res.status(404).json({ message: 'User or address not found' });

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Manage User Cart --------------------------------

export const addToCart = [

    body('quantity', 'Quantity must be specified and be a number.').trim().isInt({ gt: 0 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            if (product.quantity < req.body.quantity)
                return res.status(400).json({ message: "Not sufficient quantity available" });

            const productInCart = req.user.cart.find(item => item.product._id.toString() === req.params.productId);
            if (productInCart)
                return res.status(400).json({ message: 'Product is already in the cart' });

            req.body.product = req.params.productId;
            const user = await Customer.findByIdAndUpdate(
                req.user._id,
                { $push: { cart: req.body } },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            res.status(200).json(user.cart[user.cart.length - 1]);
        } catch (err) {
            next(err);
        }
    }
];

export const updateInCart = [

    body('quantity', 'Quantity must be specified and be a number.').trim().isInt({ gt: 0 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            if (req.body.quantity == 0) {
                deletefromCart(req, res);
                return;
            }

            const product = await Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            if (product.quantity < req.body.quantity)
                return res.status(400).json({ message: "Not sufficient quantity available" });

            req.body.product = req.params.productId;
            const user = await Customer.findOneAndUpdate(
                { _id: req.user._id, "cart.product": req.params.productId },
                { $set: { "cart.$.quantity": req.body.quantity } },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User or product not found' });

            const item = user.cart.find(item => item.product.toString() === req.params.productId);
            res.status(200).json(item);
        } catch (err) {
            next(err);
        }
    }
];

export const deletefromCart = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        const user = await Customer.findOneAndUpdate(
            { _id: req.user._id, "cart.product": req.params.productId },
            { $pull: { cart: { product: req.params.productId } } },
            { runValidators: true }
        );
        if (!user)
            return res.status(404).json({ message: 'User or product not found' });

        res.status(200).json({ message: "Product deleted from cart successfully" });
    } catch (err) {
        next(err);
    }
};
