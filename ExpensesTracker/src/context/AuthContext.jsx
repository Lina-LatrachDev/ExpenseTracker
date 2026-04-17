import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Persist user & token in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("token", currentUser.token);
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    }
  }, [currentUser]);

  // ------------------------
  // ROLE HELPERS
  // ------------------------
  const isAdmin = () => currentUser?.role === "admin";
  const isEditor = () => currentUser?.role === "editor";
  const isUser = () => currentUser?.role === "user";
  const canManageUsers = () =>
    currentUser?.role === "admin" || currentUser?.role === "editor";

  // ------------------------
  // AUTH FUNCTIONS
  // ------------------------

  // SIGNUP
  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", userData);
      const data = res.data;

      setCurrentUser({
        token: data.token,
        ...data.user
      });

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", credentials);
      const data = res.data;

      setCurrentUser({
        token: data.token,
        ...data.user
      });

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin,
        isEditor,
        isUser,
        canManageUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => useContext(AuthContext);



/*import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("token", currentUser.token);
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    }
  }, [currentUser]);

  // Signup
  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", userData);
      const data = res.data;

      setCurrentUser({
        token: data.token,
        ...(data.user || data)
      }); // expects { token, user info }
      return { success: true };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: err.response?.data?.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  // Login
 const login = async (credentials) => {
  setLoading(true);
  try {
    const res = await API.post("/auth/login", credentials);

    const data = res.data;

    setCurrentUser({
      token: data.token,
      ...(data.user || data)
    });

    return { success: true };

  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: err.response?.data?.message || "Login failed" };
  } finally {
    setLoading(false);
  }
};

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook 
export const useAuth = () => useContext(AuthContext);*/
