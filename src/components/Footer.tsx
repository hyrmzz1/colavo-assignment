import useViewStore, { ViewType } from '@/stores/useViewStore';
import useCartStore from '@/stores/useCartStore';
import { Button } from './ui/button';

const Footer = () => {
  const currView = useViewStore((state) => state.currView);
  const setView = useViewStore((state) => state.setView);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const handleComplete = useCartStore((state) => state.handleComplete);
  const isCartView = currView === 'cart';

  const containerStyles = isCartView
    ? 'border-gray-light'
    : 'bg-purple text-white border-purple';

  const footerMessages: Record<Exclude<ViewType, 'cart'>, string> = {
    service: '서비스를 선택하세요(여러 개 선택가능)',
    discount: '할인을 선택하세요(여러 개 선택가능)',
  };

  return (
    <div
      className={`${containerStyles} flex w-full flex-col items-center gap-y-2 border-t-2 px-4 py-2`}
    >
      {isCartView ? (
        <>
          <div className='flex w-full items-center justify-between'>
            <p className='text-gray text-xs'>합계</p>
            <p className='text-xl'>{totalPrice.toLocaleString()}원</p>
          </div>
          <Button className='w-full'>다음</Button>
        </>
      ) : (
        <>
          <p className='text-center text-xs'>{footerMessages[currView]}</p>
          <Button
            className='w-full'
            variant='secondary'
            onClick={() => {
              handleComplete();
              setView('cart');
            }}
          >
            완료
          </Button>
        </>
      )}
    </div>
  );
};

export default Footer;
