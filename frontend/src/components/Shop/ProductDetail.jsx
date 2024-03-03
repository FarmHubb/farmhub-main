import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import bufferToString from '../../bufferToString';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Product({
    user,
    updateTrigger,
    setTrigger,
    setLoginDialog,
    updateInCart,
}) {

    const { id } = useParams()
    const [product, setProduct] = useState(null);
    const [productImage, setImage] = useState(null);
    const [prevId, setPrevId] = useState(null);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [currentUserReview, setCurrentUserReview] = useState(false);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/${id}`, { withCredentials: true })
            .then((response) => {
                if(!response.data.errors) {
                    let res = response.data;
                    res.images.forEach(image => {
                        image.data = bufferToString(image);
                    });
                    res.reviews.forEach(review => {
                        if(review.user.avatar)
                            review.user.avatar.data = bufferToString(review.user.avatar);
                    });
                    // console.log(res);
                    setProduct(res)
                    if (prevId !== id)
                        setImage(res.images[0]);
                    setPrevId(id);
                    if (res.reviews.length && user && res.reviews[0].user._id === user._id) {
                        setCurrentUserReview(true);
                        setRating(res.reviews[0].rating);
                    }
                }
            })
            .catch((err) => console.log(err));
    }, [id, prevId, updateTrigger, user])

    async function addToCart(productId) {
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/cart/${productId}`, { quantity: 1 }, { withCredentials: true })
            .then((response) => {
                if (response) setTrigger(prevValue => !prevValue)
            })
            .catch((error) => console.log(error));
    }

    const [reviewForm, setReviewForm] = useState(false);
    const reviewDescription = useRef(null);

    async function submitReview(e) {
        e.preventDefault();

        const reviewDetails = {
            rating: rating,
            description: reviewDescription.current.value,
        };

        axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/product/${id}/review`,
            reviewDetails,
            { withCredentials: true }
        )
            .then(() => { setTrigger(prevValue => !prevValue); setReviewForm(false); })
            .catch((error) => console.log(error));
    }

    async function updateReview(e) {
        e.preventDefault();

        const reviewDetails = {
            rating: rating,
            description: reviewDescription.current.value,
        };

        axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/product/${id}/review`,
            reviewDetails,
            { withCredentials: true }
        )
            .then(() => { setTrigger(prevValue => !prevValue); setReviewForm(false); })
            .catch((error) => console.log(error));
    }

    const [deleteDialog, setDeleteDialog] = useState(false);

    const OpenDeleteDialog = () => {
        setDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
    };

    async function deleteReview() {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/product/${id}/review`, { withCredentials: true })
            .then(() => setTrigger(prevValue => !prevValue))
            .catch((error) => console.log(error));
    }

    if (product) {
        return (
            <Container sx={{ mt: { xs: 6, sm: 8 } }}>
                <Grid container pt={5} spacing={5} columns={18}>
                    <Grid item display={{xs: 'none', md: 'block'}} md={2}>
                        <ImageList cols={1} sx={{ mt: 0 }} >
                            {product.images.map(image => (
                                <ImageListItem 
                                    component='img'
                                    key={image._id}
                                    sx={{
                                        width: '100%',
                                        height: '6rem !important',
                                        boxSizing: 'border-box',
                                        objectFit: 'contain',
                                        border: '0.1em solid',
                                        borderColor: image._id === productImage._id ? 'tertiary.main' : 'primary.main',
                                        borderRadius: '20%',
                                        mb: 1,
                                        p: 1
                                    }}
                                    src={image.data}
                                    alt={product.name}
                                    onClick={() => setImage(image)}>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>
                    <Grid item xs={18} md={8} display='flex' justifyContent='center'>
                        <Box 
                            component='img' 
                            src={productImage.data} 
                            alt={product.name} 
                            sx={{ height: '30rem', width: '100%', objectFit: 'contain' }}
                        />
                    </Grid>
                    <Grid item display={{ xs: 'block', md: 'none' }} xs={18}>
                        <Box style={{ width: '300px', overflowX: 'auto' }}>
                            <ImageList sx={{ mt: 0, display: 'flex' }}>
                                {product.images.map((image) => (
                                    <ImageListItem
                                        component="img"
                                        key={image._id}
                                        sx={{
                                            width: '100%',
                                            height: '6rem !important',
                                            boxSizing: 'border-box',
                                            objectFit: 'contain',
                                            border: '0.1em solid',
                                            borderColor:
                                                image._id === productImage._id ? 'tertiary.main' : 'primary.main',
                                            borderRadius: '20%',
                                            mb: 1,
                                            p: 1,
                                        }}
                                        src={image.data}
                                        alt={product.name}
                                        onClick={() => setImage(image)}
                                    ></ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </Grid>
                    <Grid item xs={18} md={8}>
                        <Typography variant='h4' fontWeight='500' color='primary.main'>{product.name}</Typography>
                        {product.avgRating ?
                            <Box display='flex' alignItems='center' mt={2}>
                                <Typography fontWeight='bold' variant='h6' mr={1}>
                                    {product.avgRating.toFixed(1)}
                                </Typography>
                                <Rating sx={{ mr: 1 }} value={product.avgRating} precision={0.1} readOnly size='small' />
                                <Typography>
                                    {product.reviews.length}
                                </Typography>
                            </Box>
                            : <Typography mt={2}>No ratings</Typography>
                        }
                        <Box display='flex' mt={2}>
                            <Typography fontWeight='bold' whiteSpace='pre-wrap'>Brand: </Typography>
                            <Typography>{product.brand}</Typography>
                        </Box>
                        <Typography mt={3} variant="h5" fontWeight='bold' color='primary'>
                            ₹{(product.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Typography>
                        <Stack spacing={2} mt={3} direction="row" alignItems='center'>
                            {user ?
                                user.cart.some(item => item.product._id === product._id) ?
                                    <>
                                        <IconButton
                                            color='primary'
                                            onClick={() => updateInCart(
                                                product._id,
                                                user.cart.find(item => item.product._id === product._id).quantity + 1)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                        <Typography variant='h6'>
                                            {user.cart.find(item => item.product._id === product._id).quantity}
                                        </Typography>
                                        <IconButton
                                            color='primary'
                                            onClick={() => updateInCart(
                                                product._id,
                                                user.cart.find(item => item.product._id === product._id).quantity - 1)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </>
                                    :
                                    <>
                                        <Button variant="contained" type='button' onClick={() => addToCart(product._id)}>
                                            Add to Cart
                                        </Button>
                                        {/* <Button variant="contained">
                                            Buy now
                                        </Button> */}
                                    </>
                                :
                                <>
                                    <Button variant="contained" type='button' onClick={() => setLoginDialog(true)}>
                                        Add to Cart
                                    </Button>
                                    {/* <Button variant="contained" onClick={() => setLoginDialog(true)}>
                                        Buy now
                                    </Button> */}
                                </>
                            }
                            {product.quantity === 0 ? <Typography>Out of Stock</Typography> : null}
                        </Stack>
                    </Grid>
                    <Grid item xs={18}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Description" sx={{ textTransform: 'none' }} {...a11yProps(0)} />
                                <Tab label="Reviews" sx={{ textTransform: 'none' }} {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{product.description}</Typography>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {user ?
                                reviewForm ?
                                    <Box
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                        onSubmit={!currentUserReview ? submitReview : updateReview}
                                        mb={5}
                                    >
                                        <Typography variant="h6">
                                            {currentUserReview ? 'Edit Review' : 'Write a Review for this product'}
                                        </Typography>
                                        <Typography mt={2} fontWeight='500' gutterBottom>Your Rating</Typography>
                                        <Rating
                                            name="simple-controlled"
                                            value={rating}
                                            onChange={(event, newValue) => {
                                                setRating(newValue);
                                            }}
                                        />
                                        <Typography mt={2} fontWeight='500'>Your Written Review</Typography>
                                        <TextField
                                            id="outlined-multiline-static"
                                            multiline
                                            rows={4}
                                            sx={{ display: 'block' }}
                                            fullWidth
                                            margin='normal'
                                            defaultValue={currentUserReview ?
                                                product.reviews[0].description : ''}
                                            placeholder="Write a review here..."
                                            inputRef={reviewDescription}
                                        />
                                        <Stack mt={3} direction='row' spacing={2}>
                                            <Button variant="contained" type='Submit'>Submit</Button>
                                            <Button variant="outlined" onClick={() => setReviewForm(false)}>Cancel</Button>
                                        </Stack>
                                    </Box>
                                    :
                                    currentUserReview ?
                                        <Box mb={5}>
                                            <Typography variant='h6'>Your Review</Typography>
                                            <Box display='flex' alignItems='center' mt={3}>
                                                <Avatar 
                                                    alt="user image" 
                                                    src={product.reviews[0].user.avatar && product.reviews[0].user.avatar.data}
                                                />
                                                <Box display='flex' flexDirection='column' ml={2}>
                                                    <Typography>{product.reviews[0].user.fullName}</Typography>
                                                    <Rating
                                                        name="read-only"
                                                        value={product.reviews[0].rating}
                                                        readOnly
                                                        size='small'
                                                    />
                                                </Box>
                                            </Box>
                                            <Typography mt={1} gutterBottom>
                                                {product.reviews[0].description}
                                            </Typography>
                                            <Stack direction='row' spacing={2} mt={3}>
                                                <Button variant='contained' onClick={() => setReviewForm(true)}>
                                                    Edit your review
                                                </Button>
                                                <Button variant="outlined" onClick={OpenDeleteDialog}>
                                                    Delete
                                                </Button>
                                            </Stack>
                                            <Dialog
                                                open={deleteDialog}
                                                onClose={closeDeleteDialog}
                                            >
                                                <DialogTitle>
                                                    Are you sure you want to delete your review?
                                                </DialogTitle>
                                                <DialogActions>
                                                    <Button color='tertiary' onClick={() => { closeDeleteDialog(); deleteReview(); }} autoFocus>
                                                        Yes
                                                    </Button>
                                                    <Button color='tertiary' onClick={closeDeleteDialog}>No</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Box>
                                        :
                                        <Button
                                            sx={{ mb: 4, textTransform: 'none' }}
                                            variant='outlined'
                                            onClick={() => setReviewForm(true)}
                                        >
                                            Write your own review
                                        </Button>
                                : null}
                            {(currentUserReview ? product.reviews.slice(1) : product.reviews).map(review => (
                                <Box mb={4} key={review.user._id}>
                                    <Box display='flex' alignItems='center'>
                                        <Avatar alt="user image" src={review.user.avatar && review.user.avatar.data} />
                                        <Box
                                            display='flex'
                                            flexDirection='column'
                                            ml={2}
                                        >
                                            <Typography>{review.user.fullName}</Typography>
                                            <Rating name="read-only" value={review.rating} readOnly size='small' />
                                        </Box>
                                    </Box>
                                    <Typography mt={1}>{review.description}</Typography>
                                </Box>
                            ))}
                        </TabPanel>
                    </Grid>
                </Grid>
            </Container>
        )
    }

    return null;
}
