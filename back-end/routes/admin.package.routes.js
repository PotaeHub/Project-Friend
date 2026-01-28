import express from "express";
import {
    getPackages,
    createPackage,
    updatePackage,
    deletePackage
} from "../controllers/admin.package.controller.js";

import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();
router.get("/admin/packages", auth, allowRoles("ADMIN"), getPackages);
router.post("/admin/packages", auth, allowRoles("ADMIN"), createPackage);
router.put("/admin/packages/:id", auth, allowRoles("ADMIN"), updatePackage);
router.delete("/admin/packages/:id", auth, allowRoles("ADMIN"), deletePackage);

export default router;
