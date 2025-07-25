import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import type { Album } from "@/types/index.ts";
import type { Song } from "@/types/index.ts";
import type { Stats } from "@/types/index.ts";
import toast from "react-hot-toast";
// import { Album } from "lucide-react";

interface MusicStoreState {
  album: Album[];
  songs: Song[];
  isLoading: boolean;
  isAlbumLoading: boolean;
  currentAlbum: Album | null;
  error: string | null;
  featuredSongs : Song[],
  trendingSongs : Song[],
  madeForYouSongs : Song[],

  stats : Stats
    

  fetchAlbum: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchStats : () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
}

export const useMusicStore = create<MusicStoreState>((set) => ({
  album: [],
  songs: [],
  isLoading: false,
  isAlbumLoading: false,
  error: null,
  currentAlbum: null,

  featuredSongs: [],
  trendingSongs: [],
  madeForYouSongs: [],

  
  stats :{
    totalSongs : 0,
    totalAlbums : 0,
    totalUsers : 0,
    totalArtists : 0
  },


  deleteAlbum: async (albumId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/api/admin/album/${albumId}`);
  
      set((state) => ({
        album: state.album.filter((album) => album._id !== albumId),
        songs: state.songs.map((song) =>
          song.albumId === albumId ? { ...song, albumId: null } : song
        ),
      }));
  
      toast.success("Album deleted successfully");
    } catch (error) {
      console.log("problem in deleting album", error);
      toast.error("Failed to delete album");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (songId: string) => {
   set({isLoading: true, error: null});
    try {
      await axiosInstance.delete(`/api/admin/songs/${songId}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== songId),
      }));
      toast.success("Song deleted successfully");
   } catch (error) {
    console.log("problem in deleting song",error);
    toast.error("Failed to delete song");
   } finally {
    set({isLoading: false});
   }
  },

   fetchSongs: async () => {
     set({ isLoading: true, error: null });
     try {
      const response = await axiosInstance.get("/api/songs");
      set({ songs: response.data });
     } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
     } finally {
      set({ isLoading: false });  
     }
   },
   fetchStats: async () => {
     set({ isLoading: true, error: null });
     try {
      console.log("Fetching stats from frontend...");
      const response = await axiosInstance.get("/api/stats");
      console.log("Stats response:", response.data);
      set({ stats: response.data });  
     } catch (error) {
      console.error("Error fetching stats:", error);
      set({ error: (error as Error).message, isLoading: false });
     }
     finally {
      set({ isLoading: false });  
     }  
   },

  fetchAlbum: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/album");
      set({ album: response.data });
    } catch (error) {
      console.log("problem in fetching album");
      set({ error: (error as Error).message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (albumId: string) => {
    set({ isAlbumLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/album/${albumId}`);
      set({ currentAlbum: response.data });
    } catch (error) {
      set({ error: (error as Error).message, isAlbumLoading: false });
    } finally {
      set({ isAlbumLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await axiosInstance.get("/api/songs/featured");
    set({ featuredSongs: response.data });
  } catch (error) {
    set({ error: (error as Error).message, isLoading: false });
  }
  finally{
    set({isLoading: false})
  }
  },
  fetchMadeForYouSongs: async () => {
   set({ isLoading: true, error: null });
  try {
    const response = await axiosInstance.get("/api/songs/made-for-you");
    set({ madeForYouSongs: response.data });
  } catch (error) {
    set({ error: (error as Error).message, isLoading: false });
  }
  finally{
    set({isLoading:false})
  }
  },
  fetchTrendingSongs: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await axiosInstance.get("/api/songs/trending");
    set({ trendingSongs: response.data });
  } catch (error) {
    set({ error: (error as Error).message, isLoading: false });
  }
  finally{
    set({isLoading:false})
  }
  },
}));

