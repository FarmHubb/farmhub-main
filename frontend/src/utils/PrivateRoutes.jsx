import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';

export default function PrivateRoutes() {

    const isAuth = useAuthStatus();
    const location = useLocation();

    if (isAuth === null)
        return null;
    else
        return (
            isAuth ? <Outlet /> : <Navigate to={`/?loginDialog=true&next=${location.pathname}`} />
        );
}