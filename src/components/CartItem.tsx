import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';

const formatRate = (rate: number) => {
  return rate < 1 ? `${Math.round(rate * 100)}%` : `${rate}원`;
};

export const CartServiceItem = ({ name, price, count }: ServiceItemProps) => {
  return (
    <div className='flex w-full items-center justify-between px-4 py-2'>
      <div className='grow'>
        <p>{name}</p>
        {/* TODO) currency_code에 맞게 가격 포맷팅 */}
        <p className='text-gray text-xs'>{price}원</p>
      </div>
      <div>{count}</div>
    </div>
  );
};

export const CartDiscountItem = ({ name, rate }: DiscountItemProps) => {
  return (
    <div className='flex w-full items-center justify-between px-4 py-2'>
      <div className='grow'>
        <p>{name}</p>
        <p className='text-gray text-xs'>할인 대상 시술</p>
        {/* TODO) currency_code에 맞게 가격 포맷팅 */}
        {/* FIX) 총 할인 금액 계산 */}
        <p className='text-red pt-1 text-sm'>
          -총 할인 금액({formatRate(rate)})
        </p>
      </div>
      <div>수정</div>
    </div>
  );
};
