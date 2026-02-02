// src/components/SlipCard.jsx
export default function SlipCard({ slip, onAction }) {
    return (
        <div className="border rounded-lg p-3 shadow bg-white">
            <img
                src={`http://localhost:3000${slip.imageUrl}`}
                alt="slip"
                className="w-full mb-2 rounded"
            />

            <p>โต๊ะ: <b>{slip.session.table.number}</b></p>
            <p>ยอด: <b>{slip.amount}</b> บาท</p>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={() => onAction(slip.id, "APPROVE")}
                    className="flex-1 bg-green-600 text-white py-1 rounded"
                >
                    อนุมัติ
                </button>
                <button
                    onClick={() => onAction(slip.id, "REJECT")}
                    className="flex-1 bg-red-600 text-white py-1 rounded"
                >
                    ปฏิเสธ
                </button>
            </div>
        </div>
    )
}
