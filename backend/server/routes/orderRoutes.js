import {
    createOrders,
    getAllUserOrders,
    getOrder,
    updateOrderStatus
} from '../controllers/orderController';
import { isAuth } from './../controllers/userController';

const orderRoutes = (app) => {

    app.route('/order')
        .post(isAuth, createOrders);

    app.route('/orders')
        .get(isAuth, getAllUserOrders);

    app.route('/order/:orderId')    
        .get(isAuth, getOrder)
        .put(isAuth, updateOrderStatus);

}

export default orderRoutes;