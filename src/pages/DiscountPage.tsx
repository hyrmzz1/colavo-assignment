import { useGetDiscountItems } from '@/hooks/useGetItems';
import { DiscountItemProps } from '@/types/itemTypes';

const DiscountPage = () => {
  const { isPending, isError, data } = useGetDiscountItems();

  if (isPending) {
    return <span>로딩 중...</span>;
  }

  if (isError) {
    return <span>할인 항목을 불러오는 중 오류가 발생했습니다.</span>;
  }

  return (
    <ul>
      {data &&
        Object.entries(data).map(([key, item]: [string, DiscountItemProps]) => (
          <li key={key}>
            <p>
              {item.name} {item.rate}
            </p>
          </li>
        ))}
    </ul>
  );
};

export default DiscountPage;
