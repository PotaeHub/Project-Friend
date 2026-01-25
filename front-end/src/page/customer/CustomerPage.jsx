import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../axios";
import socket from "../../socketCustomer";

import Header from "../../components/Header";
import Cart from "../../components/Cart";
import { useCart } from "../../context/CartContext";

export default function CustomerPage() {
    const {
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart
    } = useCart();

    const [openCart, setOpenCart] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");

    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("table");

    /* ================= LOAD MENUS ================= */
    useEffect(() => {
        api.get("/customer/menus").then(res => {
            setCategories(res.data);
        });
    }, []);

    /* ================= JOIN TABLE ================= */
    useEffect(() => {
        if (tableNumber) {
            socket.emit("join-table", Number(tableNumber));
        }
    }, [tableNumber]);

    /* ================= REALTIME CART ================= */
    useEffect(() => {
        if (!tableNumber) return;

        socket.emit("update-cart", {
            tableNumber: Number(tableNumber),
            cart
        });
    }, [cart]);

    /* ================= HELPERS ================= */
    const allMenus = categories.flatMap(c => c.menus || []);

    const menus =
        activeCategory === "all"
            ? allMenus
            : categories.find(c => c.id === activeCategory)?.menus || [];

    const getQty = (menuId) =>
        cart.find(i => i.id === menuId)?.qty || 0;

    /* ================= SEND ORDER ================= */
    const sendOrder = async () => {
        if (!cart.length) return;

        await api.post("/orders", {
            tableNumber: Number(tableNumber),
            items: cart.map(i => ({
                menuId: i.id,
                qty: i.qty
            }))
        });

        socket.emit("confirm-order", { tableNumber });
        clearCart();
        setOpenCart(false);
    };
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    return (
        <>
            <Header
                cartCount={totalQty}
                tableNumber={tableNumber}
                onOpenCart={() => setOpenCart(true)}
            />

            {/* ================= CATEGORIES ================= */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full
                    ${activeCategory === "all"
                            ? "bg-black text-white"
                            : "bg-gray-200"}`}
                >
                    All
                </button>

                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-full
                        ${activeCategory === cat.id
                                ? "bg-black text-white"
                                : "bg-gray-200"}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* ================= MENUS ================= */}
            {/* ================= MENUS ================= */}
            <div className="grid grid-cols-2 gap-4 p-4">
                {menus.map(menu => {
                    const qty = getQty(menu.id);

                    return (
                        <div
                            key={menu.id}
                            className="border rounded-xl p-3 shadow"
                        >
                            <img
                                src={menu.image
                                    ? "http://localhost:5000" + menu.image
                                    : "/no-image.png"}
                                className="h-32 w-full object-cover rounded"
                            />

                            <h3 className="mt-2 font-semibold">
                                {menu.name}
                            </h3>
                            <p className="text-gray-600">
                                {menu.price} บาท
                            </p>

                            {/* ===== ADD / REMOVE ALWAYS SHOW ===== */}
                            <div className="mt-3 flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                                <button
                                    onClick={() => decreaseQty(menu.id)}
                                    disabled={qty === 0}
                                    className={`px-3 py-1 rounded text-lg
                            ${qty === 0
                                            ? "bg-gray-300 text-gray-500"
                                            : "bg-white shadow"}`}
                                >
                                    –
                                </button>

                                <span className="font-bold text-lg w-6 text-center">
                                    {qty}
                                </span>

                                <button
                                    onClick={() => addToCart(menu)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-lg shadow"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* ================= CART ================= */}
            {openCart && (
                <Cart
                    cart={cart}
                    onSend={sendOrder}
                    onClose={() => setOpenCart(false)}
                />
            )}
        </>
    );
}
