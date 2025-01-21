import { create } from 'zustand';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';
import { updateCartState } from '@/utils/cartPricing';

interface CartState {
  // 장바구니에 반영된 시술 및 할인 목록
  selectedServices: Map<string, ServiceItemProps>;
  selectedDiscounts: Map<string, DiscountItemProps>;

  // 특정 할인 항목이 적용된 시술 목록
  appliedDiscounts: Map<string, Set<string>>;
  discountAmounts: Map<string, number>; // 각 할인 항목별 총 할인 금액
  totalPrice: number; // 할인 반영 후 최종 금액

  // 사용자가 선택 중인(아직 장바구니에 반영되지 않은) 서비스 및 할인 목록
  localSelectedServices: Map<string, ServiceItemProps>;
  localSelectedDiscounts: Map<string, DiscountItemProps>;

  // 시술 및 할인 항목 추가/제거 (선택 상태 변경)
  toggleLocalService: (key: string, item: ServiceItemProps) => void;
  toggleLocalDiscount: (key: string, item: DiscountItemProps) => void;

  // 선택한 항목을 장바구니에 반영 (완료 버튼 클릭 시 실행)
  handleComplete: () => void;

  // 현재 선택 중인 항목 초기화 (기존 장바구니 상태로 복원)
  resetLocalSelections: () => void;

  // 특정 시술 또는 할인이 선택되었는지 확인 (UI 체크 아이콘 유지에 사용)
  isServiceSelected: (key: string) => boolean;
  isDiscountSelected: (key: string) => boolean;

  // 특정 시술 항목의 수량(count) 변경
  setServiceCount: (key: string, count: number) => void;

  // 특정 시술 항목에 할인 적용 여부 설정
  toggleServiceDiscount: (discountKey: string, serviceKey: string) => void;
}

const useCartStore = create<CartState>((set, get) => ({
  // 장바구니 초기 상태
  selectedServices: new Map(),
  selectedDiscounts: new Map(),
  appliedDiscounts: new Map(),
  discountAmounts: new Map(),
  totalPrice: 0,

  // 장바구니에 추가되지 않은 (사용자가 선택 중인) 임시 상태
  localSelectedServices: new Map(),
  localSelectedDiscounts: new Map(),

  // 시술 목록에서 항목 선택/선택 해제
  toggleLocalService: (key, item) =>
    set((state) => {
      const newMap = new Map(state.localSelectedServices);
      newMap.has(key) ? newMap.delete(key) : newMap.set(key, item);
      return { localSelectedServices: newMap };
    }),

  // 할인 목록 항목 선택/선택 해제
  toggleLocalDiscount: (key, item) =>
    set((state) => {
      const newMap = new Map(state.localSelectedDiscounts);
      newMap.has(key) ? newMap.delete(key) : newMap.set(key, item);
      return { localSelectedDiscounts: newMap };
    }),

  // 선택한 항목 장바구니에 반영
  handleComplete: () =>
    set((state) => {
      const newSelectedServices = new Map(state.localSelectedServices);
      const newSelectedDiscounts = new Map(state.localSelectedDiscounts);
      const newAppliedDiscounts = new Map<string, Set<string>>();

      // 선택된 할인을 모든 시술에 자동 적용
      for (const discountKey of newSelectedDiscounts.keys()) {
        const appliedServiceKeys = new Set(newSelectedServices.keys());

        // 기존 적용된 할인 있다면 유지
        if (state.appliedDiscounts.has(discountKey)) {
          for (const key of state.appliedDiscounts.get(discountKey)!) {
            appliedServiceKeys.add(key);
          }
        }

        if (appliedServiceKeys.size > 0) {
          newAppliedDiscounts.set(discountKey, appliedServiceKeys);
        }
      }

      return {
        selectedServices: newSelectedServices,
        selectedDiscounts: newSelectedDiscounts,
        appliedDiscounts: newAppliedDiscounts,
        ...updateCartState(
          newSelectedServices,
          newSelectedDiscounts,
          newAppliedDiscounts
        ),
      };
    }),

  // 선택 중인 항목 초기화 (기존 장바구니 항목으로 복원)
  resetLocalSelections: () =>
    set(() => ({
      localSelectedServices: new Map(get().selectedServices),
      localSelectedDiscounts: new Map(get().selectedDiscounts),
    })),

  isServiceSelected: (key) => get().localSelectedServices.has(key),
  isDiscountSelected: (key) => get().localSelectedDiscounts.has(key),

  // 시술 수량 변경
  setServiceCount: (key, count) =>
    set((state) => {
      const newSelectedServices = new Map(state.selectedServices);
      const newLocalSelectedServices = new Map(state.localSelectedServices);

      const service = newSelectedServices.get(key);
      if (!service || service.count === count) return state;

      if (count > 0) {
        newSelectedServices.set(key, { ...service, count });
      } else {
        newSelectedServices.delete(key);
        newLocalSelectedServices.delete(key); // 시술 목록에서도 선택 상태 해제 (체크 아이콘 사라짐)
      }

      return {
        selectedServices: newSelectedServices,
        localSelectedServices: newLocalSelectedServices,
        ...updateCartState(
          newSelectedServices,
          state.selectedDiscounts,
          state.appliedDiscounts
        ),
      };
    }),

  // 특정 시술 항목에 할인 적용 여부 설정
  toggleServiceDiscount: (discountKey, serviceKey) =>
    set((state) => {
      const newAppliedDiscounts = new Map(state.appliedDiscounts);
      const discountServices =
        newAppliedDiscounts.get(discountKey) ?? new Set();

      discountServices.has(serviceKey)
        ? discountServices.delete(serviceKey)
        : discountServices.add(serviceKey);

      if (!discountServices.size) {
        newAppliedDiscounts.delete(discountKey);
      } else {
        newAppliedDiscounts.set(discountKey, discountServices);
      }

      // * 할인이 모든 시술에 적용되지 않는다면
      // `selectedDiscounts`와 `localSelectedDiscounts`에서도 삭제
      // 할인 목록에서 선택 상태 해제 (체크 아이콘 사라지도록 처리)
      const newSelectedDiscounts = new Map(state.selectedDiscounts);
      const newLocalSelectedDiscounts = new Map(state.localSelectedDiscounts);

      if (!newAppliedDiscounts.has(discountKey)) {
        newSelectedDiscounts.delete(discountKey);
        newLocalSelectedDiscounts.delete(discountKey);
      }

      return {
        appliedDiscounts: newAppliedDiscounts,
        selectedDiscounts: newSelectedDiscounts,
        localSelectedDiscounts: newLocalSelectedDiscounts,
        ...updateCartState(
          state.selectedServices,
          newSelectedDiscounts,
          newAppliedDiscounts
        ),
      };
    }),
}));

export default useCartStore;
