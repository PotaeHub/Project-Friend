import { useState } from "react"
import api from "../axios"

export default function PromptPayPage({ sessionId, amount }) {
    const [slip, setSlip] = useState(null)
    const [loading, setLoading] = useState(false)

    const uploadSlip = async () => {
        if (!slip) return alert("กรุณาเลือกสลิป")

        const formData = new FormData()
        formData.append("buffetSessionId", sessionId)
        formData.append("amount", amount)
        formData.append("slip", slip)

        try {
            setLoading(true)
            await api.post("/payment/upload-slip", formData)
            alert("อัปโหลดสลิปเรียบร้อย รอแคชเชียร์ตรวจสอบ")
            setSlip(null)
        } catch (err) {
            alert("เกิดข้อผิดพลาด")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <h2 className="text-xl font-bold text-center">
                ชำระเงิน PromptPay
            </h2>

            <img
                src={qr}
                alt="PromptPay QR"
                className="mx-auto w-64"
            />


            <p className="text-center text-lg">
                ยอดชำระ <b>{amount}</b> บาท
            </p>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setSlip(e.target.files[0])}
            />

            <button
                onClick={uploadSlip}
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}
            </button>
        </div>
    )
}
