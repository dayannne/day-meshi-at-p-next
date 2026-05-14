import { MapMarkersSync } from "@/components/google-maps";
import { getPlacesAction } from "@/features/places/actions";
import { PlacesList } from "@/features/places/components/PlacesList";
import { PlacesPagination } from "@/features/places/components/PlacesPagination";
import { toPlaceMarkers } from "@/features/places/placeMarkers";

const PLACES_PAGE_SIZE = 20;

type ExplorePageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function parsePageParam(value: string | string[] | undefined): number {
  const page = Array.isArray(value) ? value[0] : value;
  const parsedPage = Number(page);

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { page } = await searchParams;
  const requestedPage = parsePageParam(page);
  const { places, pagination } = await getPlacesAction({
    page: requestedPage,
    pageSize: PLACES_PAGE_SIZE,
  });
  const markers = toPlaceMarkers(places);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden not-italic">
      <MapMarkersSync source="places" markers={markers} />
      <h2 className="text-xl font-bold text-slate-950">お店を検索</h2>
      {/* <SearchFilterBar /> */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <p className="mt-1 text-sm text-slate-500">お店一覧 ({pagination.totalCount}件)</p>
        <PlacesList places={places} />
      </div>
      <PlacesPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      />
    </div>
  );
}
