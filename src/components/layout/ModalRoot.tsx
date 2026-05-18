"use client";

import { useModalStore } from "@/stores/useModalStore";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ModalRoot() {
  const { isOpen, content, closeModal, openModal } = useModalStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL 쿼리에 기반하여 모달 복구
  useEffect(() => {
    const modalType = searchParams.get("modal");
    const id = searchParams.get("id");

    console.log("ModalRoot useEffect triggered:", { modalType, id, isOpen });

    if (modalType === "PLACE_DETAIL" && id) {
      if (!isOpen) {
        console.log("Opening modal from URL");
        openModal({ type: "PLACE_DETAIL", data: { id } });
      }
    }
  }, [searchParams, isOpen, openModal]);

  const handleClose = () => {
    closeModal();
    // 쿼리 파라미터 제거
    router.replace(pathname);
  };

  if (!isOpen) return null;

  const root = document.getElementById("map-overlay-root");
  if (!root) return null;

  return createPortal(
    <div className="pointer-events-none absolute inset-0 z-10 flex" onClick={handleClose}>
      <div className="relative flex-1 py-20 pl-8">
        <div
          className="pointer-events-auto h-full w-120 overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* content가 객체 형태(데이터 기반)일 경우 렌더링 로직 처리 필요 */}
          {typeof content === "object" && content !== null && "type" in content ? (
            <div>모달 내용: {JSON.stringify(content)}</div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>,
    root
  );
}
