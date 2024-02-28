import {
    addAddress,
    addToCart,
    changePassword,
    checkOtp,
    createUser,
    deleteAddress,
    deleteUser,
    deletefromCart,
    forgotPassword,
    getUserProfile,
    isAuth,
    isCustomer,
    login,
    logout,
    readUser,
    resetPassword,
    updateAddress,
    updateInCart,
    updateUser,
} from '../controllers/userController';
import { upload } from '../middleware/imageUtils';

const userRoutes = (app) => {

    //-------------------------------- User Authentication --------------------------------

    app.route('/user/register')
        .post(upload.single('avatar'), createUser);
    app.route('/user/login')
        .post(login);
    app.route('/user/logout')
        .get(isAuth, logout);

    //-------------------------------- Manage and View Users --------------------------------

    app.route('/user')
        .get(isAuth, readUser)
        .put(isAuth, upload.single('avatar'), updateUser)
        .delete(isAuth, deleteUser);
    app.route('/user/profile')
        .get(isAuth, getUserProfile);

    //-------------------------------- Manage User Passwords --------------------------------

    app.route('/user/password')
        .put(isAuth, resetPassword);
    app.route("/user/password/forgot")
        .post(forgotPassword);
    app.route("/user/password/otpCheck")
        .post(checkOtp);
    app.route("/user/password/changePassword")
        .post(changePassword);

    //-------------------------------- Manage User Addresses --------------------------------

    app.route('/user/address')
        .put(isAuth, addAddress);
    app.route('/user/address/:addressId')
        .put(isAuth, updateAddress)
        .delete(isAuth, deleteAddress);

    //-------------------------------- Manage Customer Cart --------------------------------

    app.route('/user/cart')
        .put(isAuth, isCustomer, addToCart);
    app.route('/user/cart/:productId')
        .put(isAuth, isCustomer, updateInCart)
        .delete(isAuth, isCustomer, deletefromCart);
}

export default userRoutes;