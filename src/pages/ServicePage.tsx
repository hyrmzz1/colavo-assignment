import { useGetServiceItems } from '@/hooks/useGetItems';
import { ServiceItemProps } from '@/types/itemTypes';
import ServiceItem from '@/components/ServiceItem';

const ServicePage = () => {
  const { isPending, isError, data } = useGetServiceItems();

  if (isPending) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p>로딩 중...</p>
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
            <ServiceItem name={item.name} price={item.price} />
          </li>
        ))}
    </ul>
  );
};

export default ServicePage;
