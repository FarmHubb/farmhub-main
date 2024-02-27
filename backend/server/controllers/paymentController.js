import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res, next) => {
	try {
		const myPayment = await stripe.paymentIntents.create({
			amount: req.body.amount,
			currency: "inr",
			metadata: {
				company: "Farmhub",
			},
		});

		res.status(201).json({ success: true, client_secret: myPayment.client_secret });
	} catch (error) {
		res.status(500).send(error.message);
	}
};