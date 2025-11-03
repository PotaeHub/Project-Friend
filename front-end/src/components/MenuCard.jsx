export default function MenuCard({ item, onAdd, onRemove }) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3 sm:p-4 w-full">
            {item.image && (
                <div className="relative h-32 sm:h-40 md:h-48 -mx-3 sm:-mx-4 -mt-3 sm:-mt-4 mb-3 sm:mb-4 overflow-hidden">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            
            <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-1 sm:mb-2">{item.name}</h2>
            <p className="text-orange-500 font-bold text-base sm:text-lg mb-3 sm:mb-4">{item.price}฿</p>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <button 
                    onClick={onRemove} 
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    -
                </button>
                <span className="font-medium text-base sm:text-lg">{item.qty || 0}</span>
                <button 
                    onClick={onAdd} 
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    +
                </button>
            </div>
        </div>
    );
}
