import { Outlet } from 'react-router-dom'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import LeftSideBar from './components/LeftSideBar.tsx'
import FriendsActivity from './components/FriendsActivity.tsx'
import AudiPlayer from './components/AudiPlayer.tsx'
import PlayBackController from './components/PlayBackController.tsx'
import { useEffect, useState } from 'react'

const MainLayout = () => {

const [isMobile,setIsMobile] = useState(false);

useEffect(()=>{
 const checkIfMobile = () => {
  setIsMobile(window.innerWidth < 768);
 }
 checkIfMobile();
 window.addEventListener('resize',checkIfMobile);
 return () => window.removeEventListener('resize',checkIfMobile);
},[]);



  return (
    <div className="h-screen bg-black text-white flex flex-col">
    <ResizablePanelGroup direction="horizontal" className='flex-1 flex h-full overflow-hidden p-2 [&_.bg-border]:bg-primary [&_.bg-muted]:bg-zinc-800'>
      <AudiPlayer/>
      {/* left side */}
      <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
       <LeftSideBar/>
      </ResizablePanel>

<ResizableHandle className='w-2 bg-black rounded-lg transition-colors '/>
{/* main content  */}
<ResizablePanel defaultSize={isMobile ? 80: 60}>
  <Outlet />
</ResizablePanel>

  {!isMobile && (
    <>
    <ResizableHandle className='w-2 bg-black rounded-lg transition-colors '/>

    {/* right side bar */}
    <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
<FriendsActivity/>
</ResizablePanel>
    </>
  )}
  </ResizablePanelGroup>

    {/* // footer */}
<PlayBackController/>
    </div>
  )
}

export default MainLayout