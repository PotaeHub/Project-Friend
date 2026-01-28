import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiCustomer from "../../axiosCustomer";

// Components
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import MenuCard from "../../components/MenuCard";
import CartModal from "../../components/Cart";
import HistoryModal from "../../components/HistoryModal";

export default function CustomerPage() {
    const { tableNumber } = useParams();

    const [session, setSession] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);

    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [activeCat, setActiveCat] = useState("all");

    const [cart, setCart] = useState([]);
    const [openCart, setOpenCart] = useState(false);
    const [openHistory, setOpenHistory] = useState(false);

    // 1. ตรวจสอบสถานะโต๊ะ (Session)
    useEffect(() => {
        const fetchSession = async () => {
            if (!tableNumber) return;
            try {
                const res = await apiCustomer.get(`/customer/table/${tableNumber}/session`);
                if (res.data?.active) {
                    setSession(res.data.session);
                } else {
                    setSession(null);
                }
            } catch (err) {
                console.error(err);
                setSession(null);
            } finally {
                setLoadingSession(false);
            }
        };
        fetchSession();
    }, [tableNumber]);

    // 2. โหลดข้อมูลเมนูและหมวดหมู่
    useEffect(() => {
        Promise.all([
            apiCustomer.get("/customer/categories"),
            apiCustomer.get("/customer/menus")
        ]).then(([catRes, menuRes]) => {
            setCategories([{ id: "all", name: "ทั้งหมด" }, ...catRes.data]);
            setMenus(menuRes.data);
        }).catch(err => console.error("Error loading data:", err));
    }, []);

    // Logic: เพิ่มสินค้าลงตะกร้า
    const addToCart = menu => {
        setCart(prev => {
            const found = prev.find(i => i.id === menu.id);
            if (found) {
                return prev.map(i => i.id === menu.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...menu, qty: 1 }];
        });
    };

    // Logic: ลด/ลบสินค้าจากตะกร้า
    const removeFromCart = id => {
        setCart(prev =>
            prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
        );
    };

    // Logic: ส่งคำสั่งซื้อไปยัง API
    const submitOrder = async () => {
        if (!session || cart.length === 0) return;
        try {
            await apiCustomer.post("/orders", {
                buffetSessionId: session.id,
                items: cart.map(i => ({ menuId: i.id, qty: i.qty }))
            });
            setCart([]);
            setOpenCart(false);
            setOpenHistory(true); // สั่งเสร็จแล้วพาไปดูประวัติว่าอาหารกำลังมา
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ");
        }
    };

    const filteredMenus = activeCat === "all"
        ? menus
        : menus.filter(m => m.categoryId === Number(activeCat));

    // --- View: Loading State ---
    if (loadingSession) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-500">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="animate-pulse">กำลังตรวจสอบข้อมูลโต๊ะ...</p>
            </div>
        );
    }

    // --- View: No Session (โต๊ะยังไม่เปิด) ---
    if (!session) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center px-8 bg-gray-50">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm">
                    <span className="text-6xl mb-4 block">🍽️</span>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">โต๊ะ {tableNumber} ยังไม่เปิด</h1>
                    <p className="text-gray-500 mb-6">กรุณาสแกน QR Code ใหม่อีกครั้ง หรือติดต่อพนักงานเพื่อเปิดบริการ</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 active:scale-95 transition-all"
                    >
                        ลองอีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    // --- View: Main UI ---
    return (
        <div className="min-h-screen bg-gray-50 pb-28">
            {/* Header & Sticky Category */}
            <div className="sticky top-0 z-30 shadow-sm bg-white">
                <Header
                    tableNumber={tableNumber}
                    cartCount={cart.reduce((s, i) => s + i.qty, 0)}
                    onOpenCart={() => setOpenCart(true)}
                    onOpenHistory={() => setOpenHistory(true)}
                />
                <CategoryBar
                    categories={categories}
                    activeCat={activeCat}
                    onSelect={setActiveCat}
                />
            </div>

            {/* Menu Grid */}
            <main className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </main>

            {/* Floating Cart Bar - หัวใจของ UX สั่งอาหารมือถือ */}
            {cart.length > 0 && !openCart && (
                <div className="fixed bottom-6 left-0 right-0 px-4 z-40 animate-in slide-in-from-bottom-10 duration-300">
                    <button
                        onClick={() => setOpenCart(true)}
                        className="max-w-md mx-auto w-full bg-orange-600 text-white flex items-center justify-between p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(234,88,12,0.5)] active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 px-3 py-1 rounded-lg font-bold">
                                {cart.reduce((s, i) => s + i.qty, 0)}
                            </div>
                            <span className="font-semibold text-lg">ดูตะกร้าสั่งอาหาร</span>
                        </div>
                        <span className="font-bold">ถัดไป →</span>
                    </button>
                </div>
            )}

            {/* Modals */}
            {openCart && (
                <CartModal
                    cart={cart}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                    onSubmit={submitOrder}
                    onClose={() => setOpenCart(false)}
                />
            )}

            {openHistory && session && (
                <HistoryModal
                    sessionId={session.id}
                    onClose={() => setOpenHistory(false)}
                />
            )}
        </div>
    );
}