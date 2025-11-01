import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tableNumber = parseInt(searchParams.get("table")) || 0;

    return (
        <nav className="bg-white shadow-md p-3 flex items-center justify-between md:justify-between">
            <Link to={`/menu?table=${tableNumber}`} className="font-bold text-orange-600 text-lg">
                🍜 QR Order
            </Link>

            <div className="relative">
                <input id="nav-toggle" type="checkbox" className="peer hidden" aria-hidden="true" />
                <label
                    htmlFor="nav-toggle"
                    className="md:hidden p-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6 block peer-checked:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg className="w-6 h-6 hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </label>

                <div
                    className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40 p-2 hidden peer-checked:flex flex-col space-y-1 md:static md:w-auto md:shadow-none md:flex md:flex-row md:items-center md:space-x-4 md:mt-0"
                    role="menu"
                    aria-labelledby="nav-toggle"
                >
                    <Link to={`/cart?table=${tableNumber}`} className="px-3 py-2 rounded hover:bg-gray-100">ตะกร้า</Link>
                </div>
            </div>
        </nav>
    );
}
