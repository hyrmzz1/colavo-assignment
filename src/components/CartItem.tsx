import useCartStore from '@/stores/useCartStore';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';
import { IoClose } from 'react-icons/io5';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formatRate = (rate: number) => {
  return rate < 1 ? `${Math.round(rate * 100)}%` : `${rate.toLocaleString()}원`;
};

interface CartServiceItemProps extends ServiceItemProps {
  itemKey: string;
}

export const CartServiceItem = ({
  itemKey,
  name,
  price,
  count,
}: CartServiceItemProps) => {
  const removeServiceItem = useCartStore((state) => state.removeServiceItem);

  return (
    <div className='flex w-full items-center justify-between px-4 py-2'>
      <div className='grow'>
        <p>{name}</p>
        {/* TODO) currency_code에 맞게 가격 포맷팅 */}
        <p className='text-gray text-xs'>{price.toLocaleString()}원</p>
      </div>
      <div className='flex items-center gap-x-2'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={count} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <IoClose
          className='text-gray cursor-pointer'
          onClick={() => removeServiceItem(itemKey)}
        />
      </div>
    </div>
  );
};

interface CartDiscountItemProps extends DiscountItemProps {
  itemKey: string;
}

export const CartDiscountItem = ({
  itemKey,
  name,
  rate,
}: CartDiscountItemProps) => {
  const removeDiscountItem = useCartStore((state) => state.removeDiscountItem);
  const selectedServices = useCartStore((state) => state.selectedServices);

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
      <div className='flex items-center gap-x-2'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='수정' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from(selectedServices.entries()).map(([key, item]) => (
                <SelectItem key={key} value={String(item.count)}>
                  <p>
                    {item.name} x {item.count}개
                  </p>
                  <p className='text-gray text-xs'>
                    {item.price.toLocaleString()}원
                  </p>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <IoClose
          className='text-gray cursor-pointer'
          onClick={() => removeDiscountItem(itemKey)}
        />
      </div>
    </div>
  );
};
