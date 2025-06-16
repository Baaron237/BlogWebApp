/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState} from "react"


export const StoreContext = createContext<any>(null)

const StoreContextProvider = ({ children } : { children: any}) => {

    const [token, setToken] = useState<string>(() => localStorage.getItem('AUTH_TOKEN') || '');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN");
        setUser(null);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('AUTH_TOKEN', token);
        }
    }, [token]);

    const contextValue = {
        token,
        user,
        setUser,
        setToken,
        isLoading,
        setIsLoading,
        logout,
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider