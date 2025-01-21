import useCartStore from '@/stores/useCartStore';
import { useGetDiscountItems } from '@/hooks/useGetItems';
import { DiscountItemProps } from '@/types/itemTypes';
import DiscountItem from '@/components/DiscountItem';
import ClipLoader from 'react-spinners/ClipLoader';

const DiscountPage = () => {
  const { isPending, isError, data } = useGetDiscountItems();
  const { isDiscountSelected, toggleLocalDiscount } = useCartStore();

  if (isPending) {
    return (
      <div className='flex h-full items-center justify-center'>
        <ClipLoader color='#8b5cf6' speedMultiplier={0.5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p>
          할인 항목을 불러오는 중<br />
          오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <ul className='divide-y-[1px]'>
      {data &&
        Object.entries(data).map(([key, item]: [string, DiscountItemProps]) => (
          <li key={key}>
            <DiscountItem
              key={item.key}
              name={item.name}
              rate={item.rate}
              isSelected={isDiscountSelected(key)}
              onClick={() => toggleLocalDiscount(key, { ...item, key })}
            />
          </li>
        ))}
    </ul>
  );
};

export default DiscountPage;
