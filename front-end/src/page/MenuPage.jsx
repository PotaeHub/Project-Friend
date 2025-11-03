import { useState, useEffect } from "react";
import api from "../axios";
import MenuCard from "../components/MenuCard";
import Cart from "../components/Cart";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlTable = new URLSearchParams(window.location.search).get("table");
        const num = Number(urlTable);
        if (!isNaN(num) && num > 0) setTableNumber(num);

        if (num > 0) {
            api.get("/categories").then(res => setCategories(res.data));
            api.get("/menus").then(res => setMenu(res.data));
        }
    }, []);

    if (!tableNumber) {
        return <div className="p-4 text-center text-red-500">❌ กรุณาสแกน QR Code ก่อนเข้าหน้าเมนู</div>;
    }

    const addToCart = item => {
        const exist = cart.find(i => i.id === item.id);
        if (exist) setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
        else setCart([...cart, { ...item, qty: 1 }]);
    };

    const removeFromCart = item => {
        const exist = cart.find(i => i.id === item.id);
        if (!exist) return;
        if (exist.qty === 1) setCart(cart.filter(i => i.id !== item.id));
        else setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i));
    };

    const sendOrder = async () => {
        if (!cart.length) return alert("ยังไม่ได้เลือกเมนู!");
        const payload = { tableNumber, items: cart.map(i => ({ menuId: i.id, quantity: i.qty })) };

        try {
            const res = await api.post("/orders", payload);
            alert(`ส่งออเดอร์โต๊ะ ${tableNumber} เรียบร้อย!`);
            setCart([]);
            setCartOpen(false);

            // ส่ง cart ไป socket เพื่อให้ HistoryPage อัพเดต realtime
            socket.emit("update-cart", { tableNumber, cart: payload.items });
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการส่งออเดอร์");
        }
    };

    const filteredMenu = selectedCategory
        ? menu.filter(m => m.categoryId === selectedCategory)
        : menu;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header
                cartCount={cart.length}
                tableNumber={tableNumber}
                cart={cart}
                onOpenCart={() => setCartOpen(true)}
            />

            <h1 className="p-4 text-2xl font-bold text-center text-gray-800">โต๊ะ {tableNumber}</h1>

            <div className="p-4 flex justify-center gap-4 mb-4">
                <button onClick={() => setSelectedCategory(null)} className="px-4 py-2 bg-orange-300 hover:bg-orange-400 rounded shadow transition">
                    <i className="fas fa-th-list"></i> All
                </button>
                {categories.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="px-4 py-2 bg-orange-200 hover:bg-orange-300 rounded shadow transition">
                        <i className="fas fa-tag"></i> {cat.name}
                    </button>
                ))}
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMenu.map(item => {
                    const cartItem = cart.find(i => i.id === item.id) || {};
                    return (
                        <MenuCard
                            key={item.id}
                            item={{ ...item, qty: cartItem.qty || 0 }}
                            onAdd={() => addToCart(item)}
                            onRemove={() => removeFromCart(item)}
                        />
                    );
                })}
            </div>

            {cartOpen && (
                <Cart
                    cart={cart}
                    addQty={addToCart}
                    removeQty={removeFromCart}
                    removeItem={item => setCart(cart.filter(i => i.id !== item.id))}
                    onSend={sendOrder}
                />
            )}
        </div>
    );
}
