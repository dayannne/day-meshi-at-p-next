import React from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* --- 1. 縦のメニューバー (x0) --- */}
      <aside className="w-[80px] h-full border-r border-slate-200 bg-card flex flex-col items-center py-4 z-30"></aside>

      {/* --- コンテンツエリアのコンテナ --- */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* --- 2. お店リストなどが表示される部分 (x80〜) --- */}
        <main className="relative z-10 h-full flex-1 flex flex-row overflow-hidden">
          <aside className="w-[560px] h-full border-r border-slate-200 bg-background flex flex-col">
            {/* 検索・フィルター・リストの中身 */}
            <div className="flex-1 bg-gray-50/50 p-4 italic text-muted-foreground">{children}</div>
          </aside>

          {/* マップ部分：残りの幅をすべて使い、一番背面に配置 */}
          <section className="flex-1 h-full bg-blue-50">
            <div className="w-full h-full flex items-center justify-center text-blue-300 font-bold">
              [ Google Map Canvas ]
            </div>
          </section>
        </main>

        {/* --- 3. マップの上にモーダル（オーバーレイ）をおける部分 --- */}
        {/* pointer-events-none を指定して、下のマップ操作を邪魔しないようにします */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div id="map-overlay-root" className="w-full h-full relative">
            {/* ポータルや状態管理でここへコンテンツを差し込む想定 */}
          </div>
        </div>
      </div>
    </div>
  );
}
