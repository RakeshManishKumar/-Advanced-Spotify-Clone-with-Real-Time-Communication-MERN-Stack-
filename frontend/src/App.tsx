import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage.tsx";
import AuthCallBack from "./pages/auth-callback/AuthCallBack.tsx";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layouts/MainLayout.tsx";
import ChatPage from "./pages/chat/ChatPage.tsx";
import AlbumPage from "./pages/album/AlbumPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import { Toaster } from "react-hot-toast";
import NotFoundage from "./pages/404/NotFoundage.tsx";

function App() {
  return (
    <>
      <Routes> 
        <Route path='/sso-callback' element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth-callback"}/>}/>
        <Route path="/auth-callback" element={<AuthCallBack />} />
         <Route path="/admin" element={<AdminPage />} />
        
<Route element = {<MainLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/chat" element={<ChatPage />} />
  <Route path="/album/:albumId" element={<AlbumPage />} />    
  <Route path="/*" element={<NotFoundage />} />
</Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
