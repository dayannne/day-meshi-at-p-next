import React from "react";

import { StoreConnectedGoogleMap } from "@/components/google-maps";
import { getPublicGoogleMapsEnv } from "@/lib/google-maps/env";
import { NavigationSidebar } from "@/components/layout/NavigationBar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { apiKey, mapId } = getPublicGoogleMapsEnv();

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      {/* --- 1. 縦のメニューバー (x0) --- */}
      <NavigationSidebar />
      {/* --- コンテンツエリアのコンテナ --- */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* --- 2. お店リストなどが表示される部分 (x80〜) --- */}
        <main className="relative z-10 flex h-full flex-1 flex-row overflow-hidden">
          <aside className="bg-background flex h-full w-120 flex-col border-r border-slate-200">
            {/* 検索・フィルター・リストの中身 */}
            <div className="text-muted-foreground flex-1 bg-gray-50/50 p-4 italic">{children}</div>
          </aside>

          {/* マップ部分：残りの幅をすべて使い、一番背面に配置 */}
          <section className="h-full flex-1 bg-slate-50">
            <div className="h-full w-full">
              <StoreConnectedGoogleMap
                apiKey={apiKey}
                mapId={mapId}
                mapInstanceId="home-google-map"
              />
            </div>
          </section>
        </main>

        {/* --- 3. マップの上にモーダル（オーバーレイ）をおける部分 --- */}
        {/* pointer-events-none を指定して、下のマップ操作を邪魔しないようにします */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div id="map-overlay-root" className="relative h-full w-full">
            {/* ポータルや状態管理でここへコンテンツを差し込む想定 */}
          </div>
        </div>
      </div>
    </div>
  );
}
