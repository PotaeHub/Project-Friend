export default function TableCard({ table, onClick }) {
    const isOpen = table.status === "OPEN"

    return (
        <button
            onClick={!isOpen ? onClick : undefined}
            className={`
        h-32 rounded-2xl flex flex-col justify-center items-center
        text-xl font-bold transition
        ${isOpen
                    ? "bg-red-600 cursor-not-allowed"
                    : "bg-green-600 hover:scale-105"}
      `}
        >
            โต๊ะ {table.number}
            <span className="text-sm mt-2">
                {isOpen ? "กำลังใช้งาน" : "ว่าง"}
            </span>
        </button>
    )
}
