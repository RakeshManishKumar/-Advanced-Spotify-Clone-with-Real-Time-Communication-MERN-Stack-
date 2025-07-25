import { Album } from "../models/album.model.js";
import mongoose from "mongoose";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    console.log('Requested albumId:', albumId);
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Invalid album ID format" });
    }
    const album = await Album.findById(albumId).populate("songs");
    if (!album) {
      return res.status(404).json({ message: "album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    console.error('Error in getAlbumById:', error);
    next(error);
  }
};