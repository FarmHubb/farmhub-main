import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import bufferToString from '../../bufferToString';
import Filters from './Filters';

export default function ProductList({ updateTrigger }) {
    
    const [products, setProducts] = useState(null);
    const [brands, setBrands] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams({ minPrice: '', maxPrice: '', brands: '' });
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');
    const term = searchParams.get('term');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = Number(searchParams.get('minRating'));
    const checkedBrands = searchParams.get('brands');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/products`, { params: searchParams })
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
    }, [searchParams])

    function setSort(sortCriteria) {
        setSearchParams(prev => {
            sortCriteria ? prev.set('sort', sortCriteria) : prev.delete('sort');
            return prev;
        });
    }

    function setPriceRange(e) {
        setSearchParams(prev => {
            prev.set(e.target.name, e.target.value);
            return prev;
        }, { replace: true });
    }

    function checkPriceRange(e) {
        if ((e.target.name === 'minPrice' && maxPrice) || (e.target.name === 'maxPrice' && minPrice))
            if (minPrice > maxPrice) {
                setSearchParams(prev => {
                    prev.set([e.target.name], '');
                    return prev;
                }, { replace: true });
            }
    }

    const setMinRating = (e, rating) => {
        setSearchParams(prev => {
            e.target.checked 
            ? prev.set('minRating', rating)
            : prev.delete('minRating');
            return prev;
        });
    };

    const setCheckedBrands = (e, brand) => {
        setSearchParams(prev => {
            const brands = prev.get('brands') ? prev.get('brands').split(',') : [];
            if (e.target.checked) {
                brands.push(brand);
            } else {
                const index = brands.indexOf(brand);
                if (index > -1) {
                    brands.splice(index, 1);
                }
            }
            prev.set('brands', brands.join(','));
            return prev;
        }, { replace: true });
    };

    const filterProps = {
        minPrice: minPrice,
        maxPrice: maxPrice,
        setPriceRange: setPriceRange,
        checkPriceRange: checkPriceRange,
        minRating: minRating,
        setMinRating: setMinRating,
        brands: brands,
        checkedBrands: checkedBrands,
        setCheckedBrands: setCheckedBrands
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
                                        {category ? category : `Results for "${term}"`}
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
                                            onChange={(e) => setSort(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={null}>Relavance</MenuItem>
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
                        {products.map(product => (
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
