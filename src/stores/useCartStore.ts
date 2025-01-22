import { create } from 'zustand';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';
import { updateCartState } from '@/utils/cartPricing';
import {
  toggleDiscount,
  updateServiceCount,
  toggleServiceSelection,
} from '@/utils/cartStateActions';

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
    set((state) => ({
      localSelectedServices: toggleServiceSelection(
        key,
        item,
        state.localSelectedServices
      ).newLocalSelectedServices,
    })),

  // 할인 목록 항목 선택/선택 해제
  toggleLocalDiscount: (key, item) =>
    set((state) => {
      const newLocalSelectedDiscounts = new Map(state.localSelectedDiscounts);
      const newAppliedDiscounts = new Map(state.appliedDiscounts);

      if (newLocalSelectedDiscounts.has(key)) {
        newLocalSelectedDiscounts.delete(key);
        newAppliedDiscounts.delete(key);
      } else {
        newLocalSelectedDiscounts.set(key, item);
      }

      return {
        localSelectedDiscounts: newLocalSelectedDiscounts,
        appliedDiscounts: newAppliedDiscounts,
      };
    }),

  // 선택한 항목 장바구니에 반영
  handleComplete: () =>
    set((state) => {
      const newSelectedServices = new Map(state.localSelectedServices);
      const newSelectedDiscounts = new Map(state.localSelectedDiscounts);
      const newAppliedDiscounts = new Map();

      // 기존 할인 유지 + 새로운 할인 추가
      newSelectedDiscounts.forEach((_, discountKey) => {
        if (state.appliedDiscounts.has(discountKey)) {
          newAppliedDiscounts.set(
            discountKey,
            new Set(state.appliedDiscounts.get(discountKey))
          );
        } else {
          newAppliedDiscounts.set(
            discountKey,
            new Set(newSelectedServices.keys())
          );
        }
      });

      // 기존 서비스가 없는 할인 항목 제거
      for (const [discountKey, serviceKeys] of newAppliedDiscounts.entries()) {
        const validServiceKeys = new Set(
          [...serviceKeys].filter((key) => newSelectedServices.has(key))
        );
        if (validServiceKeys.size === 0) {
          newAppliedDiscounts.delete(discountKey);
          newSelectedDiscounts.delete(discountKey);
        } else {
          newAppliedDiscounts.set(discountKey, validServiceKeys);
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
    set((state) => ({
      localSelectedServices: new Map(state.selectedServices),
      localSelectedDiscounts: new Map(state.selectedDiscounts),
    })),

  isServiceSelected: (key) => get().localSelectedServices.has(key),
  isDiscountSelected: (key) => get().localSelectedDiscounts.has(key),

  // 시술 수량 변경
  setServiceCount: (key, count) =>
    set((state) => {
      const { newSelectedServices, newLocalSelectedServices } =
        updateServiceCount(
          key,
          count,
          state.selectedServices,
          state.localSelectedServices
        );

      const newAppliedDiscounts = new Map(state.appliedDiscounts);
      const newSelectedDiscounts = new Map(state.selectedDiscounts);
      const newLocalSelectedDiscounts = new Map(state.localSelectedDiscounts);

      // 해당 시술이 삭제될 경우 적용된 모든 할인에서도 제거
      for (const [discountKey, serviceKeys] of newAppliedDiscounts.entries()) {
        serviceKeys.delete(key);

        if (serviceKeys.size === 0) {
          newAppliedDiscounts.delete(discountKey);
          newSelectedDiscounts.delete(discountKey);
          newLocalSelectedDiscounts.delete(discountKey);
        } else {
          newAppliedDiscounts.set(discountKey, serviceKeys);
        }
      }

      return {
        selectedServices: newSelectedServices,
        localSelectedServices: newLocalSelectedServices,
        appliedDiscounts: newAppliedDiscounts,
        selectedDiscounts: newSelectedDiscounts,
        localSelectedDiscounts: newLocalSelectedDiscounts,
        ...updateCartState(
          newSelectedServices,
          newSelectedDiscounts,
          newAppliedDiscounts
        ),
      };
    }),

  // 특정 시술 항목에 할인 적용 여부 설정
  toggleServiceDiscount: (discountKey, serviceKey) =>
    set((state) => {
      const {
        newAppliedDiscounts,
        newSelectedDiscounts,
        newLocalSelectedDiscounts,
      } = toggleDiscount(
        discountKey,
        serviceKey,
        state.appliedDiscounts,
        new Map(state.selectedDiscounts),
        new Map(state.localSelectedDiscounts)
      );

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
