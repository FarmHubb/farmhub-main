import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Card from '@mui/material/Card';

import {
    CardNumberElement,
    Elements,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

import { loadStripe } from '@stripe/stripe-js';



const Payments = ({ user, orderCharges, setTrigger, setActiveStep, shippingAddress }) => {

    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const paymentData = {
        amount: Math.round(orderCharges.totalPrice * 100),
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/payment/process`,
                paymentData,
                config
            );

            const client_secret = data.client_secret;
            // console.log(client_secret);

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingAddress.area,
                            city: shippingAddress.city,
                            state: shippingAddress.state,
                            postal_code: shippingAddress.pinCode,
                        },
                    },
                },
            });


            if (result.error) {

                console.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    let paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };

                    let orderDetails = {
                        paymentInfo: paymentInfo,
                        address: shippingAddress
                    }

                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/order/${user._id}`, orderDetails, { withCredentials: true })
                        .then(response => {
                            if (!response.data.errors) {
                                setTrigger(prevValue => !prevValue);
                                navigate('/orderSuccess');
                            }
                        })
                        .catch(error => console.log(error));

                } else {
                    console.error("There's some issue while processing payment ");
                }
            }
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    return (
        <Container component='form' onSubmit={(e) => submitHandler(e)} sx={{ mt: { xs: 6, sm: 8 } }}>
            <Typography variant="h4" mt={4} color="primary">Payment</Typography>

            <Card
                sx={{
                    marginTop: "1rem",
                    marginBottom: "3rem",
                    borderRadius: "1rem",
                    width: { xs: '100%', md: "50%" },
                    height: "100%"
                }}>

                <Box>
                    <Typography variant="h4" ml={4} mt={4} color="tertiary.main">Card Info</Typography>
                    <Box m={4} alignItems='center'>
                        <CreditCardIcon sx={{ marginBottom: "1rem" }} />
                        <CardNumberElement />

                    </Box>
                    <Box m={4} alignItems='center'>
                        <EventIcon sx={{ marginBottom: "1rem" }} />
                        <CardExpiryElement className="paymentInput" />
                    </Box>
                    <Box m={4} alignItems='center'>
                        <VpnKeyIcon sx={{ marginBottom: "1rem" }} />
                        <CardCvcElement className="paymentInput" />
                    </Box>
                </Box>

            </Card>

            <Button
                onClick={() => setActiveStep(1)}
                size='large'
                sx={{ textTransform: 'none', marginRight: "2rem" }}
                color='primary'
                variant='contained'
            >
                Back to Confirm Order
            </Button>

            <Button
                size='large'
                sx={{ textTransform: 'none', width: "10rem" }}
                color='tertiary'
                variant='contained'
                type='submit'
            >
                Pay - ₹${orderCharges && orderCharges.totalPrice}
            </Button>

        </Container>
    )
}


const stripePromise = loadStripe('pk_test_51MRGI5SIalemv8vHSWlBF6WuAF7MfxTP5KSQ6VrjvaDWq6gWTJTJ7qbhJs0xGmxXP7Cjs6eT5VvpGtauv3l4Hl4N00kLqBjRA3');


const Payment = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <Payments {...props} />
        </Elements>
    )
};

export default Payment









