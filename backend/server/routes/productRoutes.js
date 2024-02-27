import {
    addProduct,
    addReview,
    deleteProduct,
    deleteReview,
    displayProduct,
    getAllProducts,
    getTopProducts,
    getProduct,
    productSearch,
    updateProduct,
    updateReview
} from '../controllers/productController';
import { upload } from '../middleware/imageUtils';
import { isAuth } from './../controllers/userController';

const productRoutes = (app) => {

    app.route('/product')
        .post(upload.array("images"), addProduct);
    app.route('/products')
        .get(getAllProducts); // (dashboard)
    app.route('/products/category/:category/:sort')
        .get(getProduct);
    app.route('/products/search/:term/:sort')
        .get(productSearch)
    app.route('/products/top')
        .get(getTopProducts)
    app.route('/product/:productId')
        .get(displayProduct)
        .put(upload.array("images"), updateProduct)
        .delete(deleteProduct);
    app.route('/product/:productId/review')
        .put(isAuth, addReview);
    app.route('/product/:productId/review/:userId')
        .put(isAuth, updateReview)
        .delete(isAuth, deleteReview);
}

export default productRoutes;