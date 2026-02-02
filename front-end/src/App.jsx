import { Routes, Route } from "react-router-dom";

import LoginPage from "./page/LoginPage";

import CustomerPage from "./page/customer/CustomerPage";
import HistoryPage from "./page/HistoryPage";

import KitchenPage from "./page/KitchenPage";
import CashierPage from "./page/cashier/CashierPage";

import AdminLayout from "./page/AdminLayout";
import AdminCategories from "./page/AdminCategories";
import AdminMenus from "./page/AdminMenus";
import AdminDashboard from "./page/AdminDashboard";
import AdminTables from "./page/AdminTables";
import AdminPackages from "./page/AdminPackages";

import PromptPayPage from "./page/PromptPayPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminZones from "./page/AdminZones";

export default function App() {
  return (
    <Routes>

      {/* ===== Public ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/menu" element={<CustomerPage />} />
      <Route path="/table/:tableNumber" element={<CustomerPage />} />
      <Route path="/customer/history" element={<HistoryPage />} />

      {/* ===== PAYMENT ===== */}
      <Route
        path="/payment/promptpay/:sessionId"
        element={<PromptPayPage />}
      />

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
        <Route path="zones" element={<AdminZones />} />
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
