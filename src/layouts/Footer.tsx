import useViewStore, { ViewType } from '@/stores/useViewStore';
import useCartStore from '@/stores/useCartStore';
import useCurrencyCodeStore from '@/stores/useCurrencyCodeStore';
import formatCurrency from '@/utils/formatCurrency';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currView = useViewStore((state) => state.currView);
  const setView = useViewStore((state) => state.setView);
  const isCartView = currView === 'cart';

  // * Zustand 상태 설명
  // selectedServices / selectedDiscounts: "완료" 버튼을 눌러 장바구니에 최종 추가된 항목
  // localSelectedServices / localSelectedDiscounts: 사용자가 선택했지만 "완료" 버튼을 누르지 않은 임시 선택 항목
  // 푸터의 '완료' 버튼을 누르면 임시 선택된 항목들이 장바구니에 추가된다.
  const handleComplete = useCartStore((state) => state.handleComplete);
  const totalPrice = useCartStore((state) => state.totalPrice);

  const currencyCode = useCurrencyCodeStore((state) => state.currencyCode);

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
            <p className='text-xs text-gray'>합계</p>
            <p className='text-xl'>
              {formatCurrency(totalPrice, currencyCode)}
            </p>
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
