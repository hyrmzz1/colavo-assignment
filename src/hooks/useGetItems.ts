import { useQuery } from '@tanstack/react-query';
import { getDiscountItems, getServiceItems } from '@/apis/itemsApi';
import { DiscountItemProps, ServiceItemProps } from '@/types/itemTypes';

export const useGetServiceItems = () => {
  return useQuery<Record<string, ServiceItemProps>>({
    queryKey: ['services'],
    queryFn: getServiceItems,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useGetDiscountItems = () => {
  return useQuery<Record<string, DiscountItemProps>>({
    queryKey: ['discounts'],
    queryFn: getDiscountItems,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
