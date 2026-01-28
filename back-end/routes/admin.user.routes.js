import express from "express";
import {
    getUsers,
    createUser,
    deleteUser
} from "../controllers/admin.user.controller.js";

import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

router.get("/admin/users", auth, allowRoles("ADMIN"), getUsers);
router.post("/admin/users", auth, allowRoles("ADMIN"), createUser);
router.delete("/admin/users/:id", auth, allowRoles("ADMIN"), deleteUser);

export default router;
