import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useUser();
    const location = useLocation();

    if (loading) {
        // Or return null if you want the parent App loading state to handle it
        // But since App handles global loading, this might not be reached often if App blocks rendering
        return null;
    }

    if (!user.id) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Force onboarding for new users
    // Skip this check if we are already on the /onboarding page to avoid infinite loop
    if (!user.hasOnboarded && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};

export default ProtectedRoute;
