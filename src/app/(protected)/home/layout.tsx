import React from "react";

import { StoreConnectedGoogleMap } from "@/components/google-maps";
import { getPublicGoogleMapsEnv } from "@/lib/google-maps/env";
import { NavigationSidebar } from "@/components/layout/NavigationBar";
import ModalRoot from "@/components/layout/ModalRoot";
import ModalTestButton from "@/components/layout/ModalTestButton";

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
          <aside className="flex h-full w-120 flex-col border-r border-slate-200 bg-white">
            {/* テスト用ボタンを配置 */}
            <div className="p-4">
              <ModalTestButton />
            </div>
            {/* 検索・フィルター・リストの中身 */}
            {children}
          </aside>

          {/* マップ部分：残りの幅をすべて使い、一番背面に配置 */}
          <section className="relative h-full flex-1 bg-slate-50">
            <div className="h-full w-full">
              <StoreConnectedGoogleMap
                apiKey={apiKey}
                mapId={mapId}
                mapInstanceId="home-google-map"
              />
              <div id="map-overlay-root">
                <ModalRoot />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
