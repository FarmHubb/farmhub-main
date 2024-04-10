import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider } from "@mui/material/styles";
import { forwardRef, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { theme } from "./Theme";
import AboutUs from "./components/About/AboutUs";
import PrivacyPolicy from "./components/About/PrivacyPolicy";
import TermsAndConditions from "./components/About/TermsAndConditions";
import CropDetails from "./components/Crops/CropDetails";
import Crops from "./components/Crops/Crops";
import Home from "./components/Home";
import Footer from "./components/Layout/Footer";
import Navbar from "./components/Layout/Navbar/Navbar";
import SignUp from "./components/Layout/Navbar/SignUp";
import CheckOutSteps from "./components/Order/CheckOutSteps";
import OrderSuccess from "./components/Order/OrderSuccess";
import CropHome from "./components/Services/Home";
import Crop from "./components/Services/crop";
import Disease from "./components/Services/disease";
import DoseCalculator from "./components/Services/doseCalculater";
import Fertilizer from "./components/Services/fertilizer";
import Weather from "./components/Services/weather";
import ProductDetail from "./components/Shop/ProductDetail";
import ProductList from "./components/Shop/ProductList";
import ShopHome from "./components/Shop/ShopHome";
import Order from "./components/User Profile/Orders/Order";
import User from "./components/User Profile/User";
import { LoginDialogContext } from "./contexts/LoginDialogContext";
import { SetTriggerContext } from "./contexts/SetTriggerContext";
import { SnackbarDispatchContext } from "./contexts/SnackbarContext";
import { UserAddressContext, UserAvatarContext, UserCartContext, UserProfileContext } from './contexts/UserContexts';
import { SetUserTabContext } from "./contexts/UserTabContext";
import { useAuthStatus } from "./hooks/useAuthStatus";
import { CLOSE_SNACKBAR, defaultSnackbar, useSnackbar } from "./hooks/useSnackbar";
import { useUser } from "./hooks/useUser";
import PrivateRoutes from './utils/PrivateRoutes';


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function App() {

    // -------------------------------- User --------------------------------

    const {
        userProfile,
        userAvatar,
        userAddresses,
        userCart,
        updateTrigger,
        setTrigger
    } = useUser();

    const isAuth = useAuthStatus(updateTrigger);
    const [loginDialog, setLoginDialog] = useState(false);
    const [userTab, setUserTab] = useState(0);

    // -------------------------------- Snackbar --------------------------------

    const [snackbar, dispatchSnackbar] = useSnackbar(defaultSnackbar);
    const { content, severity, open, vertical, horizontal } = snackbar;

    // ----------------------------------------------------------------

    return (
        <ThemeProvider theme={theme}>
            <SnackbarDispatchContext.Provider value={dispatchSnackbar}>
                <SetTriggerContext.Provider value={setTrigger}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <LoginDialogContext.Provider value={{ loginDialog, setLoginDialog }}>
                                        <UserCartContext.Provider value={userCart}>
                                            <Navbar
                                                isAuth={isAuth}
                                                userProfile={userProfile}
                                                userAvatar={userAvatar}
                                                setUserTab={setUserTab}
                                            />
                                        </UserCartContext.Provider>
                                    </LoginDialogContext.Provider>
                                    <Outlet />
                                    <Footer />
                                </>
                            }
                        >
                            <Route index element={<Home setLoginDialog={setLoginDialog} />} />
                            <Route path="crops" element={<Crops />} />
                            <Route path="crops/:season" element={<CropDetails />} />
                            <Route path="doseCalculator" element={<DoseCalculator />} />
                            <Route path="weather" element={<Weather />} />
                            <Route path="predict" element={<CropHome />} />
                            <Route path="crop-prediction" element={<Crop />} />
                            <Route path="fertilizer-prediction" element={<Fertilizer />} />
                            <Route path="disease-detection" element={<Disease />} />
                            <Route path="about-us" element={<AboutUs />} />
                            <Route path="termsAndConditions" element={<TermsAndConditions />} />
                            <Route path="privacyPolicy" element={<PrivacyPolicy />} />

                            <Route element={<PrivateRoutes />}>
                                <Route
                                    path="user"
                                    element={
                                        <UserProfileContext.Provider value={userProfile}>
                                            <UserAddressContext.Provider value={userAddresses}>
                                                <UserAvatarContext.Provider value={userAvatar}>
                                                    <User
                                                        userTab={userTab}
                                                        setUserTab={setUserTab}
                                                    />
                                                </UserAvatarContext.Provider>
                                            </UserAddressContext.Provider>
                                        </UserProfileContext.Provider>
                                    }
                                />
                                <Route
                                    path="checkOut"
                                    element={
                                        <UserProfileContext.Provider value={userProfile}>
                                            <UserAddressContext.Provider value={userAddresses}>
                                                <UserCartContext.Provider value={userCart}>
                                                    <SetUserTabContext.Provider value={setUserTab}>
                                                        <CheckOutSteps />
                                                    </SetUserTabContext.Provider>
                                                </UserCartContext.Provider>
                                            </UserAddressContext.Provider>
                                        </UserProfileContext.Provider>
                                    }
                                />

                                <Route
                                    path="orderSuccess"
                                    element={<OrderSuccess setUserTab={setUserTab} />}
                                />
                                <Route path="order/:orderId" element={<Order />} />
                            </Route>

                            <Route path="shop">
                                <Route index element={<ShopHome />} />
                                <Route
                                    path="products"
                                    element={<ProductList />}
                                />
                                <Route
                                    path="product/:id"
                                    element={
                                        <ProductDetail
                                            isAuth={isAuth}
                                            userProfile={userProfile}
                                            userCart={userCart}
                                            updateTrigger={updateTrigger}
                                            setLoginDialog={setLoginDialog}
                                        />
                                    }
                                />
                            </Route>

                        </Route>

                        <Route path="/signup" element={<SignUp setTrigger={setTrigger} />} />

                    </Routes>

                </SetTriggerContext.Provider>
            </SnackbarDispatchContext.Provider>

            <Snackbar
                anchorOrigin={{
                    vertical,
                    horizontal,
                }}
                open={open}
                autoHideDuration={3000}
                onClose={() => dispatchSnackbar({ type: CLOSE_SNACKBAR })}
            >
                <Alert
                    onClose={() => dispatchSnackbar({ type: CLOSE_SNACKBAR })}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {content}
                </Alert>
            </Snackbar>

        </ThemeProvider>
    );
}
