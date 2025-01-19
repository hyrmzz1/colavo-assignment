import { create } from 'zustand';

export type ViewType = 'cart' | 'service' | 'discount';

interface ViewState {
  currView: ViewType;
  setView: (view: ViewType) => void;
}

const useViewStore = create<ViewState>((set) => ({
  currView: 'cart',
  setView: (view) => set({ currView: view }),
}));

export default useViewStore;
