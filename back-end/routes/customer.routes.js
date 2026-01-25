import { Router } from "express";
import { getCustomerCategories, getCustomerMenus, getOrderHistoryByTable } from "../controllers/customer.controller.js";

const router = Router();

router.get("/customer/menus", getCustomerMenus);
router.get("/customer/categories", getCustomerCategories);
router.get("/customer/orders/:tableNumber", getOrderHistoryByTable);
export default router;
