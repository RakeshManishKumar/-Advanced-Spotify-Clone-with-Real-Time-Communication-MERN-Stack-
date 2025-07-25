import { usePlayerStore } from "@/stores/usePlayerStore";
import {  useEffect, useRef } from "react";

const AudiPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const preSongRef = useRef<string | null>(null);

  const { currentSong, isPLaying, playNext } = usePlayerStore();

  // handle play and pause logic
  useEffect(() => {
    if (isPLaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPLaying]);

  // handle song end
  useEffect(() => {
    const handleEnded = () => {
      playNext();
    };

    const audio = audioRef.current;
    audio?.addEventListener("ended", handleEnded);

    return () => {
      audio?.removeEventListener("ended", handleEnded);
    };
  }, [playNext]);

// handle song changes
  useEffect(() => {
    if(!audioRef.current || !currentSong) return
    const audio = audioRef.current;
    if(currentSong?.audioUrl !== preSongRef.current)
    {
      audio.src = currentSong?.audioUrl;

      // reset the playbaack position
      audio.currentTime = 0;
      preSongRef.current = currentSong?.audioUrl  ;
      if(isPLaying) audio.play();
    }
  }, [currentSong, isPLaying]);
 
 
  return (
    <audio ref={audioRef} src={currentSong?.audioUrl} />
  );
};

export default AudiPlayer;
