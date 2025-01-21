// FIX) `${rate}원` 대신 formatCurrency 적용
const formatRate = (rate: number) => {
  return rate < 1 ? `${Math.round(rate * 100)}%` : `${rate}원`;
};

export default formatRate;
