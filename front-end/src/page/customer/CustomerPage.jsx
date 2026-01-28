import { useEffect, useState } from "react";
import apiCustomer from "../../axiosCustomer";

import Header from "../../components/Header";
import HistoryModal from "../../components/HistoryModal";
import CategoryBar from "../../components/CategoryBar";
import MenuCard from "../../components/MenuCard";

export default function CustomerPage() {
    const tableNumber = 1;

    const [session, setSession] = useState(null);
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [activeCat, setActiveCat] = useState("all");

    const [cart, setCart] = useState([]);
    const [openHistory, setOpenHistory] = useState(false);

    /* ================= LOAD SESSION ================= */
    const loadSession = async () => {
        try {
            const res = await apiCustomer.get(
                `/customer/table/${tableNumber}/session`
            );
            setSession(res.data);
        } catch (err) {
            console.error("loadSession error:", err);
        }
    };

    /* ================= LOAD CATEGORY + MENU ================= */
    const loadMenuData = async () => {
        try {
            const [catRes, menuRes] = await Promise.all([
                apiCustomer.get("/customer/categories"),
                apiCustomer.get("/customer/menus")
            ]);

            // เพิ่ม All
            setCategories([
                { id: "all", name: "ทั้งหมด" },
                ...catRes.data
            ]);

            // 🔥 แก้ตรงนี้

            setMenus(menuRes.data);

        } catch (err) {
            console.error("loadMenuData error:", err);
        }
    };


    useEffect(() => {
        loadSession();
        loadMenuData();
    }, []);

    /* ================= CART LOGIC ================= */
    /* ================= CART LOGIC ================= */
    const addToCart = (menu) => {
        setCart(prev => {
            const found = prev.find(i => i.id === menu.id);
            if (found) {
                return prev.map(i =>
                    i.id === menu.id
                        ? { ...i, qty: i.qty + 1 }
                        : i
                );
            }
            return [...prev, { ...menu, qty: 1 }];
        });
    };

    const removeFromCart = (menuId) => {
        setCart(prev =>
            prev
                .map(i =>
                    i.id === menuId
                        ? { ...i, qty: i.qty - 1 }
                        : i
                )
                .filter(i => i.qty > 0)
        );
    };


    const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

    /* ================= FILTER MENU ================= */
    const filteredMenus =
        activeCat === "all"
            ? menus
            : menus.filter(m => Number(m.categoryId) === Number(activeCat));

    return (
        <>
            <Header
                tableNumber={tableNumber}
                cartCount={cartCount}
                onOpenCart={() => { }}
                onOpenHistory={() => setOpenHistory(true)}
            />

            <CategoryBar
                categories={categories}
                activeCat={activeCat}
                onSelect={setActiveCat}
            />
            <div className="grid grid-cols-2 gap-4 p-4">
                {filteredMenus.map(menu => {
                    const item = cart.find(c => c.id === menu.id);

                    return (
                        <MenuCard
                            key={menu.id}
                            menu={menu}
                            qty={item?.qty || 0}
                            onAdd={() => addToCart(menu)}
                            onRemove={() => removeFromCart(menu.id)}
                        />
                    );
                })}
            </div>

            {openHistory && session && (
                <HistoryModal
                    sessionId={session.id}
                    onClose={() => setOpenHistory(false)}
                />
            )}
        </>
    );
}
