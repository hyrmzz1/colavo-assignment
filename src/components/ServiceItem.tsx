import { useState } from 'react';
import { ServiceItemProps } from '@/types/itemTypes';
import { IoMdCheckmark } from 'react-icons/io';

const ServiceItem = ({ name, price }: ServiceItemProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected((prev) => !prev);
  };

  return (
    <div
      className='flex w-full cursor-pointer items-center justify-between px-4 py-2'
      onClick={handleClick}
    >
      <div className='grow'>
        <p>{name}</p>
        {/* TODO) currency_code에 맞게 가격 포맷팅 */}
        <p className='text-gray text-xs'>{price}원</p>
      </div>
      <div className='h-6 w-6 shrink-0'>
        {isSelected && <IoMdCheckmark className='text-purple h-6 w-6' />}
      </div>
    </div>
  );
};

export default ServiceItem;
