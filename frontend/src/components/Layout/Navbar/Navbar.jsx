import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import SignIn from './SignIn'
import Cart from './Cart';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const NavButton = styled(Button)(({ theme }) => ({
    my: 2,
    fontWeight: 'bold',
    minWidth: 0,
    color: theme.palette.tertiary.main,
    display: 'block',
    position: 'relative',
    '&:hover::after': {
        content: "''",
        position: 'absolute',
        bottom: '4px',
        left: '50%',
        transform: 'translateX(-50%)', 
        backgroundColor: theme.palette.tertiary.main,
        width: '0', 
        height: '2px',
        animation: 'hoverLine 550ms forwards',
    },
    '@keyframes hoverLine': {
        '0%': {
            width: '0', 
            left: '50%',
            transform: 'translateX(-50%)',
        },
        '100%': {
            width: '100%',
            left: '0', 
            transform: 'translateX(0)', 
    },
},
}));

const scrollToTop = () => {
    window.scrollTo(0, 0);
}

const shopPages = [
    {
        name: 'Fertilizers',
        link: '/shop/products/category/Fertilizers'
    },
    {
        name: 'Pesticides',
        link: '/shop/products/category/Pesticides'
    },
    {
        name: 'Crop-Tonics',
        link: '/shop/products/category/Crop-Tonics'
    },
    {
        name: 'Seeds',
        link: '/shop/products/category/Seeds'
    },
    {
        name: 'Traps',
        link: '/shop/products/category/Traps'
    },
];

function NavBar({
    setTrigger,
    user,
    loginDialog,
    setLoginDialog,
    updateInCart,
    removeFromCart,
    setUserTab,
    weatherDetails,
    marginTop,
}) {

    // --------------------------------- Dropdowns (Desktop View) ---------------------------------

    const [anchorElNav, setAnchorElNav] = useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
        setServiceCollapse(false);
        setCategoriesCollapse(false);
    };

    const [anchorElUser, setAnchorElUser] = useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [anchorElServices, setAnchorElServices] = useState(null);
    const openServices = Boolean(anchorElServices);
    const handleOpenServicesMenu = (event) => {
        setAnchorElServices(event.currentTarget);
    };
    const handleCloseServiceMenu = () => {
        setAnchorElServices(null);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // ------------------------------- Collapses (Mobile view) --------------------------------

    const [serviceCollapse, setServiceCollapse] = useState(false);
    const [categoriesCollapse, setCategoriesCollapse] = useState(false);

    // --------------------------------- Sign-in and Sign-out ---------------------------------

    const [status, setStatus] = useState('signIn');
    const [signInStatus, setSignInStatus] = useState('typing');

    function signOut() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, { withCredentials: true })
            .then(() => setTrigger(prevValue => !prevValue))
            .catch((err) => console.log(err));
    }

    // ----------------------------------------------------------------------------------------

    const [cartDrawer, setCartDrawer] = useState(false);

    return (
        <AppBar position="fixed"
            sx={{
                mt: marginTop
            }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* -------------------------------- Mobile View -------------------------------- */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon fontSize='inherit' />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                            PaperProps={{
                                style: {
                                    width: '15em',
                                },
                            }}
                            disableScrollLock={true}
                        >
                            <MenuItem component={Link} to='/crops' onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Crops</Typography>
                            </MenuItem>

                            <MenuItem onClick={() => setServiceCollapse(!serviceCollapse)}>
                                <Typography textAlign="center" mr='auto'>Services</Typography>
                                {serviceCollapse ? <ExpandLess /> : <ExpandMore />}
                            </MenuItem>
                            <Collapse in={serviceCollapse} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
                                <MenuItem component={Link} to='/weather' onClick={handleCloseNavMenu}>Weather</MenuItem>
                                <MenuItem component={Link} to='/doseCalculator' onClick={handleCloseNavMenu}>Dose Caluculator</MenuItem>
                            </Collapse>

                            <MenuItem component={Link} to='/shop' onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Shop</Typography>
                            </MenuItem>

                            <MenuItem onClick={() => setCategoriesCollapse(!categoriesCollapse)}>
                                <Typography textAlign="center" mr='auto'>Categories</Typography>
                                {categoriesCollapse ? <ExpandLess /> : <ExpandMore />}
                            </MenuItem>
                            <Collapse in={categoriesCollapse} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
                                {shopPages.map((page) => (
                                    <MenuItem component={Link} to={page.link} key={page.name}>{page.name}</MenuItem>
                                ))}
                            </Collapse>

                            {!user &&
                                <MenuItem 
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        setLoginDialog(true);
                                        setStatus('signIn');
                                        setSignInStatus('typing');
                                    }}>
                                    <Typography textAlign="center">Sign In</Typography>
                                </MenuItem>
                            }
                        </Menu>
                    </Box>
                    <Box
                        component={Link}
                        to='/'
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            ml: 1
                        }}>
                        <Box
                            component='img'
                            src="/Images/main-logo.png"
                            alt='FarmHub Logo'
                            width='2.5rem'
                        />
                    </Box>
                    {/* -------------------------------- Desktop View -------------------------------- */}
                    <Box
                        sx={{
                            flex: '1 1 0',
                            width: 0,
                            display: { xs: 'none', md: 'flex' }
                        }}>
                        <Link to='/'>
                            <Box
                                component='img'
                                src="/Images/main-logo.png"
                                alt='FarmHub Logo'
                                width='3.5rem'
                            />
                        </Link>
                    </Box>
                    <Box
                        sx={{
                            flex: '2 1 0',
                            gap: '2px',
                            width: 0,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center'
                        }}>
                        <NavButton component={Link} onClick={scrollToTop} to='/'>
                            Home
                        </NavButton>

                        <NavButton component={Link} onClick={scrollToTop} to='/crops'>
                            Crops
                        </NavButton>

                        <NavButton
                            id="basic-button"
                            aria-controls={openServices ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openServices ? 'true' : undefined}
                            onClick={handleOpenServicesMenu}
                        >
                            Services
                        </NavButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorElServices}
                            open={openServices}
                            onClose={handleCloseServiceMenu}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            disableScrollLock={true}
                        >
                            <MenuItem component={Link} to='/weather' onClick={handleCloseServiceMenu}>Weather</MenuItem>
                            <MenuItem component={Link} to='/doseCalculator' onClick={handleCloseServiceMenu}>Dose Caluculator</MenuItem>
                        </Menu>

                        <NavButton component={Link} onClick={scrollToTop} to='/shop'>
                            Shop
                        </NavButton>

                        <NavButton
                            id="categories-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            Categories
                        </NavButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'categories-button',
                            }}
                            disableScrollLock={true}

                        >
                            {shopPages.map((page) => (
                                <MenuItem component={Link} to={page.link} key={page.name} onClick={handleClose}>
                                    {page.name}
                                </MenuItem>
                            ))}
                        </Menu>

                        {!user &&
                            <NavButton 
                                onClick={() => { 
                                    setLoginDialog(true); 
                                    setStatus('signIn'); 
                                    setSignInStatus('typing');
                                }}>
                                Sign In
                            </NavButton>
                        }

                    </Box>
                    {/* -------------------------------- Universal View -------------------------------- */}
                    <Box
                        sx={{
                            display: 'flex',
                            flex: '1 1 0',
                            width: 0,
                            justifyContent: 'flex-end',
                        }}>
                        {/* <IconButton size='large'>
                            <SearchIcon color="tertiary" fontSize='inherit' />
                        </IconButton> */}
                        {weatherDetails &&
                            <Box display='flex' alignItems='center' justifyContent='center' sx={{ pr: { xs: 0, md: 2 } }}>

                                <img src={weatherDetails.icon} alt="" style={{
                                    width: '30%'
                                }} />
                                <Box display='flex' flexDirection='column ' >
                                    <Typography variant="body2" color="tertiary" fontFamily="Roboto" fontWeight='bold'>
                                        {weatherDetails.temp}
                                    </Typography>
                                    <Typography variant="body2" color="tertiary" fontFamily="Roboto" fontWeight='bold' >
                                        {weatherDetails.description}
                                    </Typography>
                                </Box>
                            </Box>
                        }
                        {user &&
                            <>
                                <IconButton onClick={() => setCartDrawer(true)} size='large'>
                                    <Badge badgeContent={user.cartItems} color="secondary">
                                        <ShoppingCartIcon color="tertiary" fontSize='inherit' />
                                    </Badge>
                                </IconButton>
                                <Cart
                                    user={user}
                                    cartDrawer={cartDrawer}
                                    setCartDrawer={setCartDrawer}
                                    updateInCart={updateInCart}
                                    removeFromCart={removeFromCart}
                                />
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mx: 1 }}>
                                        <Avatar alt="Remy Sharp" src={user.avatar && user.avatar.data} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    disableScrollLock={true}
                                >
                                    <MenuItem component={Link} to='/user' onClick={() => setUserTab(0)} key="Profile">
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem component={Link} to='/user' onClick={() => setUserTab(2)} key="Orders">
                                        <Typography textAlign="center">Orders</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { signOut(); handleCloseUserMenu() }}>
                                        <Typography textAlign="center">Sign Out</Typography>
                                    </MenuItem>
                                    {user.role === 'admin' &&
                                        <MenuItem component={Link} to='/user' onClick={() => setUserTab(3)} key="Dashboard">
                                            <Typography textAlign="center">Dashboard</Typography>
                                        </MenuItem>
                                    }
                                </Menu>
                            </>
                        }
                    </Box>
                </Toolbar>
            </Container>
            <SignIn 
                open={loginDialog} 
                setOpen={setLoginDialog} 
                status={status} 
                setStatus={setStatus} 
                signInStatus={signInStatus} 
                setSignInStatus={setSignInStatus} 
                setTrigger={setTrigger}
            />
        </AppBar>
    );
}
export default NavBar;