import { useCart } from "../../context/CartContext";
import MenuCard from "../components/MenuCard";

{
    menus.map(item => {
        const cartItem = cart.find(c => c.id === item.id);
        return (
            <MenuCard
                key={item.id}
                item={{ ...item, qty: cartItem?.qty || 0 }}
                onAdd={() => addQty(item)}
                onRemove={() => removeQty(item)}
            />
        );
    })
}
