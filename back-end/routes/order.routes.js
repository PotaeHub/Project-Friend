import express from "express";
import {
    getOrders,
    createOrder,
} from "../controllers/orderController.js";
import { allowRoles } from "../middleware/roles.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

// ===== CUSTOMER =====
router.post("/orders", createOrder);
// ===== ADMIN =====
router.get(
    "/orders",
    auth,
    allowRoles("ADMIN"),
    getOrders
);
export default router;
