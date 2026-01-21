import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  useEffect(() => {
    // Set up axios interceptor to attach token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Do not add Authorization header for login or register
        if (
          token &&
          !(
            config.url.endsWith("/api/auth/login") ||
            config.url.endsWith("/api/auth/register")
          )
        ) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // Cleanup
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Login function: calls API, stores token and user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", { email, password });
      // Backend returns flat fields, not a user object
      const { token, id, name, email: userEmail, role, refreshToken: rt } = response.data;
      const user = { id, name, email: userEmail, role };
      setToken(token);
      setRefreshToken(rt || null);
      setUser(user);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Register function: calls API, logs in user on success
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", { name, email, password });
      const { token, id, name: nm, email: em, role, refreshToken: rt } = response.data;
      setToken(token);
      setRefreshToken(rt || null);
      setUser({ id, name: nm, email: em, role });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      let errorMsg = "Registration failed. Please try again.";
      if (error.response && error.response.status === 409) {
        errorMsg = "Email already exists.";
      } else if (error.response && error.response.status === 403) {
        errorMsg = "Access forbidden. Please try again.";
      }
      return { success: false, error: errorMsg };
    }
  };

  // Logout: clear user and token
  const logout = () => {
    try {
      axios.post('/api/auth/logout')
    } catch (err) {
    }
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, refreshToken, setRefreshToken, login, logout, register, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 