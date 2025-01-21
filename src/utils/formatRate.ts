import formatCurrency from '@/utils/formatCurrency';

const formatRate = (rate: number, currencyCode?: 'KRW' | 'USD') => {
  return rate < 1
    ? `${Math.round(rate * 100)}%`
    : formatCurrency(rate, currencyCode ?? 'KRW');
};

export default formatRate;
