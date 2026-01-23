import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loginType, setLoginType] = useState(null);

    const login = (type) => {
        setLoginType(type);
    };

    const logout = () => {
        setLoginType(null);
    };

    return (
        <AuthContext.Provider value={{ loginType, setLoginType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
