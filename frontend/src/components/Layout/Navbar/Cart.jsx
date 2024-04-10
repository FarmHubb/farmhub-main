import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SetTriggerContext } from '../../../contexts/SetTriggerContext';
import { UserCartContext } from '../../../contexts/UserContexts';
import { removeFromCart, updateInCart } from '../../../utils/Cart';

export default function Cart({
    cartDrawer,
    setCartDrawer
}) {

    const { cartItems, cartItemsCount, cartSubTotal } = useContext(UserCartContext);
    const setTrigger = useContext(SetTriggerContext);

    if (!cartItems)
        return;

    return (
        <Drawer
            anchor='right'
            open={cartDrawer}
            onClose={() => setCartDrawer(false)}
        >
            <Box width='20em' display='flex' flexDirection='column' p={2}>
                <Stack
                    direction='row'
                    alignItems='center'
                    position='fixed'
                    backgroundColor='white'
                    width='20em'
                    zIndex={1}
                    height='4em'
                    top='0'
                >
                    <ShoppingCartIcon color='tertiary' fontSize='large' sx={{ pl: 0.5 }} />
                    <Typography variant='subtitle1' fontWeight='500' ml={2} mr='auto'>
                        {cartItemsCount} Items
                    </Typography>
                    <IconButton
                        sx={{ mr: -1 }}
                        color='primary'
                        onClick={() => setCartDrawer(false)}
                    >
                        <CloseIcon color='tertiary' fontSize='large' />
                    </IconButton>
                </Stack>
                <Box mt={6} mb={8}>
                    {cartItems.map(item => (
                        <Box display='flex' alignItems='center' key={item.product._id} mt={2}>
                            <Box>
                                <IconButton
                                    color='tertiary'
                                    onClick={() => updateInCart(item.product._id, item.quantity + 1, setTrigger)}
                                >
                                    <AddIcon />
                                </IconButton>
                                <Typography sx={{ textAlign: 'center', my: '0.1em' }} variant='h6'>
                                    {item.quantity}
                                </Typography>
                                <IconButton
                                    color='tertiary'
                                    onClick={() => updateInCart(item.product._id, item.quantity - 1, setTrigger)}
                                    disabled={item.quantity === 1 ? true : false}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </Box>
                            <Link
                                onClick={() => setCartDrawer(false)}
                                component={RouterLink}
                                color='text.primary'
                                to={`/shop/product/${item.product._id}`}
                                underline='none'
                                sx={{ width: '100%', display: 'flex' }}
                            >
                                <img
                                    style={{ width: '5em', padding: '0em 1em' }}
                                    src={item.product.images[0].data}
                                    alt={item.product.name}
                                />
                                <Box width='100%'>
                                    <Typography fontWeight='500' gutterBottom>{item.product.name}</Typography>
                                    <Typography variant='h6' color='primary'>
                                        ₹{(item.product.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                            </Link>
                            <IconButton
                                color='tertiary'
                                onClick={() => removeFromCart(item.product._id, setTrigger)}
                            >
                                <DeleteOutlinedIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
                <Box width='20em' bottom={0} py={2} position='fixed' backgroundColor='white'>
                    {cartItems.length !== 0 ?
                        <Button
                            component={RouterLink}
                            to="/checkOut"
                            onClick={() => setCartDrawer(false)}
                            size='large'
                            fullWidth sx={{ textTransform: 'none' }}
                            color='tertiary'
                            variant='contained'
                        >
                            Checkout Now (₹{(cartSubTotal).toLocaleString(undefined, { maximumFractionDigits: 2 })})
                        </Button>
                        :
                        <Button
                            component={RouterLink}
                            to="/shop"
                            onClick={() => setCartDrawer(false)}
                            size='large'
                            fullWidth sx={{ textTransform: 'none' }}
                            color='tertiary'
                            variant='contained'
                        >
                            Shop Now
                        </Button>}
                </Box>
            </Box>
        </Drawer>
    );
}