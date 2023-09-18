import multer from 'multer';
import {
    addAddress,
    addToCart,
    changePassword,
    checkOtp,
    createUser,
    currentUserDetails,
    deleteAddress,
    deletefromCart,
    deleteUser,
    displayUser,
    forgotPassword,
    login,
    logout,
    resetPassword,
    updateAddress,
    updateInCart,
    updateUser,
    userList
} from '../controllers/userController';

const userRoutes = (app) => {
    var upload = multer({ dest: './uploads/'});

    //-------------------------------- User Authentication --------------------------------

    app.route('/user/register')
        .post(upload.single('avatar'), createUser);
    app.route('/user/login')
        .post(login);
    app.route('/user/logout')
        .get(logout);

    //-------------------------------- Manage and View Users --------------------------------

    app.route('/user')
        .get(currentUserDetails);
    app.route('/user/:userId/password')
        .put(resetPassword);
    app.route('/user/:userId')
        .get(displayUser)
        .delete(deleteUser);
    app.route('/user/:userId')
        .put(upload.single('avatar'), updateUser);
    app.route("/password/forgot")
        .post(forgotPassword);
    app.route("/password/otpCheck")
        .post(checkOtp);
    app.route("/password/changePassword")
        .post(changePassword);
    app.route('/users')
        .get(userList);

    //-------------------------------- Manage User Addresses --------------------------------

    app.route('/user/:userId/address')
        .put(addAddress);
    app.route('/user/:userId/address/:addressId')
        .put(updateAddress)
        .delete(deleteAddress);

    //-------------------------------- Manage User Cart --------------------------------

    app.route('/user/:userId/cart')
        .put(addToCart);
    app.route('/user/:userId/cart/:productId')
        .put(updateInCart)
        .delete(deletefromCart);



}



export default userRoutes;