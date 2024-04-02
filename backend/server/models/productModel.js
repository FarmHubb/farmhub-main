import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    _id: false,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, enum: [1, 2, 3, 4, 5], min: 1, required: true },
    description: { type: String }
});

const imageSchema = new Schema({
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
});

const productSchema = new Schema({
    name: { type: String, required: true },
    images: { type: [imageSchema], required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            'Fertilizers',
            'Pesticides',
            'Seeds',
            'Traps',
            'Crop-Tonics',
        ],
    },
    brand: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    reviews: [reviewSchema]
});

productSchema.set('toJSON', { getters: true });

export default mongoose.model('Product', productSchema);