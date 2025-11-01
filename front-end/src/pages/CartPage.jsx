import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function CartPage() {
    const [searchParams] = useSearchParams();
    const tableNumber = parseInt(searchParams.get("table")) || 0;
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (!tableNumber) return alert("ไม่พบหมายเลขโต๊ะ");
        const savedCart = localStorage.getItem(`cart_table_${tableNumber}`);
        if (savedCart) setCart(JSON.parse(savedCart));
    }, [tableNumber]);

    const handleOrder = async () => {
        if (!cart.length) return alert("ไม่มีเมนูในตะกร้า");

        try {
            await axios.post("http://localhost:3000/api/order", {
                tableNumber,
                items: cart.map(c => ({ menuId: c.id, quantity: c.quantity })),
            });
            localStorage.removeItem(`cart_table_${tableNumber}`);
            alert("✅ สั่งอาหารเรียบร้อย!");
            window.location.href = `/menu?table=${tableNumber}`;
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    };

    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">รายการในตะกร้า (โต๊ะ {tableNumber})</h1>
            {cart.length === 0 && <p>ตะกร้าว่าง</p>}
            {cart.map(item => (
                <div key={item.id} className="flex justify-between border-b py-2">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity}฿</span>
                </div>
            ))}
            {cart.length > 0 && (
                <div className="mt-4">
                    <div className="mb-2 font-bold">รวมทั้งหมด: {totalPrice}฿</div>
                    <button
                        onClick={handleOrder}
                        className="bg-green-500 text-white w-full py-3 rounded-lg"
                    >
                        ยืนยันการสั่ง
                    </button>
                </div>
            )}
        </div>
    );
}
