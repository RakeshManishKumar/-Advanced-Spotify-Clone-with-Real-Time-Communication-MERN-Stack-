import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
// import { formatDuration } from "@/pages/album/AlbumPage.tsx";


const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayBackController = () => {
  const { togglePlay, currentSong, isPLaying, playNext, playPrevious } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      usePlayerStore.setState({ isPLaying: false });
    };
  
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef, currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto w-full">
        {/* currently playing song */}
        <div className="flex items-center gap-4 min-w-[180px] w-[30%] overflow-hidden">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
      
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="bg-white text-black rounded-full h-8 w-8 hover:bg-zinc-200 cursor-pointer transition-colors"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPLaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400 min-w-[50px] text-right pr-4">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400 min-w-[50px] text-right">{formatTime(duration)}</div>
          </div>
        </div>

        {/* volume controls */}
        <div className="flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <Laptop2 className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <Volume1 className="h-4 w-4" />
            </Button>

            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlayBackController;
