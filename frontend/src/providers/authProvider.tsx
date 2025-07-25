import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";


const updateApiToken = (token: string | null) => {
  if (token) { 
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Token set successfully");
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    console.log("Token removed");
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {initializeSocket,disconnectSocket} = useChatStore();
  const { getToken, isSignedIn,userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const {checkAdminStatus} = useAuthStore();
  useEffect(() => {      
    const initAuth = async () => {
      try {
        const token = await getToken();
        if (isSignedIn) {
          updateApiToken(token);
        } else {
          updateApiToken(null);
        }
        if(token)
        {
          if(userId) initializeSocket(userId);
        }
      } catch (error) {
        console.log("Error in AuthProvider:", error);
        updateApiToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // clean up function
    return () => disconnectSocket();
  }, [getToken, isSignedIn,userId,checkAdminStatus,initializeSocket,disconnectSocket]);

  // Add token refresh on auth state changes
  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          updateApiToken(token);
        } catch (error) {
          console.log("Error refreshing token:", error);
        }
      }
    };

    handleTokenRefresh();
  }, [isSignedIn, getToken]);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
