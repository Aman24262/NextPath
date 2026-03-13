import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Parse the URL to get ?token=...&user=...
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const userString = queryParams.get('user');

        if (token && userString) {
            try {
                // Decode and parse the user JSON string
                const user = JSON.parse(decodeURIComponent(userString));
                
                // Use the existing AuthContext login function
                login(token, user);
                
                toast.success('Successfully logged in with Google!');
                navigate('/dashboard', { replace: true });
            } catch (error) {
                console.error("Failed to parse OAuth user data:", error);
                toast.error('Login failed due to corrupt data.');
                navigate('/login', { replace: true });
            }
        } else {
            // Missing data in the redirect URL
            toast.error('Google login failed. Please try again.');
            navigate('/login', { replace: true });
        }
    }, [location, login, navigate]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Authenticating with Google...</h2>
            <p className="text-slate-500 mt-2">Please wait while we log you in.</p>
        </div>
    );
};

export default OAuthCallback;
