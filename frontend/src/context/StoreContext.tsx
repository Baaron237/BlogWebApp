import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext<any>(null);

const StoreContextProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("AUTH_TOKEN")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any | null>(() => {
    const storedUser = localStorage.getItem("USER_DATA");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Erreur de parsing USER_DATA :", error, storedUser);
        return null; // Valeur par défaut en cas d'erreur
      }
    }
    return null;
  });

  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("USER_DATA");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("AUTH_TOKEN", token);
    } else {
      localStorage.removeItem("AUTH_TOKEN");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("USER_DATA", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER_DATA");
    }
  }, [user]);

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
  );
};

export default StoreContextProvider;
