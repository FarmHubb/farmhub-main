import {
    addProduct,
    addReview,
    deleteProduct,
    deleteReview,
    getTopProducts,
    getProduct,
    productSearch,
    updateProduct,
    updateReview
} from '../controllers/productController';
import { upload } from '../middleware/imageUtils';
import { isAuth, isCustomer, isSeller } from './../controllers/userController';

const productRoutes = (app) => {

    //-------------------------------- Manage Products --------------------------------
    
    app.route('/product')
        .post(isAuth, isSeller, upload.array("images"), addProduct);

    app.route('/products/category/:category/:sort')
        .get(getProduct);
    app.route('/products/search/:term/:sort')
        .get(productSearch)
    app.route('/products/top')
        .get(getTopProducts)

    app.route('/product/:productId')
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