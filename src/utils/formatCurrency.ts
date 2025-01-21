const formatCurrency = (
  amount: number,
  currencyCode: 'KRW' | 'USD' = 'KRW'
): string => {
  const locale = currencyCode === 'USD' ? 'en-US' : 'ko-KR';

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'KRW' ? 0 : 2,
  }).format(amount);

  // KRW일 경우 ₩를 '원'으로 대체
  return currencyCode === 'KRW' ? formatted.replace('₩', '') + '원' : formatted;
};

export default formatCurrency;
