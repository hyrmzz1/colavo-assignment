import useViewStore from '@/stores/useViewStore';
import { Button } from '@/components/ui/button';
import { IoIosAddCircle } from 'react-icons/io';

const CartPage = () => {
  const setView = useViewStore((state) => state.setView);

  const buttons = [
    { variant: 'gray', view: 'service', label: '시술' },
    { variant: 'red', view: 'discount', label: '할인' },
  ] as const;

  return (
    <>
      <div className='flex gap-2 px-4'>
        {buttons.map(({ variant, view, label }) => (
          <Button
            className='w-full gap-1'
            variant={variant}
            onClick={() => setView(view)}
          >
            <IoIosAddCircle />
            {label}
          </Button>
        ))}
      </div>
      <main>{/* 장바구니 목록 렌더링 */}</main>
    </>
  );
};

export default CartPage;
