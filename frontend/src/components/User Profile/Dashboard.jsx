import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

import { Doughnut, Line } from "react-chartjs-2";
import axios from 'axios';
import { Box } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const Dashboard = () => {

    const [products, setProducts] = useState(null);
    const [orders, setOrders] = useState(null);
    const [users, setUsers] = useState(null);
    const [outOfStock, setOutOfStock] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // axios.get(`${process.env.REACT_APP_BACKEND_URL}/products`)
        //     .then((response) => {
        //         setProducts(response.data);
        //         response.data.forEach((item) => {
        //             if (item.quantity === 0) {
        //                 setOutOfStock(value => value + 1);
        //             }
        //         })
        //     })
        //     .catch((err) => console.log(err));

        // axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`)
        //     .then((response) => {
        //         setOrders(response.data);
        //         setTotalPrice(0);
        //         response.data.forEach((item) => {
        //             setTotalPrice((value) => value + item.total);
        //         });
        //     })
        //     .catch((err) => console.log(err));

        // axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`)
        //     .then((response) => {
        //         setUsers(response.data);
        //     })
        //     .catch((err) => console.log(err));

    }, []);







    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, totalPrice],
            },
        ],
    };


    const doughnutState = {
        labels: ["Out of Stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, 10],
            },
        ],
    };
    if (products && orders && users) {
        return (
            <Box sx={{
                width: "100vw",
                maxWidth: "100%",
                // display: 'grid',
                // gridTemplateColumns: "1fr 5fr",
            }}>

                <Box className="dashboardContainer" sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.13)",
                    padding: "3rem 0",
                    // width: "100%",
                    backgroundColor: "homeBtn.main"
                }}>
                    <Typography component="h1" color="tertiary" sx={{
                        fontSize: "2rem",
                        color: "primary.main",
                        fontWeight: "300",
                        fontFamily: "Roboto",
                        textAlign: 'center',
                        width: '50%',
                        padding: "1.5rem",
                        margin: "auto"
                    }}>
                        Dashboard
                    </Typography>
                    <Box className="dashboardSummary" backgroundColor="tertiary.main" m='2rem 0'>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center', backgroundColor: "tertiary.main"
                        }}>
                            <Typography sx={{
                                color: 'primary.main',
                                fontSize: "2rem",
                                fontWeight: "300",
                                fontFamily: "Roboto",
                                textAlign: 'center',
                                padding: '1.5rem',
                                width: "100%",
                                border: "1px solid",
                                margin: "0rem 2rem"
                            }}>
                                Total Amount <br /> ₹ {totalPrice}
                            </Typography>
                        </Box>
                        <Box display='flex' justifyContent='center' className="dashboardSummaryBox2" >
                            <Link to="" underline="none" sx={{
                                fontSize: "2rem",
                                textAlign: "center",
                                padding: "1.5rem",
                                width: "10vmax",
                                height: "10vmax",
                                margin: "2rem",
                                border: "1px solid",
                                borderRadius: "100%",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                backgroundColor: "primary.main",
                                color: "tertiary.main",
                            }}>
                                <Typography sx={{
                                    color: 'tertiary.main',
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    fontFamily: "Roboto",
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    width: "100%",
                                    margin: "0rem 2rem"
                                }}>Product</Typography>
                                <Typography sx={{
                                    color: 'tertiary.main',
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    fontFamily: "Roboto",
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    width: "100%",
                                    margin: "0rem 2rem"
                                }}>{products && products.length}</Typography>
                            </Link>
                            <Link to="" sx={{
                                fontSize: "2rem",
                                backgroundColor: "primary.main",
                                textAlign: "center",
                                textDecoration: "none",
                                padding: "1.5rem",
                                width: "10vmax",
                                height: "10vmax",
                                margin: "2rem",
                                border: "1px solid",
                                borderRadius: "100%",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                            }}>
                                <Typography sx={{
                                    color: 'tertiary.main',
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    fontFamily: "Roboto",
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    width: "100%",
                                    margin: "0rem 2rem"
                                }}>
                                    Orders
                                </Typography>
                                <Typography sx={{
                                    color: 'tertiary.main',
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    fontFamily: "Roboto",
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    width: "100%",
                                    margin: "0rem 2rem"
                                }}>
                                    {orders && orders.length}
                                </Typography>
                            </Link>

                            <Link underline="none" sx={{
                                fontSize: "2rem",
                                textAlign: "center",
                                backgroundColor: "primary.main",
                                padding: "1.5rem",
                                width: "10vmax",
                                height: "10vmax",
                                margin: "2rem",
                                border: "1px solid",
                                borderRadius: "100%",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                color: "tertiary.main",
                            }}>
                                <Typography sx={{
                                    color: 'tertiary.main',
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    fontFamily: "Roboto",
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    width: "100%",
                                    margin: "0rem 2rem"
                                }}>
                                    Users
                                </Typography>

                                <Typography sx={{
                                    color: 'tertiary.main',
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    fontFamily: "Roboto",
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                    width: "100%",
                                    margin: "0rem 2rem"
                                }}>
                                    {users && users.length}
                                </Typography>
                            </Link>
                        </Box>
                    </Box>



                    <Box className="lineChart" margin='auto'
                        sx={{
                            width: "80%",
                            height:"25em",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around"
                        }} mt="4rem" backgroundColor='primary.main'>
                        <Line data={lineState} />
                    </Box>

                    <Box className="doughnutChart" margin='auto' sx={{
                        width: "30vmax",
                        height:"25em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around"
                    }} backgroundColor='primary.main' mt="4rem">
                        <Doughnut data={doughnutState} />
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default Dashboard