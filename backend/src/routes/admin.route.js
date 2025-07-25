import { Router } from "express";
import { createSong } from "../controller/admin.controller.js";
import { portectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { deleteSong } from "../controller/admin.controller.js";
const router  = Router();

import { createAlbum } from "../controller/admin.controller.js";
import { deleteAlbum } from "../controller/admin.controller.js";

import { checkAdmin } from "../controller/admin.controller.js";

// to check whether the user is admin or not (only needs authentication, not admin privileges)
router.get("/check", portectRoute, checkAdmin);

// first of all check the user is authenticated and admin or not so don't need to include in all the routes
router.use(portectRoute, requireAdmin);

router.post('/songs',createSong);
router.delete('/songs/:id',deleteSong);

router.post('/album', createAlbum);

router.delete('/album/:id',deleteAlbum);

export default router;