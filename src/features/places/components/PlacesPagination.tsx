import Link from "next/link";

type PlacesPaginationProps = {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

const MAX_VISIBLE_PAGES = 5;

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  const visibleCount = Math.min(MAX_VISIBLE_PAGES, totalPages);
  const half = Math.floor(visibleCount / 2);
  const start = Math.min(Math.max(1, currentPage - half), totalPages - visibleCount + 1);

  return Array.from({ length: visibleCount }, (_, index) => start + index);
}

function getPlacesPageHref(page: number): string {
  return `/home/places?page=${page}`;
}

export function PlacesPagination({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
}: PlacesPaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav aria-label="Places pagination" className="flex flex-wrap items-center gap-2 text-sm">
      {hasPreviousPage ? (
        <Link href={getPlacesPageHref(currentPage - 1)} className="underline">
          前へ
        </Link>
      ) : (
        <span aria-disabled="true">前へ</span>
      )}

      {visiblePages.map((page) =>
        page === currentPage ? (
          <span key={page} aria-current="page">
            {page}
          </span>
        ) : (
          <Link key={page} href={getPlacesPageHref(page)} className="underline">
            {page}
          </Link>
        )
      )}

      {hasNextPage ? (
        <Link href={getPlacesPageHref(currentPage + 1)} className="underline">
          次へ
        </Link>
      ) : (
        <span aria-disabled="true">次へ</span>
      )}
    </nav>
  );
}
