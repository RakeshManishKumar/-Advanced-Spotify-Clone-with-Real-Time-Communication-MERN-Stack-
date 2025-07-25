import { Router } from "express";
const router = Router();
import { portectRoute, requireAdmin } from "../middleware/auth.middleware.js";

import { getStats } from "../controller/stat.controller.js";
router.get("/", portectRoute,requireAdmin,getStats);

export default router;
 