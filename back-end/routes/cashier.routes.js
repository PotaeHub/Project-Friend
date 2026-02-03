import express from "express";
import {
  getTables,
  getPackages,
  openTable,
  closeTable,
  getTableHistory,
} from "../controllers/cashier.controller.js";

import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

router.get("/cashier/tables", auth, allowRoles("CASHIER"), getTables);
router.get("/cashier/packages", auth, allowRoles("CASHIER"), getPackages);

router.post("/cashier/open-table", auth, allowRoles("CASHIER"), openTable);

router.post(
  "/cashier/close-table/:sessionId",
  auth,
  allowRoles("CASHIER"),
  closeTable,
);
router.get(
  "/cashier/tables/:tableId/history",
  auth,
  allowRoles("CASHIER"),
  getTableHistory,
);
export default router;
