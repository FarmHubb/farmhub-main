import { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from 'luxon';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";

export default function Orders({ user }) {

    const [orders, setOrders] = useState(null);

    useEffect(() => {
        if (!user) return;
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`, { withCredentials: true })
            .then(response => setOrders(response.data))
            .catch(error => console.log(error));
    }, [user])

    function statusColor(status) {
        if (status === "Not processed") return 'default';
        if (status === "Processing") return 'info';
        if (status === "Shipped") return 'info';
        if (status === "Delivered") return 'success';
        if (status === "Cancelled") return 'error';
    }

    if (orders) {
        return (
            <>
                <Typography variant='h4' mr='auto' color='primary' fontWeight='bold' mb={{ xs: 2, md: 0 }}>
                    My Orders
                </Typography>
                <Grid container p={2} spacing={2} columns={20} display={{ xs: 'none', md: 'flex' }}>
                    <Grid item xs={6}>
                        <Typography color='tertiary' variant='h6'>Product Name</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography color='tertiary' variant='h6'>Status</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color='tertiary' variant='h6'>Order Placed</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color='tertiary' variant='h6'>Date Delivered</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography color='tertiary' variant='h6'>Total</Typography>
                    </Grid>
                </Grid>
                {orders.map(order => (
                    <Link
                        key={order._id}
                        component={RouterLink}
                        to={`/order/${order._id}`}
                        underline='none'
                    >
                        <Card
                            elevation={3}
                            sx={{ minWidth: 275, mb: 2, borderRadius: '0.5rem' }}
                            key={order._id}
                        >
                            <CardContent sx={{
                                p: 2,
                                "&:last-child": {
                                    pb: 2,
                                },
                            }}>
                                <Grid container alignItems='center' rowSpacing={{ xs: 1, md: 'none' }} columnSpacing={2} columns={20}>
                                    <Grid item xs={20} sm={10} md={6}>
                                        <Typography
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                            {order.product.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={20} sm={10} md={3}>
                                        <Chip
                                            label={order.status}
                                            color={statusColor(order.status)}
                                        />
                                    </Grid>
                                    <Grid item xs={20} sm={10} md={4}>
                                        <Typography>{DateTime.fromISO(order.createdAt).toFormat('d LLLL yyyy')}</Typography>
                                    </Grid>
                                    <Grid item xs={20} sm={10} md={4}>
                                        <Typography>
                                            {order.dateDelivered
                                                ? DateTime.fromISO(order.dateDelivered).toFormat('d LLLL yyyy')
                                                : '-'
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={20} sm={10} md={2}>
                                        <Typography>
                                            ₹{(order.total).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={20} sm={10} md={1} display='flex' justifyContent='flex-end'>
                                        <IconButton size='small'>
                                            <ArrowForwardIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </>
        )
    }
}
