import { Router } from "express";
import { getAllSongs } from "../controller/song.controller.js";
import { portectRoute, requireAdmin } from "../middleware/auth.middleware.js";
const router  = Router();
import { getTrendingSongs } from "../controller/song.controller.js";
import { madeForYou } from "../controller/song.controller.js";
import { getFeaturedSongs } from "../controller/song.controller.js";


router.get('/', portectRoute,requireAdmin,getAllSongs);

router.get('/featured',getFeaturedSongs);

router.get('/made-for-you' ,madeForYou);


router.get('/trending',getTrendingSongs);
export default router;