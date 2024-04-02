import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to process the payment
export const processPayment = async (req, res, next) => {
	try {
		// Create a payment intent using the Stripe API
		const myPayment = await stripe.paymentIntents.create({
			amount: req.body.amount, // Amount to be charged
			currency: "inr", // Currency code (Indian Rupees in this case)
			metadata: {
				company: "Farmhub", // Additional metadata for the payment
			},
		});

		// Return the client secret and success status as response
		res.status(201).json({ success: true, client_secret: myPayment.client_secret });
	} catch (error) {
		// If an error occurs, send the error message as response
		res.status(500).send(error.message);
	}
};