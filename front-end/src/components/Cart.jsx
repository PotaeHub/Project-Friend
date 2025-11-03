export default function Cart({ cart, addQty, removeQty, removeItem, onSend }) {
    const total = cart.reduce((sum, i) => sum + (i.price || i.menu?.price) * (i.qty || i.quantity), 0);

    return (
        <div className="fixed top-16 right-4 w-96 bg-white shadow-2xl border-0 rounded-lg p-6 z-50 transition-all duration-300 ease-in-out">
            <h2 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">🛒 ตะกร้าสินค้า</h2>

            {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ยังไม่มีรายการในตะกร้า</p>
            ) : (
                <ul className="space-y-3">
                    {cart.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="text-gray-700">
                                <span className="font-medium">{item.name || item.menu?.name}</span>
                                <span className="text-gray-500 ml-2">x {item.qty || item.quantity}</span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => removeQty(item)} 
                                    className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full transition-colors"
                                >
                                    -
                                </button>
                                <button 
                                    onClick={() => addQty(item)} 
                                    className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full transition-colors"
                                >
                                    +
                                </button>
                                <button 
                                    onClick={() => removeItem(item)} 
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 w-8 h-8 rounded-full transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-4 border-t pt-4">
                <p className="text-lg font-semibold text-gray-800 flex justify-between">
                    <span>รวมทั้งหมด:</span>
                    <span>{total.toLocaleString()}฿</span>
                </p>

                <button
                    onClick={onSend}
                    className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium text-lg shadow-sm"
                >
                    ส่งออเดอร์
                </button>
            </div>
        </div>
    );
}
