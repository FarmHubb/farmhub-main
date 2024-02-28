import { config } from 'dotenv';
import { body } from 'express-validator';
import passport from "passport";
import twilio from "twilio";
import validator from 'validator';
import { CUSTOMER, SELLER } from '../constants';
import { readImage } from "../middleware/imageUtils";
import { checkValidation } from '../middleware/validation';
import Product from "../models/productModel";
import { Customer, Seller, User } from "../models/userModel";
config();

// -------------------------------- User Authentication --------------------------------

export const login = (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).send(info.message);
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.status(200).send({ message: "User logged in" });
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

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id, '-password')
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const createUser = [

    body('role', 'Role must be specified.').isIn([SELLER, CUSTOMER]),
    body('email', 'Email must be valid').trim().isEmail().escape(),
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation(),

    (req, res, next) => {
        if (req.body.role === SELLER) {
            body('bussinessName', 'Business Name must be specified.').trim().isLength({ min: 1 }).escape()(req, res, () => { });
            body('about', 'About must be a string').optional().isString().trim().escape()(req, res, () => { });
        } else if (req.body.role === CUSTOMER) {
            body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape()(req, res, () => { });
        } else {
            return res.status(400).json({ message: "Invalid user role" });
        }
    },
    checkValidation(),

    async (req, res, next) => {
        try {
            let newUser;
            if (req.file)
                req.body[req.body.role === CUSTOMER ? 'avatar' : 'companyLogo'] = readImage(req.file);
            
            if (req.body.role === SELLER) {
                newUser = new Seller({
                    email: req.body.email,
                    password: req.body.password,
                    phoneNumber: req.body.phoneNumber,
                    bussinessName: req.body.bussinessName,
                    about: req.body.about
                });
            } else if (req.body.role === CUSTOMER) {
                newUser = new Customer({
                    email: req.body.email,
                    password: req.body.password,
                    phoneNumber: req.body.phoneNumber,
                    name: req.body.name
                });
            } else {
                return res.status(400).json({ message: "Invalid user role" });
            }

            await newUser.save();
            res.status(201).json(process.env.NODE_ENV === PROD
                ? { message: "User created successfully" }
                : newUser);
        } catch (err) {
            next(err);
        }
    }
];

export const updateUser = [

    body('email', 'Email must be valid').optional().trim().isEmail().escape(),
    body('phoneNumber', 'Phone number must be valid').optional().custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation(),

    (req, res, next) => {
        if (req.body.role === SELLER) {
            body('bussinessName', 'Business Name must be specified.').optional().trim().isLength({ min: 1 }).escape()(req, res, () => { });
            body('about', 'About must be a string').optional().isString().trim().escape()(req, res, () => { });
        } else if (req.body.role === CUSTOMER) {
            body('name', 'Name must be specified.').optional().trim().isLength({ min: 1 }).escape()(req, res, () => { });
        } else {
            return res.status(400).json({ message: "Invalid user role" });
        }
    },
    checkValidation(),

    async (req, res, next) => {
        try {
            if (req.file)
                req.body[req.body.role === CUSTOMER ? 'avatar' : 'companyLogo'] = readImage(req.file);
    
            let user;
            if (req.user.role === SELLER) {
                user = await Seller.findByIdAndUpdate(
                    req.user._id,
                    {
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        bussinessName: req.body.bussinessName,
                        about: req.body.about
                    },
                    { new: true, runValidators: true }
                );
            } else if (req.user.role === CUSTOMER) {
                user = await Customer.findByIdAndUpdate(
                    req.user._id,
                    {
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        name: req.body.name
                    },
                    { new: true, runValidators: true }
                );
            } else {
                return res.status(400).json({ message: "Invalid user role" });
            }
            if (!user)
                return res.status(404).json({ message: 'User not found' });
    
    
            res.status(200).json(process.env.NODE_ENV === PROD
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
        if (req.user.role === SELLER)
            await Product.deleteMany({ userId: req.user._id });

        await User.findByIdAndRemove(req.user._id);
        res.status(204).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Manage User Password --------------------------------

const changePassword = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber },
            { password: req.body.password },
            { runValidators: true }
        );
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = [

    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    body('oldPassword', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    checkValidation(),

    async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user)
                return res.status(404).json({ message: 'User not found' });
    
            const isMatch = await user.comparePassword(req.body.oldPassword);
            if (!isMatch)
                return res.status(401).json({ message: "Old password is incorrect" });
    
            req.body.phoneNumber = user.phoneNumber;
            changePassword(req, res);
        } catch (err) {
            next(err);
        }
    }
];

export const forgotPassword = [

    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation(),

    async (req, res, next) => {
        try {
            const phoneNumber = req.body.phoneNumber;
            const user = await User.findOne({ phoneNumber: phoneNumber });
            if (!user)
                return res.status(404).json({ message: "User not found" });

            const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
            const otp = Math.floor(100000 + Math.random() * 900000);
            await User.findOneAndUpdate(
                { phoneNumber: req.body.phoneNumber },
                { resetPasswordOtp: otp },
                { runValidators: true }
            );
            client.messages
                .create({
                    body: ` ${otp} This is your OTP for Farmhub password reset`,
                    from: "+12708136198",
                    to: `+91 ${phoneNumber}`,
                })
                .then((message) => {
                    // console.log(message)
                    // res.json(message)
                });
            res.json({ message: "OTP sent successfully" });
        } catch (err) {
            next(err);
        }
    }
];

export const checkOtp = [

    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    // TODO: Add validator for OTP
    checkValidation(),

    async (req, res, next) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            if (req.body.otp !== user.resetPasswordOtp)
                return res.status(401).json({ message: "Invalid OTP" });
    
            res.status(200).json({ message: "Valid OTP" });
        } catch (error) {
            res.send(error);
        }
        changePassword(req, res)
    }
];

// -------------------------------- Manage User Addresses --------------------------------

export const addAddress = [

    body('area', 'Area must be specified.').trim().isLength({ min: 1 }).escape(),
    body('city', 'City must be specified.').trim().isLength({ min: 1 }).escape(),
    body('state', 'State must be specified.').trim().isLength({ min: 1 }).escape(),
    body('country', 'Country must be specified.').trim().isLength({ min: 1 }).escape(),
    body('pincode', 'Pincode must be valid.').trim().isPostalCode('IN').escape(),
    checkValidation(),

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
    checkValidation(),

    async (req, res, next) => {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id, "addresses._id": req.params.addressId },
                { $set: { "addresses.$": req.body } },
                { runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });

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
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Manage User Cart --------------------------------

export const addToCart = [

    body('product', 'Product ID must be specified.').trim().isMongoId().escape(),
    body('quantity', 'Quantity must be specified and be a number.').trim().isInt({ gt: 0 }).escape(),
    checkValidation(),

    async (req, res, next) => {
        try {
            const product = await Product.findById(req.body.product);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            if (product.quantity < req.body.quantity)
                return res.status(400).json({ message: "Not sufficient quantity available" });
    
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
    checkValidation(),

    async (req, res, next) => {
        try {
            if (req.body.quantity == 0) {
                deletefromCart(req, res);
                return;
            }
    
            const product = await Product.findById(req.body.product);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            if (product.quantity < req.body.quantity)
                return res.status(400).json({ message: "Not sufficient quantity available" });
    
            const user = await Customer.findOneAndUpdate(
                { _id: req.user._id, "cart.product": req.params.productId },
                { $set: { "cart.$.quantity": req.body.quantity } },
                { new: true, runValidators: true }
            );
            if (!user)
                return res.status(404).json({ message: 'User not found' });
    
            const item = user.cart.find(item => item.product.toString() === req.params.productId);
            res.status(200).json(item);
        } catch (err) {
            next(err);
        }
    }
];

export const deletefromCart = async (req, res, next) => {
    try {
        const user = await Customer.findOneAndUpdate(
            { _id: req.user._id, "cart.product": req.params.productId },
            { $pull: { cart: { product: req.params.productId } } },
            { runValidators: true }
        );
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: "Product deleted from cart successfully" });
    } catch (err) {
        next(err);
    }
};
