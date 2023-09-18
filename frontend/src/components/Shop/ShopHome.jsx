import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '@mui/material';
import axios from 'axios';
import bufferToString from './../../bufferToString';

const banner = [
    'Images/ad1.jpg',
    'Images/ad2.jpg',
]

export default function ShopHome() {

    const [topProducts, setTopProducts] = useState(null);

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

    if (!topProducts) return null; 

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

            {/* top Product */}

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
                    {topProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product._id}>
                            <Link component={RouterLink} to={`/shop/product/${product._id}`} underline='none'>
                                <Card elevation={2} sx={{ height: "100%" }}>
                                    <CardMedia
                                        sx={{ p: 2, boxSizing: 'border-box', objectFit: 'contain' }}
                                        component="img"
                                        height='250rem'
                                        image={product.images[0].data}
                                        alt={product.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Box height='1.4em'>
                                            {product.avgRating ?
                                                <Rating name="read-only"
                                                    value={product.avgRating}
                                                    readOnly
                                                    size='small'
                                                />
                                                :
                                                <Typography variant="body2" color="text.secondary">
                                                    No ratings
                                                </Typography>
                                            }
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            ₹{(product.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
