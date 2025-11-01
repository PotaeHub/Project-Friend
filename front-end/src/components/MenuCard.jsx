export default function MenuCard({ menu, addToCart, removeFromCart, quantity }) {
    return (
        <div className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition-all w-full max-w-xs mx-auto">
            {menu.image && (
                <img 
                    src={menu.image} 
                    alt={menu.name} 
                    className="rounded-lg mb-2 w-full h-auto object-cover"
                />
            )}
            <h3 className="font-semibold text-sm sm:text-base">{menu.name}</h3>
            <p className="text-orange-600 font-bold text-sm sm:text-base">{menu.price}฿</p>

            <div className="flex items-center mt-2">
                <button
                    onClick={() => removeFromCart(menu)}
                    className="bg-gray-300 px-2 py-1 rounded-l min-w-[40px]"
                >-</button>

                <span className="px-3 text-sm sm:text-base">{quantity}</span>

                <button
                    onClick={() => addToCart(menu)}
                    className="bg-orange-500 text-white px-2 py-1 rounded-r min-w-[40px]"
                >+</button>
            </div>
        </div>
    );
}
