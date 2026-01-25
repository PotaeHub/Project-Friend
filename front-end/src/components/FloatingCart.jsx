export function FloatingCart({ count, onOpen }) {
    if (count === 0) return null;

    return (
        <button
            onClick={onOpen}
            className="fixed bottom-6 right-6 bg-orange-500 text-white px-5 py-3 rounded-full shadow-xl"
        >
            🛒 {count}
        </button>
    );
}
