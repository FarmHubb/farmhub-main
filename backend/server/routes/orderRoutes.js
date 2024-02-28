import {
    createOrders,
    getOrdersByCustomer,
    getOrder,
    updateOrderStatus,
    getOrdersByProduct
} from '../controllers/orderController';
import { isAuth, isCustomer, isSeller } from './../controllers/userController';

const orderRoutes = (app) => {

    app.route('/order')
        .post(isAuth, isCustomer, createOrders);

    app.route('/orders')
        .get(isAuth, isCustomer, getOrdersByCustomer);

    app.route('/orders/product/:productId')
        .get(isAuth, isSeller, getOrdersByProduct);

    app.route('/order/:orderId')    
        .get(isAuth, getOrder)
        .put(isAuth, isSeller, updateOrderStatus);

}

export default orderRoutes;