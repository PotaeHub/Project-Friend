import express from "express";
import { createOrder, getOrderById, getOrders, getOrdersByTable, getTableOrders } from "../controllers/orderController.js";

const router = express.Router();
// สร้างออเดอร์ใหม่
router.post("/order", createOrder);

// ดูประวัติออเดอร์ของโต๊ะ
router.get("/table/:tableNumber", getOrdersByTable);

// ดูรายละเอียดออเดอร์เดียว
router.get("/order/:id", getOrderById);
router.get("/order/", getOrders);
router.get("/table/", getTableOrders);

export default router;
