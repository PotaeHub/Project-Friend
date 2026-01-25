// src/page/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">

                <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-orange-500">
                        🍽 Admin Panel
                    </h1>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                    >
                        Logout
                    </button>
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}
