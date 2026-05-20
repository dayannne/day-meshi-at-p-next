import Link from "next/link";
import { requireActiveUser } from "@/features/auth/access";
import { NicknameEditForm } from "@/features/profile/components/NicknameEditForm";
import { getBookmarkedPlacesAction } from "@/features/places/actions";
import { PlaceList } from "@/features/places/components/PlaceList";
import { createClient } from "@/lib/supabase/server";
import { buildPlacesHref, PLACE_DETAIL_PANEL } from "../places/_panel/panelLinks";
import { MapMarkersSync } from "@/components/google-maps";
import { toPlaceMarkers } from "@/features/places/placeMarkers";

export default async function Mypage() {
  const user = await requireActiveUser();
  const supabase = await createClient();

  const [reviewsCountResult, bookmarksCountResult, bookmarkedPlaces] = await Promise.all([
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.userId),
    supabase
      .from("place_bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.userId),
    getBookmarkedPlacesAction(3),
  ]);

  const stats = {
    reviews: reviewsCountResult.count ?? 0,
    bookmarks: bookmarksCountResult.count ?? 0,
  };

  const placeDetailHrefs = Object.fromEntries(
    bookmarkedPlaces.map((place) => [
      place.id,
      buildPlacesHref("", {
        page: 1,
        panel: PLACE_DETAIL_PANEL,
        placeId: place.id,
      }),
    ])
  );

  const placeMarkers = toPlaceMarkers(bookmarkedPlaces).map((marker) => ({
    ...marker,
    href: placeDetailHrefs[marker.id],
  }));

  return (
    <>
      <MapMarkersSync source="bookmarks" markers={placeMarkers} />
      <div className="flex flex-col gap-4 border-b border-b-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">マイページ</h1>
        <div className="bg-primary-background flex w-full flex-col gap-4 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <NicknameEditForm initialNickname={user.nickname} />
            </div>
          </div>
          <div className="flex w-full gap-6">
            <Link
              href="/home/mypage/reviews"
              className="flex-1 rounded-lg bg-white p-2 text-center transition-colors hover:bg-slate-50"
            >
              <p className="text-primary text-xl font-bold">{stats.reviews}</p>
              <p className="text-xs text-slate-500">レビュー</p>
            </Link>
            <Link
              href="/home/bookmarks"
              className="flex-1 rounded-lg bg-white p-2 pb-0 text-center transition-colors hover:bg-slate-50"
            >
              <p className="text-primary text-xl font-bold">{stats.bookmarks}</p>
              <p className="text-xs text-slate-500">ブックマーク</p>
            </Link>
          </div>
        </div>
      </div>

      {/* マイレビューセクション */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4">
        <div className="flex items-center">
          <h2 className="flex-1 text-sm font-bold">マイレビュー</h2>
          <Link
            href="/home/mypage/reviews"
            className="text-primary cursor-pointer text-sm hover:underline"
          >
            全てのレビュー
          </Link>
        </div>

        {/* TODO: レビューコンポーネントの導入 */}
        <div className="flex items-center justify-center py-10 text-sm text-slate-500">
          まだレビュー가ありません
        </div>
      </div>

      {/* ブックマークセクション */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center">
          <h2 className="flex-1 text-sm font-bold">
            ブックマーク{" "}
            <span className="font-medium text-slate-500">({bookmarkedPlaces.length ?? 0})</span>
          </h2>
          <Link href="/home/bookmarks" className="text-primary text-sm hover:underline">
            全てのブックマーク
          </Link>
        </div>

        {bookmarkedPlaces.length > 0 ? (
          <PlaceList places={bookmarkedPlaces} placeDetailHrefs={placeDetailHrefs} />
        ) : (
          <div className="flex items-center justify-center py-10 text-sm text-slate-500">
            まだブックマークした店がありません
          </div>
        )}
      </div>
    </>
  );
}
