import {
    createOrders,
    getOrder,
    updateOrderStatus,
    getAllUserOrders,
    updateOrderStatus,
} from '../controllers/orderController';

const orderRoutes = (app) => {

    app.route('/order/:userId')
        .post(createOrders);

    app.route('/orders/:userId')
        .get(getAllUserOrders);

    app.route('/order/:orderId')    
        .get(getOrder)
        .put(updateOrderStatus);

}

export default orderRoutes;