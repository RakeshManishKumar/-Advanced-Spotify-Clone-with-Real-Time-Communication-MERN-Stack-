import { getAllAlbums, getAlbumById } from "../controller/album.controller.js";
import { Router } from "express";
const router  = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;