import { axiosInstance } from '@/lib/axios';
import type { Message, User } from '@/types';
// import type { S } from 'node_modules/@clerk/clerk-react/dist/useAuth-DN6TRwS8.d.mts';
// import type { promises } from 'dns';
import { create } from 'zustand'
import { io } from "socket.io-client";
// import { get } from 'http';

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;

  socket: any;
  isconected: boolean;
  onlineUsers: Set<String>;
  userActivities: Map<String, String>;
  messages: Message[];
  selectedUser:User|null


  fetchUsers: () => Promise<void>
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void
  fetchMessages: (userId: string) => Promise<void>
  setSelectedUser:(user:User|null)=>void
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/" ;
const socket = io(
  baseURL, {
  autoConnect: false,
  withCredentials: true
}
);

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isconected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,
  setSelectedUser: (user) => { set({ selectedUser: user }); },
  fetchUsers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get('/api/users')
      set({ users: response.data })
    } catch (error) {
      set({ error: error as string, isLoading: false })
    }
    finally {
      set({ isLoading: false })
    }
  },
  initializeSocket: (userId: string) => {
    if (!get().isconected) {
      socket.auth = { userId }
      socket.connect();
      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      })

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      })

      socket.on("user_connected", (userId: string) => {
        set(() => ({ onlineUsers: new Set([...get().onlineUsers, userId]) }))
      })

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineusers = new Set(state.onlineUsers);
          newOnlineusers.delete(userId);
          return { onlineUsers: newOnlineusers };
        })
      })
      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });
      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message]
        }))
      });


      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message]
        }))
      })

      socket.on("update_activity", ({ userId, activity }: any) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        })
      })
      set({ isconected: true });

    }
  },
  disconnectSocket: () => {
    if (get().isconected) {
      socket.disconnect();
      set({ isconected: false })
    }
  },
  sendMessage: (receiverId: string, senderId: string, content: string) => {
    if(!socket) return;
    socket.emit("send_message",{ senderid: senderId, receiverId, content });
  },
  fetchMessages : async(userId:string)=>
  {
    set({isLoading:true,error:null});
    try {
			const response = await axiosInstance.get(`/api/users/messages/${userId}`);
      set({messages:response.data})
    } catch (error) {
      console.log("error in fetching messages");
    }
    finally{
      set({isLoading:false})
    }
  }
}))

