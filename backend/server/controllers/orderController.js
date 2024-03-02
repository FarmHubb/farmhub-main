import { config } from 'dotenv';
import { body } from "express-validator";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import { User } from "../models/userModel";
import { checkValidation } from './../middleware/validation';
config();

export const createOrders = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id).populate('cart.product');
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        if (req.body.addressIndex < 0 || req.body.addressIndex >= user.addresses.length)
            return res.status(400).json({ message: "Invalid address index" });

        if (user.cart.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        for (var item of user.cart) {
            if (item.product.quantity < item.quantity)
                return res.status(400).json({ message: "Some products are not available in the quantities demanded by user" });
        }

        let newOrders = [];
        for (const item of user.cart) {
            const product = await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { quantity: -item.quantity } },
                { new: true, runValidators: true }
            );
            if (!product)
                continue;
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
                user: user._id,
                address: user.addresses[req.body.addressIndex],
            });
            newOrders.push(newOrder);
        }
        let orders;
        [orders, user] = await Promise.all([
            Order.insertMany(newOrders, { populate: "product" }),
            User.findByIdAndUpdate(
                user._id,
                { $set: { cart: [] } },
                { runValidators: true }
            )
        ]);
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        res.status(201).json(process.env.NODE_ENV === 'production'
            ? { message: "Orders placed successfully" }
            : orders
        );
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId, '-user -updatedAt')
            .populate("product", "name price images")
        if (!order)
            return res.status(404).json({ message: 'Order not found' });

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

export const getOrdersByCustomer = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user },
            'status createdAt dateDelivered total')
            .populate("product", "name")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export const getOrdersByProduct = async (req, res, next) => {
    try {
        const orders = await Order.find({ product: req.params.productId },
            'status createdAt dateDelivered total')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = [

    body('status', 'Invalid status').isIn(["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]).escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            let dd;
            if (req.body.status === "Delivered") dd = new Date();
            const order = await Order.findByIdAndUpdate(
                req.params.orderId,
                { status: req.body.status, dateDelivered: dd },
                { new: true, runValidators: true }
            );
            if (!order)
                return res.status(404).json({ message: 'Order not found' });

            res.status(200).json({ status: order.status });
        } catch (err) {
            next(err);
        }
    }
];
