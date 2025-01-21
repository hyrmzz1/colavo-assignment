import { useQuery } from '@tanstack/react-query';
import { getDiscountItems, getServiceItems } from '@/apis/itemsApi';
import { DiscountItemProps, ServiceItemProps } from '@/types/itemTypes';

interface ServiceResponse {
  items: Record<string, ServiceItemProps>;
  currencyCode: 'KRW' | 'USD';
}

interface DiscountResponse {
  discounts: Record<string, DiscountItemProps>;
  currencyCode: 'KRW' | 'USD';
}

export const useGetServiceItems = () => {
  return useQuery<ServiceResponse>({
    queryKey: ['services'],
    queryFn: getServiceItems,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useGetDiscountItems = () => {
  return useQuery<DiscountResponse>({
    queryKey: ['discounts'],
    queryFn: getDiscountItems,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
