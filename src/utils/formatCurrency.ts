const formatCurrency = (
  amount: number,
  currencyCode: 'USD' | 'KRW'
): string => {
  const locale = currencyCode === 'USD' ? 'en-US' : 'ko-KR';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'KRW' ? 0 : 2,
  });

  return formatter.format(amount);
};

export default formatCurrency;
