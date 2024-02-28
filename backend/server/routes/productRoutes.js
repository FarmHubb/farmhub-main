import {
    addProduct,
    addReview,
    deleteProduct,
    deleteReview,
    getTopProducts,
    getProduct,
    searchProducts,
    updateProduct,
    updateReview,
    getProductsByCategory,
    getProductsBySeller
} from '../controllers/productController';
import { upload } from '../middleware/imageUtils';
import { isAuth, isCustomer, isSeller } from './../controllers/userController';

const productRoutes = (app) => {

    //-------------------------------- Manage Products --------------------------------
    
    app.route('/product')
        .post(isAuth, isSeller, upload.array("images"), addProduct);

    app.route('/products/category/:category/:sort')
        .get(getProductsByCategory);
    app.route('/products/search/:term/:sort')
        .get(searchProducts)
    app.route('/products/top')
        .get(getTopProducts)
    app.route('/products/seller/:sellerId/:sort')
        .get(getProductsBySeller);
    
    app.route('/product/:productId')
        .get(getProduct)
        .put(isAuth, isSeller, upload.array("images"), updateProduct)
        .delete(isAuth, isSeller, deleteProduct);

    // ------------------------------- Manage Reviews -------------------------------

    app.route('/product/:productId/review')
        .put(isAuth, isCustomer, addReview);
    app.route('/product/:productId/review/:userId')
        .put(isAuth, isCustomer, updateReview)
        .delete(isAuth, isCustomer, deleteReview);
}

export default productRoutes;