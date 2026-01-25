import express from "express";
import {
    getOrders,
    getKitchenOrders,
    createOrder,
} from "../controllers/orderController.js";
import { allowRoles } from "../middleware/roles.js";
import { auth } from "../middleware/auth.js";
import { updateOrderStatus } from "../controllers/kitchen.controller.js";

const router = express.Router();

// ===== CUSTOMER =====
router.post("/orders", createOrder);
// ===== KITCHEN =====
router.get(
    "/kitchen/orders",
    auth,
    allowRoles("KITCHEN"),
    getKitchenOrders
);

// ===== ADMIN =====
router.get(
    "/orders",
    auth,
    allowRoles("ADMIN"),
    getOrders
);
router.patch("/kitchen/orders/:id", auth, allowRoles("KITCHEN", "ADMIN"), updateOrderStatus);
// ===== UPDATE STATUS (KITCHEN + ADMIN) =====
// router.put(
//     "/orders/:id/status",
//     auth,
//     allowRoles("KITCHEN", "ADMIN"),
//     updateOrderStatus
// );

export default router;
