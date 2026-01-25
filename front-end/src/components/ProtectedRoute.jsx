import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    // ❌ ยังไม่ login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ login แล้ว แต่ role ไม่ตรง
    if (role && user.role !== role) {
        if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
        if (user.role === "KITCHEN") return <Navigate to="/kitchen" replace />;
        return <Navigate to="/customer/menu" replace />;
    }

    return children;
}
