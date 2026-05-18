"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface MapOverlayProps {
  children: React.ReactNode;
}

export function MapOverlay({ children }: MapOverlayProps) {
  const router = useRouter();
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex">
      <div className="relative flex-1 py-20 pl-8">
        <div className="pointer-events-auto h-full w-120 overflow-hidden rounded-2xl bg-white shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
