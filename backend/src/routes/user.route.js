import { Router } from "express";

import { portectRoute } from "../middleware/auth.middleware.js";

import { getAllUsers } from "../controller/user.controller.js";

import { getMessages } from "../controller/user.controller.js";



const router  = Router();
router.get('/',portectRoute,getAllUsers);

router.get("/messages/:userId", portectRoute, getMessages);
export default router;