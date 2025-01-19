import { useGetServiceItems } from '@/hooks/useGetItems';
import { ServiceItemProps } from '@/types/itemTypes';

const ServicePage = () => {
  const { isPending, isError, data } = useGetServiceItems();

  if (isPending) {
    return <span>로딩 중...</span>;
  }

  if (isError) {
    return <span>시술 항목을 불러오는 중 오류가 발생했습니다.</span>;
  }

  return (
    <ul>
      {data &&
        Object.entries(data).map(([key, item]: [string, ServiceItemProps]) => (
          <li key={key}>
            <p>
              {item.name} {item.count}개 {item.price}원
            </p>
          </li>
        ))}
    </ul>
  );
};

export default ServicePage;
