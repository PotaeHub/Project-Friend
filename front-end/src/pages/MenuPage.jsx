import { useState, useEffect } from "react";
import axios from "axios";
import MenuCard from "../components/MenuCard";
import CategoryTabs from "../components/CategoryTabs";

export default function MenuPage() {
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [cart, setCart] = useState([]);

    // รับ tableNumber จาก QR (query string)
    const query = new URLSearchParams(window.location.search);
    const tableNumber = parseInt(query.get("table")) || 0;

    useEffect(() => {
        if (!tableNumber) return alert("ไม่พบหมายเลขโต๊ะ กรุณาสแกน QR ใหม่");

        axios.get("http://localhost:3000/api/categories").then(res => {
            setCategories(res.data);
            if (res.data.length) setSelectedCat(res.data[0].id);
        });
        axios.get("http://localhost:3000/api/menus").then(res => setMenus(res.data));

        const savedCart = localStorage.getItem(`cart_table_${tableNumber}`);
        if (savedCart) setCart(JSON.parse(savedCart));
    }, [tableNumber]);

    useEffect(() => {
        localStorage.setItem(`cart_table_${tableNumber}`, JSON.stringify(cart));
    }, [cart, tableNumber]);

    const addToCart = (menu) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === menu.id);
            if (exists) return prev.map(i => i.id === menu.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...menu, quantity: 1 }];
        });
    };

    const removeFromCart = (menu) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === menu.id);
            if (!exists) return prev;
            if (exists.quantity === 1) return prev.filter(i => i.id !== menu.id);
            return prev.map(i => i.id === menu.id ? { ...i, quantity: i.quantity - 1 } : i);
        });
    };

    const submitOrder = async () => {
        if (cart.length === 0) return alert("กรุณาเลือกเมนูก่อนสั่ง");

        const orderItems = cart.map(item => ({
            menuId: item.id,
            quantity: item.quantity
        }));

        try {
            const res = await axios.post("http://localhost:3000/api/order", {
                tableNumber,
                items: orderItems
            });

            if (res.data.success) {
                alert("สั่งอาหารเรียบร้อยแล้ว!");
                setCart([]);
                localStorage.removeItem(`cart_table_${tableNumber}`);
            } else {
                alert("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    };

    const filteredMenus = selectedCat ? menus.filter(m => m.categoryId === selectedCat) : menus;
    const totalItems = cart.length;

    return (
        <div className="p-4">
            <CategoryTabs categories={categories} selected={selectedCat} onSelect={setSelectedCat} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMenus.map(menu => (
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        quantity={cart.find(i => i.id === menu.id)?.quantity || 0}
                    />
                ))}
            </div>

            <button
                onClick={submitOrder}
                className="fixed bottom-5 right-5 bg-orange-500 text-white py-3 px-5 rounded-full shadow-lg sm:py-4 sm:px-6"
            >
                ตะกร้า ({totalItems})
            </button>
        </div>
    );
}
