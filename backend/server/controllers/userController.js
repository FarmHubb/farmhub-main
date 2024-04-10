import { body } from 'express-validator';
import passport from "passport";
import validator from 'validator';
import { readImage } from "../middleware/imageUtils";
import { sendOTP } from '../middleware/sendOTP';
import { checkValidation } from '../middleware/validation';
import Product from "../models/productModel";
import { Customer, Seller, User } from "../models/userModel";

// -------------------------------- User Authentication --------------------------------

// User login
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

// User logout
export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.status(200).json({ message: "User logged out" });
    });
};

// Check if user is authenticated
export const isAuth = (req, res, next) => {
    if (req.user)
        return next();
    res.status(401).json({ message: 'User not logged in' });
};

// Check if user is a customer
export const isCustomer = (req, res, next) => {
    if (req.user.role === 'Customer')
        return next();
    res.status(403).json({ message: 'User is not a customer' });
};

// Check if user is a seller
export const isSeller = (req, res, next) => {
    if (req.user.role === 'Seller')
        return next();
    res.status(403).json({ message: 'User is not a seller' });
};

// Check if user is authenticated (informatory only)
export const checkAuthStatus = (req, res) => {
    res.status(200).json({ message: `User is ${req.user ? '' : 'not '}logged in`, status: !!req.user });
};

// -------------------------------- Manage and View Users --------------------------------

// Read user details
export const readUser = (req, res, next) => {
    res.status(200).json(req.user);
};

// Create a new customer
export const createCustomer = [

    // Validate request body fields
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
            // Check if user with the same email or phone number already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            });

            if (existingUser)
                return res.status(400).json({ message: "User with this email or phone number already exists" });

            // Create a new customer
            const newUser = new Customer({
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                name: req.body.name,
                avatar: req.file && readImage(req.file)
            });
            // Save the new customer
            await newUser.save();

            // Return the response
            res.status(201).json(process.env.NODE_ENV === 'production'
                ? { message: "User created successfully" }
                : newUser);
        } catch (err) {
            next(err);
        }
    }
];

// Create a new seller
export const createSeller = [

    // Validate request body fields
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
            // Check if user with the same email or phone number already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            });

            if (existingUser)
                return res.status(400).json({ message: "User with this email or phone number already exists" });

            // Create a new seller
            const newUser = new Seller({
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                bussinessName: req.body.bussinessName,
                about: req.body.about,
                companyLogo: req.file && readImage(req.file)
            });
            // Save the new seller
            await newUser.save();

            // Return the response
            res.status(201).json(process.env.NODE_ENV === 'production'
                ? { message: "User created successfully" }
                : newUser);
        } catch (err) {
            next(err);
        }
    }
];

// Update customer details
export const updateCustomer = [

    // Validate request body fields
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
            // Find and update the customer
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
            // If user not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            // Return the updated user
            res.status(200).json(process.env.NODE_ENV === 'production'
                ? { message: "User updated successfully" }
                : user
            );
        } catch (err) {
            next(err);
        }
    }
];

// Update seller details
export const updateSeller = [

    // Validate request body fields
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
            // Find and update the seller
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
            // If user not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            // Return the updated user
            res.status(200).json(process.env.NODE_ENV === 'production'
                ? { message: "User updated successfully" }
                : user
            );
        } catch (err) {
            next(err);
        }
    }
];

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        // If user is a seller, delete all associated products
        if (req.user.role === 'Seller')
            await Product.deleteMany({ userId: req.user._id });

        // Delete the user
        await User.findByIdAndDelete(req.user._id);
        // Return success response
        res.status(204).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- OTP Controllers --------------------------------

// Send OTP to user
export const sendOTPController = [

    // Validate request body fields
    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    checkValidation,

    async (req, res, next) => {
        try {
            // If user is already logged in, return an error
            if(req.user)
                return res.status(409).json({ message: "Cannot send OTP if user is logged in" });

            // Find the user by phone number and send the OTP
            const phoneNumber = req.body.phoneNumber;
            const user = await User.findOne({ phoneNumber: phoneNumber });
            if (!user)
                return res.status(404).json({ message: "User not found" });

            const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6 digit OTP
            // sendOTP(phoneNumber, otp); 
            await User.findOneAndUpdate(
                { phoneNumber: req.body.phoneNumber },
                { otp: otp, otpExpiry: new Date(Date.now() + 5 * 60 * 1000) }, // Set the OTP and its expiry time (5 minutes)
                { runValidators: true }
            );
            // If user not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            // Return success response
            res.json({ message: "OTP sent successfully" });
        } catch (err) {
            next(err);
        }
    }
];

// Verify OTP
export const verifyOTP = [

    // Validate request body fields
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

            // Check if OTP is valid and not expired
            if (new Date() > user.otpExpiry || req.body.otp !== user.otp)
                res.status(401).json({ message: "Invalid OTP" });
            else {
                req.session.isOtpVerified = true;
                res.status(200).json({ message: "Valid OTP" });
            }

            // If OTP is used or expired, remove the OTP and OTP expiry fields
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

// Change password
export const changePassword = [

    // Validate request body fields
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    body('oldPassword', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // If user is not logged in, verify OTP
            const user = await User.findById(req.user._id);
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            // Check if old password is correct
            const isMatch = await user.comparePassword(req.body.oldPassword);
            if (!isMatch)
                return res.status(401).json({ message: "Old password is incorrect" });

            // Check if new password is same as old password
            if (req.body.password === req.body.oldPassword)
                return res.status(400).json({ message: "New password cannot be same as old password" });

            // Update the password
            req.body.phoneNumber = user.phoneNumber;
            updatePassword(req, res, next);
        } catch (err) {
            next(err);
        }
    }
];

// Reset password
export const resetPassword = [

    // Validate request body fields
    body('phoneNumber', 'Phone number must be valid').custom(value => {
        if (!validator.isMobilePhone(value, 'en-IN'))
            throw new Error('Invalid phone number');
        return true;
    }),
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // If user is not logged in, verify OTP
            if (!req.session.isOtpVerified)
                return res.status(401).json({
                    message: "Cannot change password if OTP is not verified"
                });

            // Find the user by phone number
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            // Check if new password is same as old password
            const isMatch = await user.comparePassword(req.body.password);
            if (isMatch)
                return res.status(400).json({ message: "New password cannot be same as old password" });

            // Update the password
            updatePassword(req, res, next);
        } catch (err) {
            next(err);
        }
    }
];

// Function to update user password
const updatePassword = async (req, res, next) => {
    try {
        // Find the user by phone number and update the password
        const user = await User.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber },
            { password: req.body.password },
            { runValidators: true }
        );
        // If user not found, return error response
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        // If user is not logged in, set OTP verification status to false to prevent further password changes
        if(!req.user)
            req.session.isOtpVerified = false;

        // Return success response
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Manage User Addresses --------------------------------

// Add address
export const addAddress = [

    // Validate request body fields
    body('area', 'Area must be specified.').trim().isLength({ min: 1 }).escape(),
    body('city', 'City must be specified.').trim().isLength({ min: 1 }).escape(),
    body('state', 'State must be specified.').trim().isLength({ min: 1 }).escape(),
    body('country', 'Country must be specified.').trim().isLength({ min: 1 }).escape(),
    body('pincode', 'Pincode must be valid.').trim().isPostalCode('IN').escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // Add the address to the user
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { $push: { addresses: req.body } },
                { new: true, runValidators: true }
            );
            // If user not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            
            // Return the added address
            res.status(200).json(user.addresses[user.addresses.length - 1]);
        } catch (err) {
            next(err);
        }
    }
];

// Update address
export const updateAddress = [

    // Validate request body fields
    body('area', 'Area must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('city', 'City must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('state', 'State must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('country', 'Country must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('pincode', 'Pincode must be valid.').optional().trim().isPostalCode('IN').escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // Update the address
            req.body._id = req.params.addressId;
            const user = await User.findOneAndUpdate(
                { _id: req.user._id, "addresses._id": req.params.addressId },
                { $set: { "addresses.$": req.body } },
                { new: true, runValidators: true }
            );
            // If user not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User or address not found' });

            // Return the updated address
            const address = user.addresses.find(address =>
                address._id.toString() === req.params.addressId
            );
            res.status(200).json(address);
        } catch (err) {
            next(err);
        }
    }
];

// Delete address
export const deleteAddress = async (req, res, next) => {
    try {
        // Delete the address
        const user = await User.findOneAndUpdate(
            { _id: req.user._id, "addresses._id": req.params.addressId },
            { $pull: { addresses: { _id: req.params.addressId } } },
            { runValidators: true }
        );
        // If user not found, return error response
        if (!user)
            return res.status(404).json({ message: 'User or address not found' });

        // Return success response
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Manage User Cart --------------------------------

// Add product to cart
export const addToCart = [

    // Validate request body fields
    body('quantity', 'Quantity must be specified and be a number.').trim().isInt({ gt: 0 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // Check if product exists and has sufficient quantity
            const product = await Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            if (product.quantity < req.body.quantity)
                return res.status(400).json({ message: "Not sufficient quantity available" });

            // Check if product is already in the cart
            const productInCart = req.user.cart.find(item => item.product._id.toString() === req.params.productId);
            if (productInCart)
                return res.status(400).json({ message: 'Product is already in the cart' });

            // Add the product to the cart
            req.body.product = req.params.productId;
            const user = await Customer.findByIdAndUpdate(
                req.user._id,
                { $push: { cart: req.body } },
                { new: true, runValidators: true }
            );
            // If user not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User not found' });

            // Return the added product
            res.status(200).json(user.cart[user.cart.length - 1]);
        } catch (err) {
            next(err);
        }
    }
];

// Update product quantity in cart
export const updateInCart = [

    // Validate request body fields
    body('quantity', 'Quantity must be specified and be a number.').trim().isInt({ gt: 0 }).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // If quantity is 0, delete the product from the cart
            if (req.body.quantity == 0) {
                deletefromCart(req, res);
                return;
            }

            // Check if product exists and has sufficient quantity
            const product = await Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            if (product.quantity < req.body.quantity)
                return res.status(400).json({ message: "Not sufficient quantity available" });

            // Update the product quantity in the cart
            req.body.product = req.params.productId;
            const user = await Customer.findOneAndUpdate(
                { _id: req.user._id, "cart.product": req.params.productId },
                { $set: { "cart.$.quantity": req.body.quantity } },
                { new: true, runValidators: true }
            );
            // If user or product not found, return error response
            if (!user)
                return res.status(404).json({ message: 'User or product not found' });

            // Return the updated product
            const item = user.cart.find(item => item.product.toString() === req.params.productId);
            res.status(200).json(item);
        } catch (err) {
            next(err);
        }
    }
];

// Delete product from cart
export const deletefromCart = async (req, res, next) => {
    try {
        // Check if product exists
        const product = await Product.findById(req.params.productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        // Delete the product from the cart
        const user = await Customer.findOneAndUpdate(
            { _id: req.user._id, "cart.product": req.params.productId },
            { $pull: { cart: { product: req.params.productId } } },
            { runValidators: true }
        );
        // If user or product not found, return error response
        if (!user)
            return res.status(404).json({ message: 'User or product not found' });

        // Return success response
        res.status(200).json({ message: "Product deleted from cart successfully" });
    } catch (err) {
        next(err);
    }
};
