import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    const login = (jwtToken) => {
        // Implement your login logic here
        setAuthenticated(true);

        // Store JWT token in local storage
        localStorage.setItem('jwtToken', jwtToken);

        // Store JWT token in cookies
        Cookies.set('jwt', jwtToken, { expires: 5 }); // Adjust expiration as needed
    };

    const logout = () => {
        // Implement your logout logic here
        setAuthenticated(false);
        localStorage.removeItem('jwtToken'); // Clear JWT token from local storage
        Cookies.remove('jwt'); // Clear JWT token cookie
    };

    return <AuthContext.Provider value={{ authenticated, login, logout }}>{children}</AuthContext.Provider>;
};
