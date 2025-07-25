import FeaturedGridSkeleton from "@/components/skeletons/FeaturedSectionSkeleton.tsx";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import PlayButton from "./PlayButton.tsx";

const FeaturedSection = () => {

  const {isLoading,featuredSongs,error} = useMusicStore();
  if(isLoading) return <FeaturedGridSkeleton/>
  if(error) return <p className="text-red mb-4 text-lg">{error}</p>
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {featuredSongs.map((song)=>(
        <div key={song._id} className=" flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative">
          <img src={song.imageUrl} alt={song.title} className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0" />
          <div className="flex-1 p-4">
            <h3 className="font-medium truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        <div><PlayButton song={song}/></div>
        </div>
      ))}
    </div>
  )
}

export default FeaturedSection
