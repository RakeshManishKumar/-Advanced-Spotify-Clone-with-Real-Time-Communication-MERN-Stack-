import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { Album, Music } from "lucide-react";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import SongsTabContent from "./components/SongsTAbContent";

const AdminPage = () => {
  const { isAdmin, isLoading, checkAdminStatus } = useAuthStore();
  const { fetchAlbum, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    // Add a small delay to ensure auth provider has finished loading
    const timer = setTimeout(() => {
      checkAdminStatus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [checkAdminStatus]);

  useEffect(() => {
    // Only fetch data if user is admin
    if (isAdmin) {
      fetchAlbum();
      fetchSongs();
      fetchStats();
    }
  }, [isAdmin, fetchAlbum, fetchSongs, fetchStats]);

  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 p-8 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show unauthorized only after loading is complete and user is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 p-8 flex items-center justify-center">
        <div className="text-white">Unauthorized</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 p-8">
      <Header />
      <DashboardStats />

      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700 cursor-pointer"
          >
            <Music className="mr-2 size-4 cursor-pointer" />
            Songs
          </TabsTrigger>

          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-700 cursor-pointer"
          >
            <Album className="mr-2 size-4 cursor-pointer" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
