import { create } from 'zustand';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

interface CartState {
  selectedServices: Map<string, ServiceItemProps>;
  selectedDiscounts: Map<string, DiscountItemProps>;
  localSelectedServices: Map<string, ServiceItemProps>;
  localSelectedDiscounts: Map<string, DiscountItemProps>;
  toggleLocalService: (key: string, item: ServiceItemProps) => void;
  toggleLocalDiscount: (key: string, item: DiscountItemProps) => void;
  handleComplete: () => void;
  resetLocalSelections: () => void;
  isServiceSelected: (key: string) => boolean;
  isDiscountSelected: (key: string) => boolean;
}

const useCartStore = create<CartState>((set, get) => ({
  selectedServices: new Map(),
  selectedDiscounts: new Map(),
  localSelectedServices: new Map(),
  localSelectedDiscounts: new Map(),

  toggleLocalService: (key, item) =>
    set((state) => {
      const newMap = new Map(state.localSelectedServices);
      if (newMap.has(key)) {
        newMap.delete(key);
      } else {
        newMap.set(key, item);
      }
      return { localSelectedServices: newMap };
    }),

  toggleLocalDiscount: (key, item) =>
    set((state) => {
      const newMap = new Map(state.localSelectedDiscounts);
      if (newMap.has(key)) {
        newMap.delete(key);
      } else {
        newMap.set(key, item);
      }
      return { localSelectedDiscounts: newMap };
    }),

  handleComplete: () =>
    set((state) => ({
      selectedServices: new Map(state.localSelectedServices),
      selectedDiscounts: new Map(state.localSelectedDiscounts),
    })),

  resetLocalSelections: () =>
    set(() => ({
      localSelectedServices: new Map(get().selectedServices),
      localSelectedDiscounts: new Map(get().selectedDiscounts),
    })),

  isServiceSelected: (key) => get().localSelectedServices.has(key),
  isDiscountSelected: (key) => get().localSelectedDiscounts.has(key),
}));

export default useCartStore;
