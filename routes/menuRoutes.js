import express from "express";
import { getMenus, createMenu } from "../controllers/menuController.js";

const router = express.Router();
router.get("/menus", getMenus);
router.post("/menus", createMenu);
export default router;
