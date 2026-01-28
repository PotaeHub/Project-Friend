import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { adminGetMenus, createMenu, deleteMenu, getMenuById, updateMenu } from "../controllers/adminController.js";
import { uploadMenu } from "../middleware/upload.js";
const router = express.Router();
router.get("/menus", getMenuById);
router.get("/admin/menus", auth, allowRoles("ADMIN"), adminGetMenus);

router.post(
    "/menus",
    auth,
    allowRoles("ADMIN"),
    uploadMenu.single("image"),
    createMenu
);

router.put(
    "/menus/:id",
    auth,
    allowRoles("ADMIN"),
    uploadMenu.single("image"),
    updateMenu
);

router.delete(
    "/menus/:id",
    auth,
    allowRoles("ADMIN"),
    deleteMenu
);
export default router;
