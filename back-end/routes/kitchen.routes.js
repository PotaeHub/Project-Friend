import { Router } from "express";
import {
    getKitchenOrdersByTable,
    doneTableOrders,
    updateOrderStatus
} from "../controllers/kitchen.controller.js";

const router = Router();

router.get("/kitchen/orders", getKitchenOrdersByTable);
router.post("/kitchen/table/:tableNumber/done", doneTableOrders);
router.patch("/kitchen/orders/:id", updateOrderStatus);
export default router;
