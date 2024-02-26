import multer from 'multer';
import {
    addAddress,
    addToCart,
    changePassword,
    checkOtp,
    createUser,
    readUser,
    deleteAddress,
    deletefromCart,
    deleteUser,
    forgotPassword,
    isAuth,
    login,
    logout,
    resetPassword,
    updateAddress,
    updateInCart,
    updateUser,
} from '../controllers/userController';

var upload = multer({ dest: './uploads/' });

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
        .get(isAuth, readUser);
    app.route('/user/:userId')
        .delete(isAuth, deleteUser);
    app.route('/user/:userId')
        .put(isAuth, upload.single('avatar'), updateUser);

    //-------------------------------- Manage User Passwords --------------------------------

    app.route('/user/:userId/password')
        .put(isAuth, resetPassword);
    app.route("/password/forgot")
        .post(forgotPassword);
    app.route("/password/otpCheck")
        .post(checkOtp);
    app.route("/password/changePassword")
        .post(changePassword);

    //-------------------------------- Manage User Addresses --------------------------------

    app.route('/user/:userId/address')
        .put(isAuth, addAddress);
    app.route('/user/:userId/address/:addressId')
        .put(isAuth, updateAddress)
        .delete(isAuth, deleteAddress);

    //-------------------------------- Manage User Cart --------------------------------

    app.route('/user/:userId/cart')
        .put(isAuth, addToCart);
    app.route('/user/:userId/cart/:productId')
        .put(isAuth, updateInCart)
        .delete(isAuth, deletefromCart);
}

export default userRoutes;