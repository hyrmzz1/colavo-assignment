const formatCurrency = (
  amount: number,
  currencyCode: 'KRW' | 'USD' = 'KRW'
): string => {
  const locale = currencyCode === 'USD' ? 'en-US' : 'ko-KR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'KRW' ? 0 : 2,
  }).format(amount);
};

export default formatCurrency;
