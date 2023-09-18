import {
    createOrder,
    orderInfo,
    orderList,
    updateOrder,
    userOrder,
} from '../controllers/orderController';

const orderRoutes = (app) => {

    app.route('/order/:userId')
        .post(createOrder);
    
    app.route('/orders')
        .get(orderList);

    app.route('/orders/:userId')
        .get(userOrder);

    app.route('/order/:orderId')    
        .get(orderInfo)
        .put(updateOrder);

}

export default orderRoutes;