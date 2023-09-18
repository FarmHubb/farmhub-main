import { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import axios from 'axios';
import bufferToString from '../../bufferToString';
import Filters from './Filters'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';

export default function ProductList({ updateTrigger }) {

    const [products, setProducts] = useState(null);
    const [brands, setBrands] = useState(null);
    const { category } = useParams();
    const { search } = useParams();
    const [sort, setSort] = useState('none');

    useEffect(() => {
        category ?
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/category/${category}/${sort}`)
                .then((response) => {
                    let res = response.data;
                    res.products.forEach(product => {
                        product.images.forEach(image => {
                            image.data = bufferToString(image);
                        });
                    });
                    setProducts(res.products);
                    setBrands(res.brands);
                })
                .catch((err) => console.log(err))
            :
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/search/${search}/${sort}`)
                .then((response) => {
                    response.data.forEach(product => {
                        product.images.forEach(image => {
                            image.data = bufferToString(image);
                        });
                    });
                    setProducts(response.data);
                    setBrands(null);
                })
                .catch((err) => console.log(err))
    }, [updateTrigger, search, category, sort])

    const [priceRange, setPriceRange] = useState({
        min: '',
        max: ''
    })

    function changePriceRange(event) {
        setPriceRange({ ...priceRange, [event.target.name]: event.target.value })
    }

    function checkPriceRange(event) {
        if ((event.target.name === 'min' && priceRange.max) || (event.target.name === 'max' && priceRange.min))
            if (priceRange.min > priceRange.max)
                setPriceRange({ ...priceRange, [event.target.name]: '' })
    }

    const ratings = [5, 4, 3, 2, 1];

    const [checkedRating, setCheckedRating] = useState([]);

    const changeCheckedRating = (event, rating) => {
        event.target.checked ?
            setCheckedRating([...checkedRating, rating])
            :
            setCheckedRating(newCheckedRating => newCheckedRating.filter(selected => selected !== rating))
    };

    const [checkedBrands, setCheckedBrands] = useState([]);

    const changeCheckedBrands = (event, rating) => {
        event.target.checked ?
            setCheckedBrands([...checkedBrands, rating])
            :
            setCheckedBrands(newCheckedBrands => newCheckedBrands.filter(selected => selected !== rating))
    };

    const filterProps = {
        priceRange: priceRange,
        changePriceRange: changePriceRange,
        checkPriceRange: checkPriceRange,
        ratings: ratings,
        checkedRating: checkedRating,
        changeCheckedRating: changeCheckedRating,
        brands: brands,
        checkedBrands: checkedBrands,
        changeCheckedBrands: changeCheckedBrands
    }

    const [cartDrawer, setCartDrawer] = useState(false);

    if (products) {
        return (
            <Container sx={{ mt: { xs: 6, sm: 8 } }}>
                <Grid container pt={2} rowSpacing={3} columnSpacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ p: '0.8em !important' }}>
                                <Stack direction='row' alignItems='center' flexWrap='wrap'>
                                    <Typography mr='auto' variant='subtitle1' fontWeight='500'>
                                        {category ? category : `Results for "${search}"`}
                                    </Typography>
                                    <IconButton 
                                        onClick={() => setCartDrawer(true)} 
                                        size='large'
                                        sx={{
                                            display: { xs: 'block', md: 'none' }
                                        }}
                                    >
                                            <FilterListIcon color="tertiary" fontSize='inherit' />
                                    </IconButton>
                                    <Stack direction='row' alignItems='center'>
                                        <Typography variant='subtitle1' fontWeight='500'>Sort by</Typography>
                                        <Select
                                            sx={{ ml: 1, minWidth: '12em' }}
                                            size='small'
                                            color='primary'
                                            value={sort}
                                            onChange={(event) => setSort(event.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value='none'>Relavance</MenuItem>
                                            <MenuItem value='price'>Price Low to High</MenuItem>
                                            <MenuItem value='-price'>Price High to Low</MenuItem>
                                        </Select>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item display={{ xs: 'none', md: 'block' }} md={3}>
                        <Card elevation={2}>
                            <CardContent>
                                <Filters {...filterProps} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Drawer
                        anchor='left'
                        open={cartDrawer}
                        onClose={() => setCartDrawer(false)}
                    >
                        <Box p={2} width='15rem'>
                            <Filters {...filterProps} />
                        </Box>
                    </Drawer>
                    <Grid item xs={12} md={9} container rowSpacing={3} columnSpacing={3}>
                        {products.filter(product =>
                            (checkedRating.length === 0 || checkedRating.includes(Math.round(product.avgRating)))
                            && (checkedBrands.length === 0 || checkedBrands.includes(product.brand))
                            && (priceRange.min ? product.price > priceRange.min : true)
                            && (priceRange.max ? product.price < priceRange.max : true))
                            .map(product => (
                                <Grid item xs={12} sm={6} md={4} key={product._id}>
                                    <Link component={RouterLink} to={`/shop/product/${product._id}`} underline='none'>
                                        <Card elevation={2}>
                                            <CardMedia
                                                sx={{ p: 2, boxSizing: 'border-box', objectFit: 'contain' }}
                                                component="img"
                                                height='250rem'
                                                image={product.images[0].data}
                                                alt={product.name}
                                            />
                                            <CardContent>
                                                <Typography 
                                                    gutterBottom 
                                                    height='4rem' 
                                                    variant="h6" 
                                                    component="div"
                                                    sx={{
                                                        overflow: 'hidden',
                                                    }}
                                                >
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
                </Grid>
            </Container>
        )
    }
    return null;
}
