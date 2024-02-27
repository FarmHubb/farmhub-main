import { config } from 'dotenv';
import passport from "passport";
import twilio from "twilio";
import { readImage } from "../middleware/imageUtils";
import Product from "../models/productModel";
import User from "../models/userModel";
config();

// -------------------------------- User Authentication --------------------------------

export const login = (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err)
            return res.status(500).send(err);
        if (!user)
            return res.status(401).send(info.message);
        req.logIn(user, function (err) {
            if (err)
                return res.status(500).send(err);
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

// -------------------------------- Manage and View Users --------------------------------

export const readUser = (req, res) => {
    res.status(200).json(req.user);
};

export const createUser = async (req, res) => {
    try {
        if (req.file)
            req.body.avatar = readImage(req.file);
        let newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(process.env.NODE_ENV === PROD
            ? { message: "User created successfully" }
            : newUser);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateUser = async (req, res) => {
    try {
        if (req.file)
            req.body.avatar = readImage(req.file);
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(process.env.NODE_ENV === PROD 
            ? { message: "User updated successfully" }
            : user
        );
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.userId);
        res.status(204).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
};

// -------------------------------- Manage User Password --------------------------------

export const changePassword = async (req, res) => {
    try {
        await User.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber },
            { password: req.body.password },
            { runValidators: true }
        );
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const isMatch = await user.comparePassword(req.body.oldPassword);
        if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });
        req.body.phoneNumber = user.phoneNumber;
        changePassword(req, res);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const user = await User.findOne({ phoneNumber: phoneNumber });
        if (!user)
            return res.status(401).json({ message: "User not found" });

        const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
        const otp = Math.floor(100000 + Math.random() * 900000);
        await User.findOneAndUpdate(
            { phoneNumber: req.body.phoneNumber },
            { resetPasswordOtp: otp },
            { new: true, runValidators: true }
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
        res.json({ message: "OTP sent successfully"});
    } catch (error) {
        res.status(500).send(error);
    }
};

export const checkOtp = async (req, res) => {
    try {
        const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (req.body.otp !== user.resetPasswordOtp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }
        res.status(200).json({ message: "Valid OTP" });
    } catch (error) {
        res.send(error);
    }
    changePassword(req, res)
};

// -------------------------------- Manage User Addresses --------------------------------

export const addAddress = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $push: { addresses: req.body } },
            { new: true, runValidators: true }
        );
        res.status(200).json(user.addresses[user.addresses.length - 1]);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateAddress = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId, "addresses._id": req.params.addressId },
            { $set: { "addresses.$": req.body } },
            { runValidators: true }
        );
        const address = user.addresses.find(address =>
            address._id.toString() === req.params.addressId
        );
        res.status(200).json(address);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteAddress = async (req, res) => {
    try {
        await User.findOneAndUpdate(
            { _id: req.params.userId, "addresses._id": req.params.addressId },
            { $pull: { addresses: { _id: req.params.addressId } } },
            { runValidators: true }
        );
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
};

// -------------------------------- Manage User Cart --------------------------------

export const addToCart = async (req, res) => {
    try {
        const product = await Product.findById(req.body.product);
        if (product.quantity < req.body.quantity) {
            res.status(400).json({ message: "Not sufficient quantity available" });
            return;
        }
        await Product.findByIdAndUpdate(
            req.body.product,
            { $inc: { quantity: -req.body.quantity } },
            { runValidators: true }
        );
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $push: { cart: req.body } },
            { new: true, runValidators: true }
        );
        res.status(200).json(user.cart[user.cart.length - 1]);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateInCart = async (req, res) => {
    try {
        if (req.body.quantity == 0) {
            deletefromCart(req, res);
            return;
        }
        const user = await User.findOne(
            { _id: req.params.userId, "cart.product": req.params.productId },
            { "cart.$": 1 }
        );
        const quantity = req.body.quantity - user.cart[0].quantity;
        const product = await Product.findById(req.params.productId);
        if (product.quantity < quantity) {
            res.status(400).json({ message: "Not sufficient quantity available" });
            return;
        }
        await Product.findByIdAndUpdate(
            req.params.productId,
            { $inc: { quantity: -quantity } },
            { new: true, runValidators: true }
        );
        await User.findOneAndUpdate(
            { _id: req.params.userId, "cart.product": req.params.productId },
            { $set: { "cart.$.quantity": req.body.quantity } },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: "Cart updated successfully"});
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deletefromCart = async (req, res) => {
    try {
        const user = await User.findOne(
            { _id: req.params.userId, "cart.product": req.params.productId },
            { "cart.$": 1 }
        );
        const quantity = user.cart[0].quantity;
        await Product.findByIdAndUpdate(
            req.params.productId,
            { $inc: { quantity: +quantity } },
            { new: true, runValidators: true }
        );
        await User.findOneAndUpdate(
            { _id: req.params.userId, "cart.product": req.params.productId },
            { $pull: { cart: { product: req.params.productId } } },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: "Product deleted from cart successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
};
