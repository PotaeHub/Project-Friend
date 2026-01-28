import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (menu) => {
        setCart(prev => {
            const found = prev.find(i => i.id === menu.id);
            if (found) {
                return prev.map(i =>
                    i.id === menu.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...menu, qty: 1 }];
        });
    };

    const decreaseQty = (menuId) => {
        setCart(prev =>
            prev
                .map(i =>
                    i.id === menuId ? { ...i, qty: i.qty - 1 } : i
                )
                .filter(i => i.qty > 0)
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, decreaseQty, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
