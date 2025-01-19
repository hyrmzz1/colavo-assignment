import { create } from 'zustand';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

const calculateTotalPrice = (
  services: Map<string, ServiceItemProps>
): number => {
  return Array.from(services.values()).reduce(
    (total, service) => total + service.price * (service.count ?? 1),
    0
  );
};

interface CartState {
  // 선택된(장바구니에 반영되는) 시술 및 할인 목록
  selectedServices: Map<string, ServiceItemProps>;
  selectedDiscounts: Map<string, DiscountItemProps>;
  totalPrice: number;

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

  // 특정 시술 항목의 count 설정
  setServiceCount: (key: string, count: number) => void;

  // 장바구니에서 할인 항목 제거
  removeDiscountItem: (key: string) => void;
}

const useCartStore = create<CartState>((set, get) => ({
  selectedServices: new Map(),
  selectedDiscounts: new Map(),
  totalPrice: 0,

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
    set((state) => {
      const newSelectedServices = new Map(state.localSelectedServices);
      const newSelectedDiscounts = new Map(state.localSelectedDiscounts);
      const newTotalPrice = calculateTotalPrice(newSelectedServices);

      if (
        newSelectedServices.size === state.selectedServices.size &&
        newSelectedDiscounts.size === state.selectedDiscounts.size &&
        newTotalPrice === state.totalPrice
      ) {
        return state;
      }

      return {
        selectedServices: newSelectedServices,
        selectedDiscounts: newSelectedDiscounts,
        totalPrice: newTotalPrice,
      };
    }),

  resetLocalSelections: () =>
    set(() => ({
      localSelectedServices: new Map(get().selectedServices),
      localSelectedDiscounts: new Map(get().selectedDiscounts),
    })),

  isServiceSelected: (key) => get().localSelectedServices.has(key),
  isDiscountSelected: (key) => get().localSelectedDiscounts.has(key),

  setServiceCount: (key: string, count: number) =>
    set((state) => {
      const newSelectedServices = new Map(state.selectedServices);
      const service = newSelectedServices.get(key);
      if (!service || service.count === count) return state;

      count > 0
        ? newSelectedServices.set(key, { ...service, count })
        : newSelectedServices.delete(key);

      return {
        selectedServices: newSelectedServices,
        totalPrice: calculateTotalPrice(newSelectedServices),
      };
    }),

  removeDiscountItem: (key) =>
    set((state) => {
      const newSelectedDiscounts = new Map(state.selectedDiscounts);
      if (!newSelectedDiscounts.has(key)) return state;
      newSelectedDiscounts.delete(key);

      const newLocalSelectedDiscounts = new Map(state.localSelectedDiscounts);
      newLocalSelectedDiscounts.delete(key);

      return {
        selectedDiscounts: newSelectedDiscounts,
        localSelectedDiscounts: newLocalSelectedDiscounts,
      };
    }),
}));

export default useCartStore;
