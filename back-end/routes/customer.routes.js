import { Router } from "express";
import { getActiveSessionByTable, getCustomerCategories, getCustomerMenus,  getOrderHistoryByTable, getOrdersBySession } from "../controllers/customer.controller.js";

const router = Router();

router.get("/customer/menus", getCustomerMenus);
router.get("/customer/categories", getCustomerCategories);
router.get("/customer/orders/:tableNumber", getOrderHistoryByTable);

router.get(
    "/customer/table/:tableNumber/session",
    getActiveSessionByTable
);

/* 🔥 ประวัติการสั่ง (ตาม session) */
router.get(
    "/customer/session/:sessionId/orders",
    getOrdersBySession
);

export default router;
