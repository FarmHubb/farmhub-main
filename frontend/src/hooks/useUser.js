import { useState, useEffect } from 'react';
import axios from 'axios';
import bufferToString from '../utils/bufferToString';

export function useUser() {
    const [user, setUser] = useState(null);
    const [updateTrigger, setTrigger] = useState(false);

    const { _id, name, email, phoneNumber, avatar, cartItemsCount, cartSubTotal, cart, addresses } = user || {};
    const userProfile = {
        _id,
        name,
        email,
        phoneNumber,
        cartItemsCount,
    };
    const userAvatar = avatar;
    const userAddresses = addresses;
    const userCart = {
        cartItems: cart,
        cartItemsCount,
        cartSubTotal,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/user/checkAuthStatus`,
                    { withCredentials: true }
                );
                if (!response.data.status)
                    return setUser(null);
                response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/user`,
                    { withCredentials: true }
                );
                let res = response.data;
                if (res.avatar) res.avatar.data = bufferToString(res.avatar);
                res.cart.forEach((product) => {
                    product.product.images.forEach((image) => {
                        image.data = bufferToString(image);
                    });
                });
                if (response) setUser(res);
                else setUser(null);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [updateTrigger]);

    return {userProfile, userAvatar, userAddresses, userCart, updateTrigger, setTrigger};
}