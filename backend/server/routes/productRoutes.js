import {
    addProduct,
    addReview,
    deleteProduct,
    deleteReview,
    getProduct,
    getProducts,
    getTopProducts,
    updateProduct,
    updateReview
} from '../controllers/productController';
import { upload } from '../middleware/imageUtils';
import { isAuth, isCustomer, isSeller } from './../controllers/userController';

const productRoutes = (app) => {

    //-------------------------------- Manage Products --------------------------------
    
    app.route('/product')
        .post(isAuth, isSeller, upload.array("images"), addProduct);

    app.route('/products')
        .get(getProducts);
    app.route('/products/top')
        .get(getTopProducts)
    
    app.route('/product/:productId')
        .get(getProduct)
        .patch(isAuth, isSeller, upload.array("images"), updateProduct)
        .delete(isAuth, isSeller, deleteProduct);

    // ------------------------------- Manage Reviews -------------------------------

    app.route('/product/:productId/review')
        .post(isAuth, isCustomer, addReview)
        .patch(isAuth, isCustomer, updateReview)
        .delete(isAuth, isCustomer, deleteReview);
}

export default productRoutes;