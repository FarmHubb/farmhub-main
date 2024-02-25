import React, { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import bufferToString from '../../bufferToString';

export default function Order() {

    const { orderId } = useParams();

    const [order, setOrder] = useState();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/${orderId}`, { withCredentials: true })
            .then((response) => { setOrder(response.data) })
            .catch((err) => console.log(err));
    }, [orderId]);

    function statusColor(status) {
        if (status === "Not processed") return 'default';
        if (status === "Processing") return 'info';
        if (status === "Shipped") return 'info';
        if (status === "Delivered") return 'success';
        if (status === "Cancelled") return 'error';
    }

    if (order) {
        return (
            <Container sx={{ mt: { xs: 6, sm: 8 } }}>
                <Typography pt={3} variant="h4" fontWeight='bold' color="primary">
                    Order Details
                </Typography>
                <Grid container spacing={4} pt={3}>
                    <Grid item container xs={6} spacing={4}>
                        <Grid item xs={12}>
                            <Link component={RouterLink} to={`/shop/product/${order.product._id}`} underline='none'>
                                <Card sx={{ display: 'flex' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 80, padding: 2 }}
                                        src={bufferToString(order.product.images[0])}
                                        alt="Product"
                                    />
                                    <CardContent 
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <Typography variant="h6" color="tertiary.main" fontWeight='bold' gutterBottom>
                                            {order.product.name}
                                        </Typography>
                                        <Box display='flex'>
                                            <Typography variant='subtitle1' whiteSpace='pre-wrap' color="primary.dark">
                                                {order.quantity} x ₹{order.product.price} = </Typography>
                                            <Typography variant='subtitle1' color="tertiary.main" >
                                                ₹{order.product.price * order.quantity}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
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
                                            ₹{(order.subtotal).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                    <Box display='flex' mt={1}>
                                        <Typography mr='auto'>Shipping Charges:</Typography>
                                        <Typography color="tertiary.main" fontWeight='bold'>
                                            ₹{(order.shippingCharges).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                    <Box display='flex' mt={1}>
                                        <Typography mr='auto'>GST(18%):</Typography>
                                        <Typography color="tertiary.main" fontWeight='bold'>
                                            ₹{(order.tax).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mt: 1 }} />
                                    <Box display='flex' mt={1}>
                                        <Typography mr='auto'>Total:</Typography>
                                        <Typography color="tertiary.main" fontWeight='bold'>
                                            ₹{(order.total).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent sx={{
                                p: 3,
                                "&:last-child": {
                                    pb: 3,
                                },
                            }}>
                                <Box display='flex'>
                                    <Typography variant="h6" mr='auto'>Status</Typography>
                                    <Chip
                                        label={order.status}
                                        color={statusColor(order.status)}
                                    />
                                </Box>
                                <Typography variant="h6" mt={2} gutterBottom>Shipping Address</Typography>
                                <Typography maxHeight='3em' overflow='hidden' gutterBottom>
                                    {order.address.area}
                                </Typography>
                                <Typography>{order.address.city}</Typography>
                                <Typography>{order.address.state}</Typography>
                                <Typography>{order.address.country}</Typography>
                                <Typography>{order.address.pincode}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}
