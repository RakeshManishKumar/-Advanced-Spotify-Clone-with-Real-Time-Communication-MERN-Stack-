// import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import TopBar from "../../components/TopBar.tsx";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import SectionGrid from "./components/SectionGrid.tsx";
import { usePlayerStore } from "@/stores/usePlayerStore.ts";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchTrendingSongs,
    fetchMadeForYouSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

const {initaializeQueue} = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchTrendingSongs();
    fetchMadeForYouSongs();
  }, [fetchFeaturedSongs, fetchTrendingSongs, fetchMadeForYouSongs]);
  

useEffect(()=>{
  if(madeForYouSongs.length>0 && featuredSongs.length>0 && trendingSongs.length>0){
  const allSongs = [...featuredSongs,...madeForYouSongs,...trendingSongs];
  initaializeQueue(allSongs);
  }
} , [initaializeQueue,madeForYouSongs,featuredSongs,trendingSongs]
)
  console.log({ isLoading, madeForYouSongs, featuredSongs, trendingSongs });

  return (
    <div className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900 min-h-screen bg-black rounded-md overflow-hidden ">
      <TopBar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4  sm:p-6">
          <h1 className="text-2xl font-bold text-white sm:text-3xl mb-6">
            Good Afternoon
          </h1>
          <FeaturedSection />
        <div className="space-y-8">
         <SectionGrid title="Made for you" songs={madeForYouSongs} isLoading={isLoading}/>
         <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading}/>
        </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HomePage;
