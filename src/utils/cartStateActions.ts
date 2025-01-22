import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

// 특정 할인 항목을 선택한 시술에 적용 또는 해제
export const toggleDiscount = (
  discountKey: string,
  serviceKey: string,
  appliedDiscounts: Map<string, Set<string>>,
  selectedDiscounts: Map<string, DiscountItemProps>,
  localSelectedDiscounts: Map<string, DiscountItemProps>
) => {
  const newAppliedDiscounts = new Map(appliedDiscounts);
  const discountServices = newAppliedDiscounts.get(discountKey) ?? new Set();

  // 해당 시술이 이미 할인 적용 중이면 제거, 아니면 추가
  discountServices.has(serviceKey)
    ? discountServices.delete(serviceKey)
    : discountServices.add(serviceKey);

  // 적용된 시술이 없으면 할인 항목 자체를 삭제
  if (discountServices.size === 0) {
    newAppliedDiscounts.delete(discountKey);
    selectedDiscounts.delete(discountKey);
    localSelectedDiscounts.delete(discountKey);
  } else {
    newAppliedDiscounts.set(discountKey, discountServices);
  }

  return {
    newAppliedDiscounts,
    newSelectedDiscounts: selectedDiscounts,
    newLocalSelectedDiscounts: localSelectedDiscounts,
  };
};

// 특정 시술의 수량 변경 (0이면 삭제)
export const updateServiceCount = (
  key: string,
  count: number,
  selectedServices: Map<string, ServiceItemProps>,
  localSelectedServices: Map<string, ServiceItemProps>
) => {
  const newSelectedServices = new Map(selectedServices);
  const newLocalSelectedServices = new Map(localSelectedServices);

  const service = newSelectedServices.get(key);

  // 수량이 변경되지 않았다면 그대로 반환
  if (!service || service.count === count)
    return { newSelectedServices, newLocalSelectedServices };

  // 수량이 0 이상이면 수량 업데이트, 0이면 시술 제거
  if (count > 0) {
    newSelectedServices.set(key, { ...service, count });
    newLocalSelectedServices.set(key, { ...service, count });
  } else {
    newSelectedServices.delete(key);
    newLocalSelectedServices.delete(key);
  }

  return { newSelectedServices, newLocalSelectedServices };
};

// 특정 시술을 선택 또는 선택 해제
export const toggleServiceSelection = (
  key: string,
  item: ServiceItemProps,
  localSelectedServices: Map<string, ServiceItemProps>
) => {
  const newLocalSelectedServices = new Map(localSelectedServices);

  // 이미 선택된 시술이라면 제거, 아니면 추가
  newLocalSelectedServices.has(key)
    ? newLocalSelectedServices.delete(key)
    : newLocalSelectedServices.set(key, item);

  return { newLocalSelectedServices };
};
