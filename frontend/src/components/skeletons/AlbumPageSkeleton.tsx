// import React from 'react';
import { ScrollArea } from "@radix-ui/react-scroll-area";

const AlbumPageSkeleton = () => {
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Background Gradient */}
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
            to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              {/* Album image skeleton */}
              <div className="w-[240px] h-[240px] bg-zinc-800 rounded animate-pulse"></div>
              
              {/* Album info skeleton */}
              <div className="flex flex-col justify-end">
                <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse mb-2"></div>
                <div className="w-64 h-16 bg-zinc-800 rounded animate-pulse mb-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Play button skeleton */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <div className="w-14 h-14 bg-zinc-800 rounded-full animate-pulse"></div>
            </div>

            {/* Table skeleton */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table header skeleton */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2">
                <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>

              {/* Song list skeleton */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2">
                      <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse mb-1"></div>
                          <div className="w-24 h-3 bg-zinc-800 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
                      <div className="w-12 h-4 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPageSkeleton; 