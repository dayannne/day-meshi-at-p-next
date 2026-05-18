import { create } from "zustand";

type ModalContent = React.ReactNode | { type: string; data: Record<string, unknown> };

interface ModalState {
  isOpen: boolean;
  content: ModalContent | null;
  history: ModalContent[];
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
  pushContent: (content: ModalContent) => void;
  popContent: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  history: [],
  openModal: (content) => set({ isOpen: true, content, history: [] }),
  closeModal: () => set({ isOpen: false, content: null, history: [] }),
  pushContent: (newContent) =>
    set((state) => ({
      history: state.content ? [...state.history, state.content] : state.history,
      content: newContent,
    })),
  popContent: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const newHistory = [...state.history];
      const prev = newHistory.pop();
      return { content: prev, history: newHistory };
    }),
}));
