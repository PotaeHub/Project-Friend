import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
    const linkClass = ({ isActive }) =>
        `block px-4 py-2 rounded transition
     ${isActive ? "bg-orange-500 text-white" : "hover:bg-orange-100"}`;

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-6 text-xl font-bold text-orange-500 border-b">
                🍜 QR Order
            </div>

            <nav className="p-4 space-y-2">
                <NavLink to="/admin" end className={linkClass}>
                    📊 Dashboard
                </NavLink>

                <NavLink to="/admin/categories" className={linkClass}>
                    🗂 หมวดหมู่
                </NavLink>

                <NavLink to="/admin/menus" className={linkClass}>
                    🍽 เมนูอาหาร
                </NavLink>
                <NavLink to="/admin/tables" className={linkClass}>
                    🍽 จัดการโต๊ะ
                </NavLink>
                <NavLink to="/admin/packages" className={linkClass}>
                    🍽 จัดการแพ็กเกจ 
                </NavLink>
            </nav>
        </div>
    );
}
