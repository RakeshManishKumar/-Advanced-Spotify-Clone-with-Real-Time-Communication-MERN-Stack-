import  { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { axiosInstance } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

const AuthCallBack = () => {
const Navigate = useNavigate();
const {isLoaded,user} = useUser();

const syncAttempted = useRef(false);
  useEffect(() => {
      const syncUser = async () => {
       if (!isLoaded || !user || syncAttempted.current) {
            console.log('User not loaded or not available');
            return;
          }
        try {
          syncAttempted.current = true;
          
          console.log('Syncing user data:', {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
          });
          
          const response = await axiosInstance.post('/api/auth/sync-user', {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
          });
          
          console.log('User sync response:', response.data);
        } catch (error) {
          console.error("Error in sync user:", error);
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response: { data: unknown; status: number } };
            console.error("Response data:", axiosError.response.data);
            console.error("Response status:", axiosError.response.status);
          }
        } finally {
          Navigate('/');
        }
      }
      syncUser();
  },[isLoaded,user,Navigate]);
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <Loader className="size-8 text-emerald-500 animate-spin" />
        <h3 className="text-zinc-200 text-xl font-semibold">Logging you in</h3>
        <p className="text-zinc-400 text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthCallBack;
