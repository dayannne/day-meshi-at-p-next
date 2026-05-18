"use client";

import { useModalStore } from "@/stores/useModalStore";
import { X, ChevronLeft } from "lucide-react"; // 프로젝트에 lucide-react가 있다고 가정

interface ModalContentWrapperProps {
  title: string;
  children: React.ReactNode;
  onNext?: () => void;
}

export default function ModalContentWrapper({ title, children, onNext }: ModalContentWrapperProps) {
  const { closeModal, popContent, history } = useModalStore();

  console.log(history);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button onClick={popContent} className="rounded-full p-1 hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <button onClick={closeModal} className="rounded-full p-1 hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>

      <div className="min-h-[200px]">{children}</div>

      {onNext && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            次へ
          </button>
        </div>
      )}
    </>
  );
}
