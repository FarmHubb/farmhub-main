import {
    processPayment,
} from "../controllers/paymentController";
import { isAuth } from "../controllers/userController";

const paymentRoutes = (app) => {
    app.route("/payment/process").post(isAuth, processPayment);
}

export default paymentRoutes;