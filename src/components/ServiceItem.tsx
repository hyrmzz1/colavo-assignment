import { ServiceItemProps } from '@/types/itemTypes';
import formatCurrency from '@/utils/formatCurrency';
import { IoMdCheckmark } from 'react-icons/io';

interface ServiceItemComponentProps extends ServiceItemProps {
  currencyCode: 'KRW' | 'USD';
  isSelected: boolean;
  onClick: () => void;
}

const ServiceItem = ({
  name,
  price,
  currencyCode,
  isSelected,
  onClick,
}: ServiceItemComponentProps) => {
  return (
    <div
      className='flex w-full cursor-pointer items-center justify-between px-4 py-2'
      onClick={onClick}
    >
      <div className='grow'>
        <p>{name}</p>
        <p className='text-xs text-gray'>
          {formatCurrency(price, currencyCode)}
        </p>
      </div>
      <div className='h-6 w-6 shrink-0'>
        {isSelected && <IoMdCheckmark className='h-6 w-6 text-purple' />}
      </div>
    </div>
  );
};

export default ServiceItem;
