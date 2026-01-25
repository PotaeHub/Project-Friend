export default function BottomCartBar({ totalQty, totalPrice, onOpen }) {
    if (totalQty === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
            <div
                onClick={onOpen}
                className="mx-auto max-w-screen-md bg-orange-500 text-white rounded-t-2xl px-5 py-4 shadow-2xl flex justify-between items-center cursor-pointer"
            >
                <div>
                    <p className="font-semibold">🛒 {totalQty} รายการ</p>
                    <p className="text-sm opacity-90">แตะเพื่อดูตะกร้า</p>
                </div>
                <p className="text-lg font-bold">
                    {totalPrice.toLocaleString()} ฿
                </p>
            </div>
        </div>
    );
}
