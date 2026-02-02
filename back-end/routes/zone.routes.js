import express from "express"
import { getZones, toggleZone } from "../controllers/zone.controller.js"
import { auth } from "../middleware/auth.js"
import { allowRoles } from "../middleware/roles.js"

const router = express.Router()

router.get("/cashier/zones", auth, allowRoles("CASHIER", "ADMIN"), getZones)
router.patch("/cashier/zones/:id/toggle", auth, allowRoles("CASHIER", "ADMIN"), toggleZone)

export default router
