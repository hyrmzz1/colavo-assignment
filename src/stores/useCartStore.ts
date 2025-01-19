import { create } from 'zustand';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

interface CartState {
  // 선택된(장바구니에 반영되는) 시술 및 할인 목록
  selectedServices: Map<string, ServiceItemProps>;
  selectedDiscounts: Map<string, DiscountItemProps>;

  // 시술 및 할인 페이지에서 변경 중인 (임시) 선택 항목
  localSelectedServices: Map<string, ServiceItemProps>;
  localSelectedDiscounts: Map<string, DiscountItemProps>;

  // 시술 및 할인 항목 선택/해제
  toggleLocalService: (key: string, item: ServiceItemProps) => void;
  toggleLocalDiscount: (key: string, item: DiscountItemProps) => void;

  // 현재 선택한 항목을 장바구니(selectedServices, selectedDiscounts)에 반영
  handleComplete: () => void;

  // 임시 선택 항목을 초기화 (기존 선택된 항목으로 되돌림)
  resetLocalSelections: () => void;

  // 특정 시술 또는 할인이 선택되었는지 확인
  isServiceSelected: (key: string) => boolean;
  isDiscountSelected: (key: string) => boolean;

  // 장바구니에서 시술 또는 할인 항목 제거
  removeServiceItem: (key: string) => void;
  removeDiscountItem: (key: string) => void;
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

  removeServiceItem: (key) =>
    set((state) => {
      const newMap = new Map(state.selectedServices);
      if (newMap.has(key)) {
        newMap.delete(key);
        console.log('삭제된 서비스:', key, newMap);
      }
      return { selectedServices: new Map(newMap) }; // 새로운 Map 객체로 변경
    }),

  removeDiscountItem: (key) =>
    set((state) => {
      const newMap = new Map(state.selectedDiscounts);
      if (newMap.has(key)) {
        newMap.delete(key);
        console.log('삭제된 할인:', key, newMap);
      }
      return { selectedDiscounts: new Map(newMap) }; // 새로운 Map 객체로 변경
    }),
}));

export default useCartStore;
