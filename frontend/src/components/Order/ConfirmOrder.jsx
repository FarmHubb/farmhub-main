import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserCartContext, UserProfileContext } from '../../contexts/UserContexts';
import { setActiveStepContext } from './setActiveStepContext';

export default function ConfirmOrder({ orderCharges, shippingAddress }) {

    const userProfile = useContext(UserProfileContext);
    const { cartItems } = useContext(UserCartContext);
    const setActiveStep = useContext(setActiveStepContext);
    if (!orderCharges) return null;

    return (
        <Container sx={{ mt: { xs: 6, sm: 8 } }}>
            <Typography variant="h4" mt={4} color="primary">Confirm Order</Typography>

            <Grid container spacing={5}>
                <Grid item xs={12} md={6} mr='auto'>
                    <Typography variant="h5" mt={4} mb={2} color="cropHeading.main">Shipping Info</Typography>
                    <Card
                        sx={{
                            padding: "1em",
                            backgroundColor: "primary.main",
                            width: "100%",
                            border: 1,
                            borderColor: "secondary.main",
                            boxSizing: "border-box"
                        }}>
                        <Box ml={3} mb={2} mt={2} display='flex' alignItems='center'>
                            <Typography color="tertiary.main" fontWeight='bold'>Name:</Typography>
                            <Typography ml={2}>{userProfile.name}</Typography>
                        </Box>
                        <Box ml={3} mb={2} display='flex' alignItems='center'>
                            <Typography color="tertiary.main" fontWeight='bold'>Phone:</Typography>
                            <Typography ml={2}>{userProfile.phoneNumber}</Typography>
                        </Box>
                        <Box ml={3} mb={2} display='flex' alignItems='flex-start'>
                            <Typography color="tertiary.main" fontWeight='bold'>Address:</Typography>
                            <Box display='flex' flexDirection='column' justifyContent='center' ml={2} >
                                <Typography>{shippingAddress.area}</Typography>
                                <Typography>{shippingAddress.city}</Typography>
                                <Typography>{shippingAddress.state}</Typography>
                                <Typography>{shippingAddress.country}</Typography>
                                <Typography>{shippingAddress.pincode}</Typography>
                            </Box>
                        </Box>
                    </Card>

                    <Typography variant="h5" mt={4} mb={2} color="cropHeading.main">Your Cart Items:</Typography>
                    {cartItems &&
                        cartItems.map((item) =>
                            <Link component={RouterLink} to={`/shop/product/${item.product._id}`} underline='none' key={item.product._id}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        marginBottom: '2rem',
                                        backgroundColor: "primary.main"
                                    }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 80, padding: 2 }}
                                        src={item.product.images[0].data} alt="Product"
                                    />

                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                                        <Typography variant="h4" color="tertiary.main" fontFamily="Roboto" fontSize="large" fontWeight='bold'>
                                            {item.product.name}
                                        </Typography>
                                        <Box display='flex'>
                                            <Typography variant='h6' mt={2} color="tertiary.main" fontFamily="Roboto" fontSize="small" >
                                                {item.quantity} X ₹{item.product.price} =
                                            </Typography>
                                            <Typography variant='h6' mt={2} color="primary.dark" fontFamily="Roboto" fontSize="small"  >
                                                ₹{item.product.price * item.quantity}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        )}
                </Grid>

                <Grid item xs={12} md={6} className="orderSummary">
                    <Typography variant="h5" mt={4} mb={2} color="cropHeading.main">Order Summery</Typography>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent sx={{
                            p: 3,
                            "&:last-child": {
                                pb: 3,
                            },
                        }}>
                            <Typography variant='h6' gutterBottom>Total Summary</Typography>
                            <Box display='flex'>
                                <Typography mr='auto'>Subtotal:</Typography>
                                <Typography color="tertiary.main" fontWeight='bold'>
                                    ₹{(orderCharges.subtotal).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                            <Box display='flex' mt={1}>
                                <Typography mr='auto'>Shipping Charges:</Typography>
                                <Typography color="tertiary.main" fontWeight='bold'>
                                    ₹{(orderCharges.shippingCharges).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                            <Box display='flex' mt={1}>
                                <Typography mr='auto'>GST(18%):</Typography>
                                <Typography color="tertiary.main" fontWeight='bold'>
                                    ₹{(orderCharges.tax).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                            <Divider sx={{ mt: 1 }} />
                            <Box display='flex' mt={1}>
                                <Typography mr='auto'>Total:</Typography>
                                <Typography color="tertiary.main" fontWeight='bold'>
                                    ₹{(orderCharges.totalPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            <Button onClick={() => setActiveStep(0)} size='large' sx={{ textTransform: 'none', marginRight: "2rem", mt: 2 }} color='primary' variant='contained'>
                Back to Shipping Details
            </Button>
            <Button onClick={() => setActiveStep(2)} size='large' sx={{ textTransform: 'none', mt: 2 }} color='tertiary' variant='contained'>
                Proceed for Payment
            </Button>
        </Container>
    )
}