import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Link as RouterLink } from 'react-router-dom';
import bufferToString from './../../bufferToString';

const banner = [
    'Images/ad1.jpg',
    'Images/ad2.jpg',
]

export default function ShopHome() {

    const [topProducts, setTopProducts] = useState(Array.from(new Array(8)));

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/top`)
            .then((response) => {
                let res = response.data;
                res.forEach(product => {
                    product.images.forEach((image) => {
                        image.data = bufferToString(image);
                    })
                })
                setTopProducts(res);
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <Box sx={{ mt: { xs: 6, sm: 8 } }}>
            <Carousel
                interval={3000}
                stopAutoPlayOnHover={false}
                animation='slide'
                height='40vw'
                indicatorContainerProps={{
                    style: {
                        display: 'none'
                    }

                }}
            >
                {banner.map(item => (
                    <Box component='img' sx={{ width: '100%', height: '100%', objectFit: 'cover' }} src={item} />
                ))}
            </Carousel>

            {/* Top Products */}

            <Container sx={{ mt: { xs: 6, sm: 8 } }}>
                <Typography
                    variant='h3'
                    fontWeight='500'
                    display="flex"
                    alignItems='center'
                    justifyContent='center'
                    mb="2rem"
                    fontFamily="Roboto"
                    color="cropHeading.main"
                    gutterBottom>
                    Top Products
                </Typography>
                <Grid container rowSpacing={3} columnSpacing={3}>
                    {topProducts.map((product, index) => (
                        <Grid item xs={12} sm={6} md={3} key={product ? product._id : index}>
                            <Link component={RouterLink} to={product && `/shop/product/${product._id}`} underline='none'>
                                <Card elevation={2} sx={{ height: "100%" }}>
                                    <Box sx={{ height: '20rem' }}>
                                        {product ?
                                            <CardMedia
                                                sx={{ p: 2, boxSizing: 'border-box', objectFit: 'contain' }}
                                                component="img"
                                                height='100%'
                                                image={product.images[0].data}
                                                alt={product.name}
                                            /> :
                                            <Skeleton variant="rectangular" height='100%' />
                                        }
                                    </Box>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product ? product.name : <Skeleton />}
                                        </Typography>
                                        <Box height='1.4em'>
                                            {product ?
                                                (product.avgRating ?
                                                    <Rating name="read-only"
                                                        value={product.avgRating}
                                                        readOnly
                                                        size='small'
                                                    />
                                                    :
                                                    <Typography variant="body2" color="text.secondary">
                                                        No ratings
                                                    </Typography>
                                                ) : <Skeleton width='40%' />}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {product ?
                                                ('₹' + (product.price).toLocaleString(undefined, { maximumFractionDigits: 2 }))
                                                : <Skeleton width='40%' />}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}
