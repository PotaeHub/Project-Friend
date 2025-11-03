import express from "express";
import { getMenus, createMenu, getMenusByCategory } from "../controllers/menuController.js";
const router = express.Router();
router.get("/menus", getMenus);
router.get("/menus/category/:categoryId", getMenusByCategory);
router.post("/menus", createMenu);
export default router;
