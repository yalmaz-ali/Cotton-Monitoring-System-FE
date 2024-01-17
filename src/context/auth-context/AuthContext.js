import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    const login = (jwtToken, expiration) => {
        // Implement your login logic here
        setAuthenticated(true);

        Cookies.set('jwt', jwtToken,
            {
                expires: expiration
            });
    };

    const logout = () => {
        // Implement your logout logic here
        setAuthenticated(false);
        Cookies.remove('jwt'); // Clear JWT token cookie
    };

    return <AuthContext.Provider value={{ authenticated, login, logout }}>{children}</AuthContext.Provider>;
};
