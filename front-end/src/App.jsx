import { Routes, Route } from "react-router-dom";

import MenuPage from "./page/customer/CustomerPage";
import KitchenPage from "./page/KitchenPage";
import HistoryPage from "./page/HistoryPage";
import LoginPage from "./page/LoginPage";
import CashierPage from "./page/cashier/CashierPage";

import AdminLayout from "./page/AdminLayout";
import AdminCategories from "./page/AdminCategories";
import AdminMenus from "./page/AdminMenus";
import AdminDashboard from "./page/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminTables from "./page/AdminTables";
import AdminPackages from "./page/AdminPackages";

export default function App() {
  return (
    <Routes>

      {/* ===== Public ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/customer/history" element={<HistoryPage />} />

      {/* ===== ADMIN ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="menus" element={<AdminMenus />} />
        <Route path="tables" element={<AdminTables />} />
        <Route path="packages" element={<AdminPackages />} />
      </Route>

      {/* ===== KITCHEN ===== */}
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute roles={["KITCHEN"]}>
            <KitchenPage />
          </ProtectedRoute>
        }
      />

      {/* ===== CASHIER ===== */}
      <Route
        path="/cashier"
        element={
          <ProtectedRoute roles={["CASHIER"]}>
            <CashierPage />
          </ProtectedRoute>
        }
      />

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
