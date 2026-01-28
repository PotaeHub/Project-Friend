import express from "express";
import {
    getTables,
    createTable,
    updateTable,
    deleteTable
} from "../controllers/admin.table.controller.js";

import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

router.get("/admin/tables", auth, allowRoles("ADMIN"), getTables);
router.post("/admin/tables", auth, allowRoles("ADMIN"), createTable);
router.put("/admin/tables/:id", auth, allowRoles("ADMIN"), updateTable);
router.delete("/admin/tables/:id", auth, allowRoles("ADMIN"), deleteTable);

export default router;
