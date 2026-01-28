import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const parseUser = (token) => {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            throw new Error("Token expired");
        }

        return {
            id: decoded.id,
            role: decoded.role,
        };
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setUser(parseUser(token));
        } catch {
            localStorage.removeItem("token");
            setUser(null);
        }

        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const user = parseUser(token);
        setUser(user);

        // 🔥 redirect ตาม role
        if (user.role === "ADMIN") navigate("/admin", { replace: true });
        else if (user.role === "KITCHEN") navigate("/kitchen", { replace: true });
        else if (user.role === "CASHIER") navigate("/cashier", { replace: true });
        else navigate("/login", { replace: true });
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
