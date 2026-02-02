// routes/payment.routes.js
import express from "express"
import { generatePromptPayQR, uploadSlip } from "../controllers/payment.controller.js"
import { uploadMenu } from "../middleware/upload.js"

const router = express.Router()

router.post("/upload-slip", uploadMenu.single("slip"), uploadSlip)
router.post("/payment/promptpay-qr", generatePromptPayQR)
export default router
