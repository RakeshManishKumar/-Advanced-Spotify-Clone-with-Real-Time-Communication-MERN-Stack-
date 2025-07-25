import {  SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react"
import { Link } from "react-router-dom"
import SignInOAuthButton from "./SignInOAuthButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const TopBar = () => {
  const {isAdmin, checkAdminStatus} = useAuthStore();
  console.log("isAdmin",isAdmin);
  
  // Check admin status when component mounts  
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);
  
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center text-white ml-1 text-balance">
       
       <img src="/spotify.png" alt="spotify logo" className="size-8"/>
       Spotify
      </div>
      
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to="/admin"  className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-[180px] justify-start text-white hover:bg-zinc-400",
              })
            )}>
            <LayoutDashboardIcon className="size-4 mr-2"/>
            Admin Dashboard
          </Link>
        )}
        
        {/* Show user info and sign out when signed in */}
        {/* Show sign in button when not signed in */}
        <SignedOut>
          <SignInOAuthButton />
        </SignedOut>
<UserButton/>
      </div>
    </div>
  )
}

export default TopBar
