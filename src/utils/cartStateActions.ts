import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

export const toggleDiscount = (
  discountKey: string,
  serviceKey: string,
  appliedDiscounts: Map<string, Set<string>>,
  selectedDiscounts: Map<string, DiscountItemProps>,
  localSelectedDiscounts: Map<string, DiscountItemProps>
) => {
  const newAppliedDiscounts = new Map(appliedDiscounts);
  const discountServices = newAppliedDiscounts.get(discountKey) ?? new Set();

  discountServices.has(serviceKey)
    ? discountServices.delete(serviceKey)
    : discountServices.add(serviceKey);

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

export const updateServiceCount = (
  key: string,
  count: number,
  selectedServices: Map<string, ServiceItemProps>,
  localSelectedServices: Map<string, ServiceItemProps>
) => {
  const newSelectedServices = new Map(selectedServices);
  const newLocalSelectedServices = new Map(localSelectedServices);

  const service = newSelectedServices.get(key);
  if (!service || service.count === count)
    return { newSelectedServices, newLocalSelectedServices };

  if (count > 0) {
    newSelectedServices.set(key, { ...service, count });
    newLocalSelectedServices.set(key, { ...service, count });
  } else {
    newSelectedServices.delete(key);
    newLocalSelectedServices.delete(key);
  }

  return { newSelectedServices, newLocalSelectedServices };
};

export const toggleServiceSelection = (
  key: string,
  item: ServiceItemProps,
  localSelectedServices: Map<string, ServiceItemProps>
) => {
  const newLocalSelectedServices = new Map(localSelectedServices);

  newLocalSelectedServices.has(key)
    ? newLocalSelectedServices.delete(key)
    : newLocalSelectedServices.set(key, item);

  return { newLocalSelectedServices };
};
