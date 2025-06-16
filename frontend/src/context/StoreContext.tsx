/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState} from "react"


export const StoreContext = createContext<any>(null)

const StoreContextProvider = ({ children } : { children: any}) => {

    const [token, setToken] = useState<string | null>(() => localStorage.getItem('AUTH_TOKEN') || '');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<string | null>(() => localStorage.getItem('USER_DATA') || '');

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN");
        localStorage.removeItem("USER_DATA");   
        setUser(null);
        setToken(null);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('AUTH_TOKEN', token);
            localStorage.setItem("USER_DATA", JSON.stringify(user));
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