import {create} from 'zustand'
import type { Song } from "@/types";
import { useChatStore } from './useChatStore';

interface PlayerStore {
  currentSong : Song | null ;
  isPLaying : boolean;
  queue : Song[];
  currentIndex : number;

  initaializeQueue : (songs : Song[]) => void;
  playAlbum : (songs : Song[],startIndex : number) => void;
  setCurentSong : (song : Song|null) => void;

  togglePlay:()=>void ;
  playNext : () => void;
  playPrevious : () => void;
}

export const usePlayerStore = create<PlayerStore>((set,get) => ({
  currentSong : null,
  isPLaying : false,
  queue : [],
  currentIndex : -1,

initaializeQueue:(songs: Song[])=>{
set({
  queue:songs,
  currentSong : get().currentSong || songs[0],
  currentIndex :  get().currentIndex===-1? 0 : get().currentIndex || 0

})
},

playAlbum:(songs : Song[],startIndex = 0)=>{
if(songs.length === 0 )
{
  return;
}

const song = songs[startIndex];

const socket = useChatStore.getState().socket;
if(socket.auth)
{
  socket.emit("update_activity",
    {
     userId : socket.auth.userId,
     activity:`Playing ${song.title} by ${song.artist}`
    }
  )
}
set({
  queue:songs,
  currentSong : song,
  currentIndex : startIndex ,
  isPLaying : true

})
},

setCurentSong:(song : Song|null)=>{
  if(!song)
  {
    return;
  }

  const socket = useChatStore.getState().socket;
  if(socket.auth)
  {
    socket.emit("update_activity",
      {
       userId : socket.auth.userId,
       activity:`Playing ${song.title} by ${song.artist}`
      }
    )
  }

  const songIndex = get().queue.findIndex((s) => s._id === song._id);
  set({
    currentSong : song,
    currentIndex : songIndex!==-1 ? songIndex : get().currentIndex,
    isPLaying : true
  })
},

togglePlay:()=>{
  const willStartPlaying = !get().isPLaying;
  set({
    isPLaying : willStartPlaying
  })
  const currentSong = get().currentSong;
  const socket = useChatStore.getState().socket;
  if(socket && socket.auth) {
    socket.emit("update_activity", {
      userId: socket.auth.userId,
      activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "idle"
    });
  }
},

playNext : () => {
  const {currentIndex , queue} = get();
  const nextIndex = currentIndex+1;
  const socket = useChatStore.getState().socket;
  if(nextIndex <queue.length)
  {
    const nextsong = queue[nextIndex];
    set({
      currentSong : nextsong,
      currentIndex : nextIndex,
      isPLaying : true
    } )
    if(socket && socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${nextsong.title} by ${nextsong.artist}`
      });
    }
  }
  else
  {
    set({
      currentSong : null,
      currentIndex : -1,
      isPLaying : false
    }   )
    if(socket && socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: "idle"
      });
    }
  }
},

playPrevious : () => {
  const {currentIndex , queue} = get();
  const previousIndex = currentIndex-1; 
  const socket = useChatStore.getState().socket;
  if(previousIndex >= 0)
  {
    const previoussong = queue[previousIndex];
    set({
      currentSong : previoussong,
      currentIndex : previousIndex,
      isPLaying : true
    } )
    if(socket && socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${previoussong.title} by ${previoussong.artist}`
      });
    }
  }
  else
  {
    set({
      currentSong : null,
      currentIndex : -1,
      isPLaying : false
    }   )
    if(socket && socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: "idle"
      });
    }
  }
},  

})) 