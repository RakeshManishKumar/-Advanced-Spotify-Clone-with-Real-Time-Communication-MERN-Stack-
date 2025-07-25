
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";  
export const getStats = async (req, res, next) => {
  try {
    console.log("Fetching stats...");
    
    // Get total counts using Promise.all for better performance
    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] = await Promise.all([
      Song.countDocuments(),   
      User.countDocuments(),
      Album.countDocuments(),
      Song.aggregate([
        {
          $group: {
            _id: "$artist"
          }
        },
        {
          $count: "count"
        }
      ])
    ]);

    console.log("Stats results:", {
      totalSongs,
      totalUsers,
      totalAlbums,
      uniqueArtists: uniqueArtists[0]?.count || 0
    });

    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
}