import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export function useAuthStatus(watch) {
    const [isAuth, setIsAuth] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                let response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/user/checkAuthStatus`,
                    { withCredentials: true }
                );
                return setIsAuth(response.data.status);
            } catch (err) {
                console.log(err);
            }
        };

        checkAuthStatus();
    }, [location.pathname, watch]);

    return isAuth;
}