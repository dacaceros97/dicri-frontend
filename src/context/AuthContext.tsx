import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: number;
  roleId: number;
  roleName: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;

    try {
      return jwtDecode<User>(storedToken);
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode<User>(newToken);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
