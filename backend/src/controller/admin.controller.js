import {Song} from '../models/song.model.js'
import { Album } from '../models/album.model.js';
import cloudnary from '../lib/cloudnary.js';
import { clerkClient } from "@clerk/express";

// helper function to upload to cloudinary
const uploadToCloudnary  = async(file) =>
{
try {
  console.log("Uploading file to Cloudinary:", {
    filename: file.name,
    size: file.size,
    mimetype: file.mimetype,
    tempFilePath: file.tempFilePath
  });

  const result  =  await cloudnary.uploader.upload(file.tempFilePath ,
    {
      resource_type : "auto" ,
    }
  )
  console.log("Cloudinary upload successful:", result.secure_url);
  return result.secure_url;
} catch (error) {
  console.error("Error in uploadToCloudinary:", error);
  throw new Error("Error uploading to cloudinary: " + error.message);
  
}
}
export const createSong = async (req,res,next)=>
{
try {
  console.log("Creating song with data:", {
    body: req.body,
    files: req.files ? Object.keys(req.files) : 'No files'
  });

  if(!req.files || !req.files.audioFile || !req.files.imageFile)
  {
   return res.status(400).json({message:"Please upload both audio and image files"})
  }
  
  const  {title,artist,albumId,duration}  = req.body;
  const audioFile =  req.files.audioFile;
  const imageFile  = req.files.imageFile;

  console.log("Uploading files to Cloudinary...");
  const audioUrl = await(uploadToCloudnary(audioFile));
  const imageUrl = await(uploadToCloudnary(imageFile));
  console.log("Files uploaded successfully:", { audioUrl, imageUrl });

  const songData = {
    title: title?.trim(),
    artist: artist?.trim(),
    audioUrl,
    imageUrl,
    duration: parseInt(duration),
    albumId : albumId || null 
  };

  console.log("Creating song with data:", songData);

  const song = new Song(songData);
  await song.save();
  console.log("Song saved successfully:", song._id);

// if song belongs  to any album then update the album's array
if(albumId)
{
  await Album.findByIdAndUpdate(albumId,{
  $push : {songs : song._id},
  })
  console.log("Updated album with new song");
}

res.status(201).json(song);

  }catch (error) {
  console.error("Error in create song:", error);
  res.status(500).json({message: "Failed to create song", error: error.message});
}
}

export const deleteSong = async (req,res,next) =>
{
  try {
    const {id} = req.params;
    const song = await  Song.findById(id);

    // if song belong to album update the album array
    if(song.albumId)
    {
      await Album.findByIdAndUpdate(song.albumId ,{
        $pull : {song : song._id},
      })
    }
    await Song.findByIdAndDelete(id);
    res.status(200).json({message:"delete the song successfully"})
  } catch (error) {
    console.log("error in delete song controller",error);
    next(error);
  }
}

export const createAlbum = async (req,res,next)=>
{
 try {
  console.log("Creating album with data:", {
    body: req.body,
    files: req.files ? Object.keys(req.files) : 'No files'
  });

  if(!req.files || !req.files.imageFile)
  {
   return res.status(400).json({message:"Please upload an image file"})
  }

  const {title,artist,releaseYear} = req.body;
  const imageFile = req.files.imageFile;

  console.log("Uploading image to Cloudinary...");
  const imageUrl = await uploadToCloudnary(imageFile);
  console.log("Image uploaded successfully:", imageUrl);

  const albumData = {
    title: title?.trim(),
    artist: artist?.trim(),
    imageUrl,
    releaseYear: parseInt(releaseYear)
  };

  console.log("Creating album with data:", albumData);

  const album = new Album(albumData);
  await album.save();
  console.log("Album saved successfully:", album._id);

  res.status(201).json(album);
  } catch (error) {
  console.error("Error in createAlbum:", error);
  res.status(500).json({message: "Failed to create album", error: error.message});
 }
}

export const deleteAlbum = async (req,res,next)=>
{
try {
  const {id} = req.params;
  await Song.deleteMany({albumId: id});
  await Album.findByIdAndDelete(id);
  res.status(200).json({message:"album deleted successfully"})
} catch (error) {
  console.error("Error in deleteAlbum:", error);
  res.status(500).json({message: "Failed to delete album", error: error.message});
}
}

export const checkAdmin = async(req,res,next)=>
{
 try {
   const auth = await req.auth();
   if(!auth || !auth.userId) {
     return res.status(401).json({admin: false, message: "Not authenticated"});
   }
   
   const currentUser = await clerkClient.users.getUser(auth.userId);
   const userEmail = currentUser?.primaryEmailAddress?.emailAddress;
   
   const isAdmin = userEmail?.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
   
   res.status(200).json({admin: isAdmin});
 } catch (error) {
   console.error("Error in checkAdmin:", error);
   res.status(500).json({admin: false, message: "Error checking admin status"});
 }
}