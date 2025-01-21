import useViewStore, { ViewType } from '@/stores/useViewStore';
import useCartStore from '@/stores/useCartStore';
import { IoAdd, IoClose } from 'react-icons/io5';

const Header = () => {
  const currView = useViewStore((state) => state.currView);
  const setView = useViewStore((state) => state.setView);

  // * Zustand 상태 설명
  // selectedServices / selectedDiscounts: "완료" 버튼을 눌러 장바구니에 최종 추가된 항목
  // localSelectedServices / localSelectedDiscounts: 사용자가 선택했지만 "완료" 버튼을 누르지 않은 임시 선택 항목
  // 헤더의 'X' 버튼을 누르면 임시 선택된 항목이 초기화되어 장바구니에 해당 항목들이 추가되지 않는다.
  const resetLocalSelections = useCartStore(
    (state) => state.resetLocalSelections
  );

  const headerTitle: Record<Exclude<ViewType, 'cart'>, string> = {
    service: '시술메뉴',
    discount: '할인',
  };

  const userLocale = navigator.language || 'ko-KR';
  const now = new Date();
  const formattedDate = now.toLocaleString(userLocale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className='flex items-center justify-between px-2 py-4'>
      <IoClose
        className='h-6 w-6 cursor-pointer text-gray'
        onClick={() => {
          resetLocalSelections();
          setView('cart');
        }}
      />

      {currView === 'cart' ? (
        <div className='flex grow flex-col items-center'>
          <p className='text-sm'>양혜림</p>
          <p className='text-xs text-gray'>{formattedDate}</p>
        </div>
      ) : (
        <p className='font-semibold'>{headerTitle[currView]}</p>
      )}

      {currView !== 'cart' ? (
        <IoAdd className='h-6 w-6 cursor-not-allowed text-gray' />
      ) : (
        <div className='h-6 w-6'></div>
      )}
    </div>
  );
};

export default Header;
