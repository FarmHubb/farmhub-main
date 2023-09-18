import {
    processPayment,
    sendStripeApiKey,
} from "../controllers/paymentController";

const paymentRoutes = (app) => {
    app.route("/payment/process").post(processPayment);

    app.route("/stripeapikey").get(sendStripeApiKey);
}

module.exports = paymentRoutes;