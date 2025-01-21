import useCartStore from '@/stores/useCartStore';
import { useGetServiceItems } from '@/hooks/useGetItems';
import { ServiceItemProps } from '@/types/itemTypes';
import ServiceItem from '@/components/ServiceItem';
import ClipLoader from 'react-spinners/ClipLoader';

const ServicePage = () => {
  const { isPending, isError, data } = useGetServiceItems();
  const { isServiceSelected, toggleLocalService } = useCartStore();

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
          시술 항목을 불러오는 중<br />
          오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <ul className='divide-y-[1px]'>
      {data &&
        Object.entries(data).map(([key, item]: [string, ServiceItemProps]) => (
          <li key={key}>
            <ServiceItem
              key={item.key}
              count={item.count}
              name={item.name}
              price={item.price}
              isSelected={isServiceSelected(key)}
              onClick={() => toggleLocalService(key, { ...item, key })}
            />
          </li>
        ))}
    </ul>
  );
};

export default ServicePage;
