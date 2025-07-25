import React from 'react';

const MusicLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-end gap-[1px] ${className}`} style={{ width: 24, height: 20 }}>
    <div className="w-[2px] h-3 bg-green-400 animate-music-bar1 rounded-full"></div>
    <div className="w-[2px] h-5 bg-green-500 animate-music-bar2 rounded-full"></div>
    <div className="w-[2px] h-4 bg-green-400 animate-music-bar3 rounded-full"></div>
    <div className="w-[2px] h-6 bg-green-500 animate-music-bar1 rounded-full"></div>
    <div className="w-[2px] h-2 bg-green-400 animate-music-bar2 rounded-full"></div>
  </div>
);

export default MusicLoader;

// Tailwind CSS custom animations (add to your global CSS if not present):
// .animate-music-bar1 { animation: music-bar1 1s infinite ease-in-out; }
// .animate-music-bar2 { animation: music-bar2 1s infinite ease-in-out; }
// .animate-music-bar3 { animation: music-bar3 1s infinite ease-in-out; }
// @keyframes music-bar1 { 0%,100%{height:12px} 50%{height:18px} }
// @keyframes music-bar2 { 0%,100%{height:20px} 50%{height:8px} }
// @keyframes music-bar3 { 0%,100%{height:16px} 50%{height:22px} } 