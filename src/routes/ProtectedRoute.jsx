import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    // In a real app, you'd select this from Redux state:
    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // For now, checking localStorage for simplicity
    const isAuthenticated = !!localStorage.getItem('accessToken');
    console.log("isAuthenticated ", isAuthenticated)
    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
