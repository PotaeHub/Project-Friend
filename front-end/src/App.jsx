import { Routes, Route } from "react-router-dom";

import MenuPage from "./page/customer/CustomerPage";
import KitchenPage from "./page/KitchenPage";
import HistoryPage from "./page/HistoryPage";
import LoginPage from "./page/LoginPage";

import AdminLayout from "./page/AdminLayout";
import AdminCategories from "./page/AdminCategories";
import AdminMenus from "./page/AdminMenus";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./page/AdminDashboard";

export default function App() {
  return (
    <Routes>

      {/* ===== Public ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/customer/history" element={<HistoryPage />} />

      {/* ===== Kitchen (Protected) ===== */}
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute role="KITCHEN">
            <KitchenPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="menus" element={<AdminMenus />} />
      </Route>

      {/* ===== 404 ===== */}
      <Route
        path="*"
        element={
          <div className="p-4 text-center">
            <h1>❌ หน้าไม่พบ (404)</h1>
          </div>
        }
      />
    </Routes>
  );
}
