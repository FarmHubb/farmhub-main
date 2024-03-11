import { body } from "express-validator";
import { readImages } from "../middleware/imageUtils";
import Product from "../models/productModel";
import { checkValidation } from "../middleware/validation";

// -------------------------------- Manage and view products --------------------------------

// Add a new product
export const addProduct = [
    // Validate the request body
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
            // Check if there are any uploaded images
            if (req.files.length)
                req.body.images = readImages(req.files);

            // Create a new product object
            let newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                brand: req.body.brand,
                price: req.body.price,
                quantity: req.body.quantity,
                seller: req.user._id,
            });

            // Save the new product to the database
            await newProduct.save();

            // Return the response
            res.status(201).json(process.env.NODE_ENV === 'production'
                ? { message: "Product added successfully" }
                : newProduct
            );
        } catch (err) {
            next(err);
        }
    }
]

// Update a product
export const updateProduct = [
    // Validate the request body
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
            // Check if there are any uploaded images
            if (req.files.length)
                req.body.images = readImages(req.files);

            // Find and update the product
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

            // If product is not found, return 404 status
            if (!product)
                return res.status(404).json({ message: 'Product not found' });

            // Return the updated product
            res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    }
]

// Delete a product
export const deleteProduct = async (req, res, next) => {
    try {
        // Find and remove the product by its ID
        const product = await Product.findByIdAndDelete(req.params.productId);

        // If product is not found, return 404 status
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        // Return success message
        res.status(204).json({ message: "Product deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// Get a product
export const getProduct = async (req, res, next) => {
    try {
        // Find the product by its ID and populate the user field in the reviews with name and avatar
        let product = await Product.findById(req.params.productId).populate(
            "reviews.user", "name avatar"
        );

        // If product is not found, return 404 status
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        // Sort the reviews to show the logged in user's review first
        if (req.user) {
            product.reviews.sort((a, b) => {
                if (a.user._id.equals(req.user._id)) return -1;
                if (b.user._id.equals(req.user._id)) return 1;
                return 0;
            });
        }

        // Return the product with populated reviews
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

// Get products by category
export const getProducts = async (req, res, next) => {
    try {
        // Get query parameters
        let {
            category,
            minPrice,
            maxPrice,
            minRating,
            brands,
            term,
            seller,
            sort
        } = req.query;
        // Parse query parameters
        brands = brands ? brands.split(',') : [];

        // Initialize filter
        let filter = {};
        // filter by category
        if (category)
            filter.category = category;
        // filter by search term
        if (term) {
            const regex = new RegExp(term, 'i'); // 'i' makes it case insensitive
            filter.$or = [
                { name: regex },
                { description: regex },
                { brand: regex },
                { category: regex }
            ];
        }
        // filter by price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = minPrice;
            if (maxPrice) filter.price.$lte = maxPrice;
        }
        // filter by ratings
        if (minRating)
            filter.avgRating = { $gte: minRating };
        // filter by brands
        if (brands.length > 0)
            filter.brand = { $in: brands };
        // filter by seller
        if (seller)
            filter.seller = seller;

        // Find products that match the filter and list of brands in it   
        const [products, brandList] = await Promise.all([
            Product.find(filter, "name price images avgRating brand").sort(sort),
            Product.find({ category: category }).distinct("brand")
        ]);

        // Return the products and brands
        res.status(200).json({ products: products, brands: brandList });
    } catch (err) {
        next(err);
    }
};

// Get top products
export const getTopProducts = async (req, res, next) => {
    try {
        // Define the IDs of the top products
        const topProducts = [
            "6432960be07105bc0a7ebc1d",
            "643296e1e07105bc0a7ebc20",
            "643bdd29697478b49cc1de9a",
            "643bde8e697478b49cc1ded3",
            "643bdf5f697478b49cc1ded7",
            "643be2ec4885fe0b918bb12b",
            "643be5194885fe0b918bb15d",
            "643be5d64885fe0b918bb192",
        ];

        // Find the top products
        const products = await Product.find(
            { _id: { $in: topProducts } },
            "name price images avgRating brand"
        );

        // Return the top products
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

// -------------------------------- Reviews --------------------------------

// Add a review to a product
export const addReview = [
    // Validate the request body
    body('rating', 'Rating must be a number between 1 and 5').isInt({ min: 1, max: 5 }),
    body('description', 'Description must be a string').optional().isString().trim().escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // Check if product exists
            let product;
            req.body.user = req.user._id;
            product = await Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });

            // Check if the user has already reviewed the product
            const userReview = product.reviews.find(review =>
                review.user.toString() === req.user._id.toString());
            if (userReview)
                return res.status(400).json({ message: 'You have already reviewed this product' });

            // Calculate the new average rating
            const newAvgRating =
                (product.reviews.reduce((sum, review) => sum + review.rating, 0) + Number(req.body.rating))
                / (product.reviews.length + 1);

            // Add the review to the product and update the average rating
            product = await Product.findByIdAndUpdate(
                req.params.productId,
                {
                    $push: { reviews: req.body },
                    avgRating: newAvgRating
                },
                { new: true, runValidators: true }
            );

            // Return the updated review
            res.status(200).json(product.reviews[product.reviews.length - 1]);
        } catch (err) {
            next(err);
        }
    }
]

// Update a review
export const updateReview = [
    // Validate the request body
    body('rating', 'Rating must be a number between 1 and 5').optional().isInt({ min: 1, max: 5 }),
    body('description', 'Description must be a string').optional().isString().trim().escape(),
    checkValidation,

    async (req, res, next) => {
        try {
            // Find the product by ID
            let product = await Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });

            // Find the review by user ID
            let review = product.reviews.find(review =>
                review.user.toString() === req.user._id.toString());

            if (!review)
                return res.status(404).json({ message: 'Review not found' });

            // Calculate the new average rating
            review.rating = Number(req.body.rating);
            const newAvgRating =
                product.reviews.reduce((sum, review) => sum + review.rating, 0)
                / product.reviews.length;

            // Update the review in the product and update the average rating
            product = await Product.findOneAndUpdate(
                { _id: req.params.productId, "reviews.user": req.user._id },
                {
                    $set: {
                        "reviews.$.rating": req.body.rating,
                        "reviews.$.description": req.body.description,
                    },
                    avgRating: newAvgRating
                },
                { new: true, runValidators: true }
            );
            if (!product)
                return res.status(404).json({ message: 'Product or review not found' });

            // Find the updated review
            review = product.reviews.find(review =>
                review.user.toString() === req.user._id.toString()
            );

            // Return the updated review
            res.status(200).json(review);
        } catch (err) {
            next(err);
        }
    }
]

// Delete a review
export const deleteReview = async (req, res, next) => {
    try {
        // Find the product by ID
        let product = await Product.findById(req.params.productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        // Find the index of the review in the product's reviews array
        const reviewIndex = product.reviews.findIndex(review =>
            review.user.toString() === req.user._id.toString());

        // If the review is not found, return an error
        if (reviewIndex === -1)
            return res.status(404).json({ message: 'Review not found' });
        
        // Calculate the new average rating
        product.reviews.splice(reviewIndex, 1);
        let newAvgRating = 0;
        if (product.reviews.length)
            newAvgRating =
                product.reviews.reduce((sum, review) => sum + review.rating, 0)
                / product.reviews.length;

        // Update the product by removing the review and updating the average rating
        product = await Product.findOneAndUpdate(
            { _id: req.params.productId, "reviews.user": req.user._id },
            {
                $pull: { reviews: { user: req.user._id } },
                avgRating: newAvgRating
            },
            { runValidators: true }
        );

        // If the product or review is not found, return an error
        if (!product)
            return res.status(404).json({ message: 'Product or review not found' });

        // Return a success message
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        next(err);
    }
};
