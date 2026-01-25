import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { allowRoles } from "../middleware/roles.js";
import { adminGetCategories } from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
router.post("/categories", auth, allowRoles("ADMIN"), createCategory);
router.get("/categories", auth, allowRoles("ADMIN"), adminGetCategories)
router.put("/categories/:id", auth, allowRoles("ADMIN"), updateCategory);
router.delete("/categories/:id", auth, allowRoles("ADMIN"), deleteCategory);
export default router;
