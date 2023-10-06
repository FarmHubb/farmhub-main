const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res, next) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Farmhub",
      },
    });

    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  } catch (error) {
    res.send(error.message);
  }
};

export const sendStripeApiKey = async (req, res, next) => {
  try {
    res.json({ stripeApiKey: process.env.STRIPE_API_KEY });
  } catch (error) {
    res.send(error.message);
  }
};
