import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("stylehub_token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("stylehub_user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const login = (token, user) => {
    localStorage.setItem("stylehub_token", token);
    localStorage.setItem(
      "stylehub_user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("stylehub_token");
    localStorage.removeItem("stylehub_user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}