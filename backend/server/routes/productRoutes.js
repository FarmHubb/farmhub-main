import {
    productList,
    addProduct,
    displayProduct,
    updateProduct,
    deleteProduct,
    addReview,
    updateReview,
    deleteReview,
    productSearch,
    getAllProducts,
    getTopProducts
} from '../controllers/productController';
import multer from 'multer';

const productRoutes = (app) => {
    var upload = multer({ dest: './uploads/'});

    app.route('/product')
        .post(upload.array("images"), addProduct);
    app.route('/products')
        .get(getAllProducts);
    app.route('/products/category/:category/:sort')
        .get(productList);
    app.route('/products/search/:term/:sort')
        .get(productSearch)
    app.route('/products/top')
        .get(getTopProducts)
    app.route('/product/:productId')
        .get(displayProduct)
        .put(upload.array("images"), updateProduct)
        .delete(deleteProduct);
    app.route('/product/:productId/review')
        .put(addReview);
    app.route('/product/:productId/review/:userId')
        .put(updateReview)
        .delete(deleteReview);
}

export default productRoutes;