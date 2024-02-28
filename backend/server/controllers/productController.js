import { body } from "express-validator";
import { readImages } from "../middleware/imageUtils";
import Product from "../models/productModel";
import { PROD, TOP_PRODUCTS } from './../constants';
import { checkValidation } from "../middleware/validation";

// -------------------------------- Manage and view products --------------------------------

export const addProduct = [

    body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must be specified.').trim()
        .isIn(['Fertilizers', 'Pesticides', 'Seeds', 'Traps', 'Crop-Tonics']).escape(),
    body('brand', 'Brand must be specified.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be a positive number').trim().isFloat({ gt: 0 }),
    body('quantity', 'Quantity must be a positive integer').optional().trim().isInt({ gt: 0 }),
    checkValidation,

    async (req, res, next) => {
        try {
            if (req.files.length)
                req.body.images = readImages(req.files);
            let newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                brand: req.body.brand,
                price: req.body.price,
                quantity: req.body.quantity,
                seller: req.user._id,
            });
            await newProduct.save();
            res.status(201).json(process.env.NODE_ENV === PROD
                ? { message: "Product added successfully" }
                : newProduct
            );
        } catch (err) {
            next(err);
        }
    }
]

export const updateProduct = [

    body('name', 'Name must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must be specified.').optional().trim()
        .isIn(['Fertilizers', 'Pesticides', 'Seeds', 'Traps', 'Crop-Tonics']).escape(),
    body('brand', 'Brand must be specified.').optional().trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be a positive number').optional().trim().isFloat({ gt: 0 }),
    body('quantity', 'Quantity must be a positive integer').optional().trim().isInt({ gt: 0 }),
    checkValidation,

    async (req, res, next) => {
        try {
            if (req.files.length)
                req.body.images = readImages(req.files);

            const product = await Product.findByIdAndUpdate(
                req.params.productId,
                {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    brand: req.body.brand,
                    price: req.body.price,
                    quantity: req.body.quantity,
                },
                { new: true, runValidators: true }
            ).select('-reviews -seller');
            if (!product)
                return res.status(404).json({ message: 'Product not found' });

            res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    }
]

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        res.status(204).json({ message: "Product deleted successfully" });
    } catch (err) {
        next(err);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.productId).populate(
            "reviews.user"
        );
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        if (req.user) {
            product.reviews.sort((a, b) => {
                if (a.user._id.equals(req.user._id)) return -1;
                if (b.user._id.equals(req.user._id)) return 1;
                return 0;
            });
        }
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

export const getProductsByCategory = async (req, res, next) => {
    try {
        const [products, brands] = await Promise.all([
            Product.find(
                { category: req.params.category },
                "name price images reviews brand"
            ).sort(req.params.sort !== "none" ? req.params.sort : ""),
            Product.find({ category: req.params.category }).distinct("brand")
        ]);
        res.status(200).json({ products: products, brands: brands });
    } catch (err) {
        next(err);
    }
};

export const searchProducts = async (req, res, next) => {
    try {
        const products = await Product.find(
            { $text: { $search: req.params.term } },
            "name price images reviews brand"
        ).sort(req.params.sort !== "none" ? req.params.sort : "");
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

export const getTopProducts = async (req, res, next) => {
    try {
        const products = await Product.find(
            { _id: { $in: TOP_PRODUCTS } },
            "name price images reviews brand"
        );
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

export const getProductsBySeller = async (req, res, next) => {
    try {
        const products = await Product.find(
            { seller: req.params.sellerId },
            "name price images reviews brand"
        ).sort(req.params.sort !== "none" ? req.params.sort : "");
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Reviews --------------------------------

export const addReview = [

    body('rating', 'Rating must be a number between 1 and 5').isInt({ min: 1, max: 5 }),
    body('description', 'Description must be a string').optional().isString().trim().escape(),
    checkValidation,
    
    async (req, res, next) => {
        try {
            req.body.user = req.user._id;
            const product = await Product.findByIdAndUpdate(
                req.params.productId,
                { $push: { reviews: req.body } },
                { new: true, runValidators: true }
            );
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
    
            res.status(200).json(product.reviews[product.reviews.length - 1]);
        } catch (err) {
            next(err);
        }
    }
]

export const updateReview = [
    
    body('rating', 'Rating must be a number between 1 and 5').optional().isInt({ min: 1, max: 5 }),
    body('description', 'Description must be a string').optional().isString().trim().escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            const product = await Product.findOneAndUpdate(
                { _id: req.params.productId, "reviews.user": req.user._id },
                {
                    $set: {
                        "reviews.$.rating": req.body.rating,
                        "reviews.$.description": req.body.description,
                    },
                },
                { new: true, runValidators: true }
            );
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
    
            const review = product.reviews.find(review =>
                review.user.toString() === req.user._id
            );
            res.status(200).json(review);
        } catch (err) {
            next(err);
        }
    }
] 

export const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.productId, "reviews.user": req.user._id },
            { $pull: { reviews: { user: req.user._id } } },
            { runValidators: true }
        );
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        next(err);
    }
};
