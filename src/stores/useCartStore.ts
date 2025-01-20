import { create } from 'zustand';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

// 전체 할인 금액 계산 함수 (할인된 항목 별 총 할인 금액을 구함)
const calculateDiscountAmount = (
  services: Map<string, ServiceItemProps>,
  discounts: Map<string, DiscountItemProps>,
  appliedDiscounts: Map<string, Set<string>>
): Map<string, number> => {
  const discountAmounts = new Map<string, number>();

  for (const [discountKey, serviceKeys] of appliedDiscounts.entries()) {
    const discount = discounts.get(discountKey);
    if (!discount) continue;

    let totalDiscount = 0;
    for (const serviceKey of serviceKeys) {
      const service = services.get(serviceKey);
      if (service) {
        totalDiscount += service.price * (service.count ?? 1) * discount.rate;
      }
    }
    discountAmounts.set(discountKey, totalDiscount);
  }

  return discountAmounts;
};

// 할인 적용된 총 가격 계산 함수
const calcDiscountedTotalPrice = (
  services: Map<string, ServiceItemProps>,
  discounts: Map<string, DiscountItemProps>,
  appliedDiscounts: Map<string, Set<string>>
): number => {
  let total = 0;
  for (const service of services.values()) {
    let discountRate = 0;
    for (const [discountKey, serviceKeys] of appliedDiscounts.entries()) {
      if (serviceKeys.has(service.key)) {
        const discount = discounts.get(discountKey);
        if (discount) discountRate += discount.rate;
      }
    }
    total += service.price * (service.count ?? 1) * (1 - discountRate);
  }
  return Math.max(total, 0);
};

interface CartState {
  // 선택된(장바구니에 반영되는) 시술 및 할인 목록
  selectedServices: Map<string, ServiceItemProps>;
  selectedDiscounts: Map<string, DiscountItemProps>;

  appliedDiscounts: Map<string, Set<string>>; // 할인 적용된 항목 목록
  discountAmounts: Map<string, number>; // 각 할인 항목별 총 할인 금액
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

  // 특정 시술 항목에 할인 적용 여부
  toggleServiceDiscount: (discountKey: string, serviceKey: string) => void;
}

const useCartStore = create<CartState>((set, get) => ({
  selectedServices: new Map(),
  selectedDiscounts: new Map(),
  appliedDiscounts: new Map(),
  discountAmounts: new Map(),
  totalPrice: 0,

  localSelectedServices: new Map(),
  localSelectedDiscounts: new Map(),

  toggleLocalService: (key, item) =>
    set((state) => {
      const newMap = new Map(state.localSelectedServices);
      newMap.has(key) ? newMap.delete(key) : newMap.set(key, item);
      return { localSelectedServices: newMap };
    }),

  toggleLocalDiscount: (key, item) =>
    set((state) => {
      const newMap = new Map(state.localSelectedDiscounts);
      newMap.has(key) ? newMap.delete(key) : newMap.set(key, item);
      return { localSelectedDiscounts: newMap };
    }),

  handleComplete: () =>
    set((state) => {
      const newSelectedServices = new Map(state.localSelectedServices);
      const newSelectedDiscounts = new Map(state.localSelectedDiscounts);
      const newAppliedDiscounts = new Map();

      for (const discountKey of newSelectedDiscounts.keys()) {
        // 기존에 없던 할인 항목이라면, 모든 시술에 기본 적용
        if (!newAppliedDiscounts.has(discountKey)) {
          newAppliedDiscounts.set(
            discountKey,
            new Set(newSelectedServices.keys())
          );
        } else {
          // 기존에 있던 할인 항목이면, 선택된 시술 중 삭제된 시술을 필터링
          newAppliedDiscounts.set(
            discountKey,
            new Set(
              Array.from<string>(
                newAppliedDiscounts.get(discountKey) ?? []
              ).filter((serviceKey) => newSelectedServices.has(serviceKey))
            )
          );
        }

        // 만약 적용된 시술이 없는 할인 항목이 존재하면 자동 삭제
        if (newAppliedDiscounts.get(discountKey)?.size === 0) {
          newAppliedDiscounts.delete(discountKey);
          newSelectedDiscounts.delete(discountKey);
        }
      }

      // 할인 금액 다시 계산
      const newDiscountAmounts = calculateDiscountAmount(
        newSelectedServices,
        newSelectedDiscounts,
        newAppliedDiscounts
      );

      return {
        selectedServices: newSelectedServices,
        selectedDiscounts: newSelectedDiscounts,
        appliedDiscounts: newAppliedDiscounts,
        discountAmounts: newDiscountAmounts,
        totalPrice: calcDiscountedTotalPrice(
          newSelectedServices,
          newSelectedDiscounts,
          newAppliedDiscounts
        ),
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

      const newDiscountAmounts = calculateDiscountAmount(
        newSelectedServices,
        state.selectedDiscounts,
        state.appliedDiscounts
      );

      return {
        selectedServices: newSelectedServices,
        discountAmounts: newDiscountAmounts,
        totalPrice: calcDiscountedTotalPrice(
          newSelectedServices,
          state.selectedDiscounts,
          state.appliedDiscounts
        ),
      };
    }),

  toggleServiceDiscount: (discountKey, serviceKey) =>
    set((state) => {
      const newAppliedDiscounts = new Map(state.appliedDiscounts);
      const discountServices =
        newAppliedDiscounts.get(discountKey) ?? new Set();

      discountServices.has(serviceKey)
        ? discountServices.delete(serviceKey)
        : discountServices.add(serviceKey);

      if (discountServices.size === 0) {
        newAppliedDiscounts.delete(discountKey);
      } else {
        newAppliedDiscounts.set(discountKey, discountServices);
      }

      const newSelectedDiscounts = new Map(state.selectedDiscounts);
      if (!newAppliedDiscounts.has(discountKey)) {
        newSelectedDiscounts.delete(discountKey);
      }

      const newDiscountAmounts = calculateDiscountAmount(
        state.selectedServices,
        newSelectedDiscounts,
        newAppliedDiscounts
      );

      return {
        appliedDiscounts: newAppliedDiscounts,
        selectedDiscounts: newSelectedDiscounts,
        discountAmounts: newDiscountAmounts,
        totalPrice: calcDiscountedTotalPrice(
          state.selectedServices,
          newSelectedDiscounts,
          newAppliedDiscounts
        ),
      };
    }),
}));

export default useCartStore;
