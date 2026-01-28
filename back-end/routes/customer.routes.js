import { Router } from "express";
import {
    getActiveSessionByTable,
    getCustomerCategories,
    getCustomerMenus,
    getOrdersBySession
} from "../controllers/customer.controller.js";

const router = Router();

/* ===== เมนูลูกค้า ===== */
router.get("/customer/menus", getCustomerMenus);
router.get("/customer/categories", getCustomerCategories);

/* ===== เช็ค session โต๊ะ ===== */
router.get(
    "/customer/table/:tableNumber/session",
    getActiveSessionByTable
);

/* ===== ประวัติออเดอร์ (ถูกต้องตาม schema) ===== */
router.get(
    "/customer/session/:sessionId/orders",
    getOrdersBySession
);

export default router;
