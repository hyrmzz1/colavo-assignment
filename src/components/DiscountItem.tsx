import useCurrencyCodeStore from '@/stores/useCurrencyCodeStore';
import { DiscountItemProps } from '@/types/itemTypes';
import formatRate from '@/utils/formatRate';
import { IoMdCheckmark } from 'react-icons/io';

interface DiscountItemComponentProps extends DiscountItemProps {
  isSelected: boolean;
  onClick: () => void;
}

const DiscountItem = ({
  name,
  rate,
  isSelected,
  onClick,
}: DiscountItemComponentProps) => {
  const currencyCode = useCurrencyCodeStore((state) => state.currencyCode);

  return (
    <div
      className='flex w-full cursor-pointer items-center justify-between px-4 py-2'
      onClick={onClick}
    >
      <div className='grow'>
        <p>{name}</p>
        <p className='text-xs text-red'>{formatRate(rate, currencyCode)}</p>
      </div>
      <div className='h-6 w-6 shrink-0'>
        {isSelected && <IoMdCheckmark className='h-6 w-6 text-purple' />}
      </div>
    </div>
  );
};

export default DiscountItem;
