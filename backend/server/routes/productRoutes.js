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
        .patch(isAuth, isSeller, upload.array("images"), updateProduct)
        .delete(isAuth, isSeller, deleteProduct);

    // ------------------------------- Manage Reviews -------------------------------

    app.route('/product/:productId/review')
        .post(isAuth, isCustomer, addReview)
        .delete(isAuth, isCustomer, deleteReview);
    app.route('/product/:productId/review/update')
        .patch(isAuth, isCustomer, updateReview)
}

export default productRoutes;