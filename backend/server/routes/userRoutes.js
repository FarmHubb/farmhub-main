import {
    addAddress,
    addToCart,
    checkOtp,
    createCustomer,
    createSeller,
    deleteAddress,
    deleteUser,
    deletefromCart,
    forgotPassword,
    getUserProfile,
    isAuth,
    isCustomer,
    isSeller,
    login,
    logout,
    readUser,
    resetPassword,
    updateAddress,
    updateCustomer,
    updateInCart,
    updateSeller,
} from '../controllers/userController';
import { upload } from '../middleware/imageUtils';

const userRoutes = (app) => {

    //-------------------------------- User Authentication --------------------------------

    app.route('/user/login')
    .post(login);
    app.route('/user/logout')
    .get(isAuth, logout);
    
    //-------------------------------- Manage and View Users --------------------------------
    
    app.route('/user/customer')
        .post(upload.single('avatar'), createCustomer)
        .patch(isAuth, isCustomer, upload.single('avatar'), updateCustomer)

    app.route('/user/seller')
        .post(upload.single('companyLogo'), createSeller)
        .patch(isAuth, isSeller, upload.single('comapanyLogo'), updateSeller)

    app.route('/user')
        .get(isAuth, readUser)
        .delete(isAuth, deleteUser);

    app.route('/user/profile')
        .get(isAuth, getUserProfile);

    //-------------------------------- Manage User Passwords --------------------------------

    app.route('/user/password/reset')
        .patch(isAuth, resetPassword);
    app.route("/user/password/forgot")
        .post(forgotPassword);
    app.route("/user/password/otpCheck")
        .post(checkOtp);

    //-------------------------------- Manage User Addresses --------------------------------

    app.route('/user/address')
        .post(isAuth, addAddress);
    app.route('/user/address/:addressId')
        .patch(isAuth, updateAddress)
        .delete(isAuth, deleteAddress);

    //-------------------------------- Manage Customer Cart --------------------------------

    app.route('/user/cart/:productId')
        .post(isAuth, isCustomer, addToCart)
        .patch(isAuth, isCustomer, updateInCart)
        .delete(isAuth, isCustomer, deletefromCart);
}

export default userRoutes;