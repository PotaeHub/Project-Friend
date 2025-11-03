import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./page/MenuPage";
import KitchenPage from "./page/KitchenPage";
import HistoryPage from "./page/HistoryPage";

export default function App() {
  return (
    <Routes>
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/kitchen" element={<KitchenPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="*" element={
        <div className="p-4 text-center">
          <h1>❌ หน้าไม่พบ (404)</h1>
        </div>} />
    </Routes >
  );
}
