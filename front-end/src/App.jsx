import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import HistoryPage from "./pages/HistoryPage";
import Navbar from "./components/Navbar";
import './App.css'

function App() {

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/history/:tableNumber" element={<HistoryPage />} />
      </Routes>
    </div>
  )
}

export default App
