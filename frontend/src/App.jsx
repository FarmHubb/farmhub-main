import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios'
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, Outlet, Routes } from 'react-router-dom'
import Navbar from './components/Layout/Navbar/Navbar'
import Home from './components/Home';
import Footer from "./components/Layout/Footer"
import Crops from './components/Crops/Crops'
import DoseCalculator from './components/Services/doseCalculater'
import ProductList from './components/Shop/ProductList';
import ProductDetail from './components/Shop/ProductDetail';
import SignUp from './components/Layout/Navbar/SignUp';
import CropDetails from './components/Crops/CropDetails';
import ShopHome from './components/Shop/ShopHome';
import AboutUs from './components/About/AboutUs';
import TermsAndConditions from './components/About/TermsAndConditions';
import PrivacyPolicy from './components/About/PrivacyPolicy';
import User from './components/User Profile/User';
import Order from './components/User Profile/Orders/Order';
import CheckOutSteps from './components/Order/CheckOutSteps';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import OrderSuccess from './components/Order/OrderSuccess';
import Weather from './components/Services/weather';
import bufferToString from './bufferToString';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme({
    palette: {
        primary: {
            main: grey[50],
            contrastText: '#07412B',
        },
        secondary: {
            main: '#609966',
        },
        tertiary: {
            main: '#00635A',
            contrastText: '#fff',
        },
        homeBtn: {
            main: '#07412B',
            contrastText: '#fff',
        },
        cropHeading: {
            main: '#40513B',
        },
    },
});

export default function App() {

    // -------------------------------- User --------------------------------

    const [user, setUser] = useState(null);
    const [updateTrigger, setTrigger] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, { withCredentials: true })
            .then((response) => {
                let res = response.data
                if (res.avatar)
                    res.avatar.data = bufferToString(res.avatar);
                res.cart.forEach(product => {
                    product.product.images.forEach(image => {
                        image.data = bufferToString(image);
                    });
                });
                if (response) setUser(res)
                else setUser(null);
            })
            .catch((err) => console.log(err));
    }, [updateTrigger]);

    const [loginDialog, setLoginDialog] = useState(false);
    const [userTab, setUserTab] = useState(0);
    const [profSec, setProfSec] = useState(true);
    const [addressSec, setAddressSec] = useState('view');

    // -------------------------------- Cart --------------------------------

    async function updateInCart(productId, quantity) {
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/cart/${productId}`,
            { quantity: quantity },
            { withCredentials: true })
            .then((response) => {
                if (response) setTrigger(prevValue => !prevValue)
            })
            .catch((error) => console.log(error));
    }

    async function removeFromCart(productId) {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/cart/${productId}`, { withCredentials: true })
            .then((response) => {
                if (response) setTrigger(prevValue => !prevValue)
            })
            .catch((error) => console.log(error));
    }

    // -------------------------------- Snackbar --------------------------------

    const [snackbar, setSnackbar] = useState({
        content: '',
        severity: '',
        open: false,
        vertical: 'bottom',
        horizontal: 'right',
    });
    const { vertical, horizontal, open, content, severity } = snackbar;

    const openSnackbar = (content, severity) => {
        setSnackbar({ ...snackbar, open: true, content: content, severity: severity });
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // -------------------------------- Weather --------------------------------

    const [weatherDetails, setWeatherDetails] = useState("");

    const [place, setPlace] = useState(" ");

    let weather = {
        apiKey: "0bff6234f35d3b5aef48e0dd8d8d27b9",
        fetchWeather: function (city) {
            fetch(
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=metric&appid=" +
                this.apiKey
            )
                .then((response) => {
                    if (!response.ok) {
                        alert("No weather found.");
                        throw new Error("No weather found.");
                    }
                    return response.json();
                })
                .then((data) => {
                    this.displayWeather(data)
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        displayWeather: function (data) {
            const { name } = data;
            const { icon, description } = data.weather[0];
            const { temp, humidity } = data.main;
            const { speed } = data.wind;
            setWeatherDetails(() => ({
                city: name,
                temp: temp + "°C",
                icon: "https://openweathermap.org/img/wn/" + icon + ".png",
                description: description,
                humidity: humidity + "%",
                wind: speed + " km/h",
            }))
        },
        search: function () {
            this.fetchWeather(place);
        },
    };

    useEffect(() => {
        axios.get("https://ipapi.co/json")
            .then((response) => {
                setPlace(response.data.city)
                weather.fetchWeather(response.data.city);
            })
            .catch((error) => console.log(error));

    }, [])

    //-------------------------------- Translate --------------------------------

    const [marginTop, setMarginTop] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.documentElement.classList.contains('translated-ltr')) {
                setMarginTop('2.5rem');
            } else {
                setMarginTop(0);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path='/' element={
                    <>
                        <Navbar
                            marginTop={marginTop}
                            setTrigger={setTrigger}
                            user={user}
                            loginDialog={loginDialog}
                            setLoginDialog={setLoginDialog}
                            updateInCart={updateInCart}
                            removeFromCart={removeFromCart}
                            setUserTab={setUserTab}
                            weatherDetails={weatherDetails}
                            setWeatherDetails={setWeatherDetails}
                        />
                        <Outlet />
                        <Footer />
                    </>
                }>
                    <Route index element={<Home />} />
                    <Route path='crops' element={<Crops />} />
                    <Route path='crops/:season' element={<CropDetails />} />
                    <Route path='doseCalculator' element={<DoseCalculator />} />
                    <Route path='weather' element={<Weather
                        weatherDetails={weatherDetails}
                        setWeatherDetails={setWeatherDetails}
                        place={place}
                        setPlace={setPlace}
                        weather={weather}
                    />} />
                    <Route path='about-us' element={<AboutUs />} />
                    <Route path='termsAndConditions' element={<TermsAndConditions />} />
                    <Route path='privacyPolicy' element={<PrivacyPolicy />} />
                    <Route path='user' element={
                        <User
                            setTrigger={setTrigger}
                            user={user}
                            profSec={profSec}
                            setProfSec={setProfSec}
                            addressSec={addressSec}
                            setAddressSec={setAddressSec}
                            userTab={userTab}
                            setUserTab={setUserTab}
                            openSnackbar={openSnackbar}
                        />}
                    />
                    <Route path='order/:orderId' element={<Order />} />
                    <Route path='checkOut' element={<CheckOutSteps user={user} setTrigger={setTrigger} setUserTab={setUserTab} />} />
                    <Route path='orderSuccess' element={<OrderSuccess setUserTab={setUserTab} />} S />
                    <Route path='/shop'>
                        <Route index element={<ShopHome />} />
                        <Route path='products/category/:category' element={
                            <ProductList updateTrigger={updateTrigger} />}
                        />
                        <Route path='product/:id' element={
                            <ProductDetail
                                user={user}
                                updateTrigger={updateTrigger}
                                setTrigger={setTrigger}
                                setLoginDialog={setLoginDialog}
                                updateInCart={updateInCart}
                            />}
                        />
                    </Route>
                </Route>
                <Route path='/signup' element={
                    <SignUp setTrigger={setTrigger} openSnackbar={openSnackbar} />}
                />
            </Routes>
            <Snackbar
                anchorOrigin={{
                    vertical,
                    horizontal
                }}
                open={open}
                autoHideDuration={3000}
                onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {content}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
