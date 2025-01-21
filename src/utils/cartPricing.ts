import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

// 할인 항목별 총 할인 금액 계산
export const calculateDiscountAmount = (
  services: Map<string, ServiceItemProps>,
  discounts: Map<string, DiscountItemProps>,
  appliedDiscounts: Map<string, Set<string>>
): Map<string, number> =>
  new Map(
    [...appliedDiscounts.entries()]
      .map(([discountKey, serviceKeys]) => {
        const discount = discounts.get(discountKey);
        if (!discount) return null;

        const totalDiscount = [...serviceKeys]
          .map((serviceKey) => services.get(serviceKey))
          .filter(Boolean)
          .reduce(
            (sum, service) =>
              sum + service!.price * (service!.count ?? 1) * discount.rate,
            0
          );

        return [discountKey, totalDiscount];
      })
      .filter(Boolean) as [string, number][] // null 값 제거
  );

// 할인 적용 후 최종 금액 계산
export const calcDiscountedTotalPrice = (
  services: Map<string, ServiceItemProps>,
  discounts: Map<string, DiscountItemProps>,
  appliedDiscounts: Map<string, Set<string>>
): number =>
  Math.max(
    [...services.values()].reduce((total, service) => {
      const discountRate = [...appliedDiscounts.entries()]
        .filter(([, serviceKeys]) => serviceKeys.has(service.key))
        .reduce(
          (sum, [discountKey]) => sum + (discounts.get(discountKey)?.rate || 0),
          0
        );

      return total + service.price * (service.count ?? 1) * (1 - discountRate);
    }, 0),
    0
  );

// 장바구니 상태 업데이트 (할인 및 최종 금액 동기화)
export const updateCartState = (
  services: Map<string, ServiceItemProps>,
  discounts: Map<string, DiscountItemProps>,
  appliedDiscounts: Map<string, Set<string>>
) => ({
  discountAmounts: calculateDiscountAmount(
    services,
    discounts,
    appliedDiscounts
  ),
  totalPrice: calcDiscountedTotalPrice(services, discounts, appliedDiscounts),
});
