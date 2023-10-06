import Order from "../models/orderModel";
import User from "../models/userModel";

export const createOrder = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findById(req.params.userId).populate(
      "cart.product"
    );
    let newOrders = [];
    for (const item of user.cart) {
      const subtotal = item.product.price * item.quantity;
      const newOrder = new Order({
        product: item.product._id,
        quantity: item.quantity,
        subtotal: subtotal,
        shippingCharges: subtotal > 1500 ? 0 : 60,
        tax: subtotal * 0.18,
        total: subtotal + subtotal * 0.18 + (subtotal > 1500 ? 0 : 60),
        paymentInfo: req.body.paymentInfo,
        user: req.params.userId,
        address: req.body.address,
      });
      newOrders.push(newOrder);
    }
    const orders = await Order.insertMany(newOrders, { populate: "product" });
    await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { cart: [] } },
      { runVaidators: true }
    );
    res.json(orders);
  } catch (err) {
    res.send(err);
  }
};

export const orderInfo = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("product");
    res.json(order);
  } catch (err) {
    res.send(err);
  }
};

export const updateOrder = async (req, res) => {
  try {
    let dd;
    if (req.body.status === "Delivered") dd = new Date();
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status, dateDelivered: dd },
      { new: true, runValidators: true }
    );
    res.json(order);
  } catch (err) {
    res.send(err);
  }
};

export const orderList = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    res.send(err);
  }
};

export const userOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.send(err);
  }
};
