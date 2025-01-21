import { useQuery } from '@tanstack/react-query';
import useCurrencyCodeStore from '@/stores/useCurrencyCodeStore';
import { useEffect } from 'react';
import { getCurrencyCode } from '@/apis/currencyCodeApi';

export const useGetCurrencyCode = () => {
  const { data } = useQuery<'KRW' | 'USD'>({
    queryKey: ['currencyCode'],
    queryFn: getCurrencyCode,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const setCurrencyCode = useCurrencyCodeStore(
    (state) => state.setCurrencyCode
  );

  useEffect(() => {
    if (data) {
      setCurrencyCode(data);
    }
  }, [data, setCurrencyCode]);
};
