import useViewStore, { ViewType } from '@/stores/useViewStore';
import useCartStore from '@/stores/useCartStore';
import { IoAdd, IoClose } from 'react-icons/io5';

const Header = () => {
  const currView = useViewStore((state) => state.currView);
  const setView = useViewStore((state) => state.setView);
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
        className='text-gray h-6 w-6 cursor-pointer'
        onClick={() => {
          resetLocalSelections();
          setView('cart');
        }}
      />

      {currView === 'cart' ? (
        <div className='flex grow flex-col items-center'>
          <p className='text-sm'>양혜림</p>
          <p className='text-gray text-xs'>{formattedDate}</p>
        </div>
      ) : (
        <p className='font-semibold'>{headerTitle[currView]}</p>
      )}

      {currView !== 'cart' ? (
        <IoAdd className='text-gray h-6 w-6 cursor-not-allowed' />
      ) : (
        <div className='h-6 w-6'></div>
      )}
    </div>
  );
};

export default Header;
