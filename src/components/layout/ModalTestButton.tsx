"use client";

import { useModalStore } from "@/stores/useModalStore";
import ModalContentWrapper from "./ModalContentWrapper";

export default function ModalTestButton() {
  const { openModal, pushContent } = useModalStore();

  const handleOpen = () => {
    openModal(
      <ModalContentWrapper
        title="first"
        onNext={() =>
          pushContent(
            <ModalContentWrapper title="second">
              <p>TEST</p>
            </ModalContentWrapper>
          )
        }
      >
        <p>TEST</p>
      </ModalContentWrapper>
    );
  };

  return (
    <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={handleOpen}>
      MODAL TEST
    </button>
  );
}
