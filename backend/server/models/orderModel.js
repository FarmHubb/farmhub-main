import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingCharges: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentInfo:{
        id:{
            type: String,
            // required: true,
        },
        status:{
            type: String,
            // required: true,
        },
    },
    status: {
        type: String,
        enum: [
            "Not processed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ],
        default: "Not processed",
    },
    dateDelivered: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: {
        area: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String, required: true },
    },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);