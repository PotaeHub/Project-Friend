import { prisma } from "../config/db.js"
import generatePayload from "promptpay-qr"
import qrcode from "qrcode"
export const uploadSlip = async (req, res) => {
    try {
        const { buffetSessionId, amount } = req.body

        if (!req.file) {
            return res.status(400).json({ message: "ไม่พบไฟล์สลิป" })
        }

        const slip = await prisma.paymentSlip.create({
            data: {
                buffetSessionId: Number(buffetSessionId),
                amount: Number(amount),
                imageUrl: `/uploads/${req.file.filename}`
            }
        })

        res.json({
            message: "อัปโหลดสลิปสำเร็จ",
            slip
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
export const generatePromptPayQR = async (req, res) => {
    try {
        const { amount } = req.body

        // เบอร์ PromptPay ร้าน
        const payload = generatePayload("0822927875", {
            amount: Number(amount)
        })

        // แปลงเป็น QR base64
        const qrCode = await qrcode.toDataURL(payload)

        res.json({ qrCode })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Generate QR failed" })
    }
}
