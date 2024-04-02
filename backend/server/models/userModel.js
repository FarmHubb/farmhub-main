import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, validate: validator.isEmail },
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
    password: { type: String, required: true, minLength: 6 },
    addresses: {
        type: [{
            area: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            pincode: { type: String, required: true },
        }]
    },
    otp: String,
    otpExpiry: Date
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
        data: { type: Buffer },
        contentType: { type: String }
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
                if(!this.cart)
                    return null;
                let cartItems = 0;
                for (const item of this.cart)
                    cartItems += item.quantity;
                return cartItems;
            }
        }
    },
})

const Customer = User.discriminator('Customer', customerSchema);

// -------------------------------- Seller Schema --------------------------------

const sellerSchema = new Schema({
    bussinessName: { type: String, required: true },
    companyLogo: {
        data: { type: Buffer },
        contentType: { type: String }
    },
    about: { type: String },
});

const Seller = User.discriminator('Seller', sellerSchema);

export { User, Customer, Seller };