import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { adminDashboard } from "../controllers/adminController.js";
const router = Router();
router.get("/admin/dashboard", auth, allowRoles("ADMIN"), adminDashboard);

export default router;