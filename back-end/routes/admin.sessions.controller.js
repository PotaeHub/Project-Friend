import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { getAdminSessionHistory } from "../controllers/orderController.js";
const router = Router();
router.get(
  "/admin/sessions/history",
  auth,
  allowRoles("ADMIN"),
  getAdminSessionHistory,
);
export default router;
