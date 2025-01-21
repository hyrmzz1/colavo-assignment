import useCartStore from '@/stores/useCartStore';
import useCurrencyCodeStore from '@/stores/useCurrencyCodeStore';
import { ServiceItemProps, DiscountItemProps } from '@/types/itemTypes';
import formatRate from '@/utils/formatRate';
import { IoClose } from 'react-icons/io5';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import formatCurrency from '@/utils/formatCurrency';

interface CartServiceItemProps extends ServiceItemProps {
  itemKey: string;
}

export const CartServiceItem = ({
  itemKey,
  name,
  price,
  count,
}: CartServiceItemProps) => {
  const setServiceCount = useCartStore((state) => state.setServiceCount);
  const currencyCode = useCurrencyCodeStore((state) => state.currencyCode);

  return (
    <div className='flex w-full items-center justify-between px-4 py-2'>
      <div className='grow'>
        <p>{name}</p>
        <p className='text-xs text-gray'>
          {formatCurrency(price * (count ?? 1), currencyCode)}
        </p>
      </div>
      <div className='flex items-center gap-x-2'>
        <Select
          value={String(count)}
          onValueChange={(value) => setServiceCount(itemKey, Number(value))}
        >
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
          className='cursor-pointer text-gray'
          onClick={() => setServiceCount(itemKey, 0)}
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
  const selectedServices = useCartStore((state) => state.selectedServices);
  const appliedDiscounts = useCartStore((state) => state.appliedDiscounts);
  const discountAmounts = useCartStore((state) => state.discountAmounts);
  const toggleServiceDiscount = useCartStore(
    (state) => state.toggleServiceDiscount
  );
  const currencyCode = useCurrencyCodeStore((state) => state.currencyCode);

  return (
    <div className='flex w-full items-center justify-between px-4 py-2'>
      <div className='grow'>
        <p>{name}</p>
        <p className='text-xs text-gray'>
          {Array.from(appliedDiscounts.get(itemKey) ?? [])
            .map((serviceKey) => {
              const service = selectedServices.get(serviceKey);
              return service
                ? service.count > 1
                  ? `${service.name} x ${service.count}`
                  : service.name
                : null;
            })
            .join(', ')}
        </p>
        <p className='pt-1 text-sm text-red'>
          -{formatCurrency(discountAmounts.get(itemKey) ?? 0, currencyCode)} (
          {formatRate(rate)})
        </p>
      </div>
      <div className='flex items-center gap-x-2'>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='수정' />
          </SelectTrigger>
          <SelectContent>
            {Array.from(selectedServices.entries()).map(([key, item]) => (
              <div
                key={key}
                className='items-top flex space-x-2 py-1.5 pl-2 pr-8 hover:bg-gray-light'
              >
                <Checkbox
                  id={`checkbox-${key}`}
                  checked={appliedDiscounts.get(itemKey)?.has(key) ?? false}
                  onCheckedChange={() => toggleServiceDiscount(itemKey, key)}
                />
                <div className='grid gap-1.5 leading-none'>
                  <label
                    htmlFor={`checkbox-${key}`}
                    className='flex flex-col gap-y-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    <p>
                      {item.name} x {item.count}개
                    </p>
                    <p className='text-xs text-gray'>
                      {formatCurrency(item.price * item.count, currencyCode)}
                    </p>
                  </label>
                </div>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
