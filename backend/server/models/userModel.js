import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { CUSTOMER, SELLER } from '../constants';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, validate: validator.isEmail },
    password: { type: String, required: true, minLength: 6 },
    phoneNumber: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return validator.isMobilePhone(v, 'en-IN');
            }
        }
    },
    addresses: {
        type: [{
            area: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            pincode: { type: String, required: true },
        }]
    },
    resetPasswordOtp: String
}, {
    discriminatorKey: 'role',
    timestamps: true,
});

userSchema.set('toJSON', { getters: true });

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (!update.password) return next();
    try {
        const hash = await bcrypt.hash(update.password, 12);
        update.password = hash;
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

const customerSchema = new Schema({
    name: { type: String, required: true },
    avatar: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    },
    cart: [{
        _id: false,
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
    }],
}, {
    virtuals: {
        cartTotal: {
            get() {
                if (!this.populated('cart.product'))
                    return null;
                let cartSubtotal = 0;
                for (const item of this.cart)
                    cartSubtotal += item.product.price * item.quantity;
                return cartSubtotal;
            }
        },
        cartItems: {
            get() {
                let cartItems = 0;
                for (const item of this.cart)
                    cartItems += item.quantity;
                return cartItems;
            }
        }
    },
})

const Customer = User.discriminator(CUSTOMER, customerSchema);

// -------------------------------- Seller Schema --------------------------------

const sellerSchema = new Schema({
    bussinessName: { type: String, required: true },
    companyLogo: { type: String },
    about: { type: String },
});

const Seller = User.discriminator(SELLER, sellerSchema);

// ----------------------------------------------------------------

export default { User, Customer, Seller }