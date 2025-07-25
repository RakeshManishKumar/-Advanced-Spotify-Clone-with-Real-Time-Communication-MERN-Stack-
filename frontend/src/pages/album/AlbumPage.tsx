import { useParams } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import AlbumPageSkeleton from "@/components/skeletons/AlbumPageSkeleton";
import { usePlayerStore } from "@/stores/usePlayerStore";

// Beautiful gradient colors for albums
const albumGradients = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
];

// Function to get a consistent gradient based on album ID
const getAlbumGradient = (albumId: string) => {
  const hash = albumId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0); 
  return albumGradients[Math.abs(hash) % albumGradients.length];
};

// eslint-disable-next-line react-refresh/only-export-components
export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { currentAlbum, fetchAlbumById, isAlbumLoading } = useMusicStore();

  const { currentSong, isPLaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isAlbumLoading || !currentAlbum) {
    return <AlbumPageSkeleton />;
  }

  const handlePlayAlbum = () =>
  {
     const isCurrentAlbumPlaying  = currentAlbum?.songs.some((song) => song._id === currentSong?._id)
     if(isCurrentAlbumPlaying) togglePlay();
     else 
     {
      //  start the album
      playAlbum(currentAlbum?.songs, 0)
     }
  }
  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index);
  };
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Background Gradient */}
        <div className="relative min-h-full">
          <div
            className={`absolute inset-0 bg-gradient-to-b ${getAlbumGradient(
              currentAlbum._id
            )}/80 via-zinc-900/80
            to-zinc-900 pointer-events-none transition-all duration-500`}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentAlbum.imageUrl}
                alt={currentAlbum.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum.artist}
                  </span>
                  <span>• {currentAlbum.songs?.length || 0} songs</span>
                  <span>• {currentAlbum.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* play button */}

            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
              onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all"
              >
                {isPLaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-black"/>
                ): (
                  <Play className="h-7 w-7 text-black" />
                )
              }
              </Button>
            </div>

            {/* table section */}

            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              {/* song list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        onClick={() => handlePlaySong(index)}
                        key={song._id}
                        className={` grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm pext-zinc-4000 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPLaying ? (
                            <div className="size-4 text-greneen-500">♫</div>
                          ) : (
                            <span className="group-hover:block">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />
                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div className="text-zinc-400">{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
