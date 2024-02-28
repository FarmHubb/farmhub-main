import { config } from 'dotenv';
import Order from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";
import { PROD } from '../constants';
config();

export const createOrders = async (req, res, next) => {
    try {
        const user = req.user;
        // Check if enough items are available in stock
        for (var item of user.cart) {
            if (item.product.quantity < item.quantity)
                return res.status(400).json({ message: "Some products are not available in the quantities demanded by user" });
        }
        // Create orders once confirmed all items are available
        let newOrders = [];
        for (const item of user.cart) {
            Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { quantity: -item.quantity } },
                { new: true, runValidators: true }
            );
            const subtotal = item.product.price * item.quantity;
            const shippingCharges = subtotal > 1500 ? 0 : 60;
            const tax = subtotal * 0.18;
            const newOrder = new Order({
                product: item.product._id,
                quantity: item.quantity,
                subtotal: subtotal,
                shippingCharges: shippingCharges,
                tax: tax,
                total: subtotal + tax + shippingCharges,
                paymentInfo: req.body.paymentInfo,
                user: req.user._id,
                address: req.body.address,
            });
            newOrders.push(newOrder);
        }
        const [orders] = await Promise.all([
            Order.insertMany(newOrders, { populate: "product" }),
            User.findByIdAndUpdate(
                req.user._id,
                { $set: { cart: [] } },
                { runValidators: true }
            )
        ]);
        res.status(201).json(process.env.NODE_ENV === PROD
            ? { message: "Order placed successfully" }
            : orders
        );
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate("product", "name price images")
            .select('-user', '-updatedAt');
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

export const getOrdersByCustomer = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user })
            .populate("product", "name")
            .select('status createdAt dateDelivered total')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export const getOrdersByProduct = async (req, res, next) => {
    try {
        const orders = await Order.find({ product: req.params.productId })
            .populate("user")
            .select('status createdAt dateDelivered total')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        let dd;
        if (req.body.status === "Delivered") dd = new Date();
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status: req.body.status, dateDelivered: dd },
            { new: true, runValidators: true }
        );
        res.status(200).json(order.status);
    } catch (err) {
        next(err);
    }
};
