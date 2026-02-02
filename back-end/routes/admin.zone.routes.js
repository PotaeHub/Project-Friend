import express from "express";
import {
    getZones,
    createZone,
    toggleZone,
    updateZone,
    deleteZone
} from "../controllers/admin.zone.controller.js";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

router.get("/admin/zones", auth, allowRoles("ADMIN"), getZones);
router.post("/admin/zones", auth, allowRoles("ADMIN"), createZone);
router.patch("/admin/zones/:id", auth, allowRoles("ADMIN"), toggleZone);
router.put("/admin/zones/:id", auth, allowRoles("ADMIN"), updateZone);
router.delete("/admin/zones/:id", auth, allowRoles("ADMIN"), deleteZone);
export default router;
