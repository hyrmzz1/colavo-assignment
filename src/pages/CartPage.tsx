import useViewStore from '@/stores/useViewStore';
import useCartStore from '@/stores/useCartStore';
import { IoIosAddCircle } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { CartDiscountItem, CartServiceItem } from '@/components/CartItem';

const CartPage = () => {
  const setView = useViewStore((state) => state.setView);
  const selectedServices = useCartStore((state) => state.selectedServices);
  const selectedDiscounts = useCartStore((state) => state.selectedDiscounts);

  const buttons = [
    { variant: 'gray', view: 'service', label: '시술' },
    { variant: 'red', view: 'discount', label: '할인' },
  ] as const;

  return (
    <>
      <div className='flex gap-2 px-4'>
        {buttons.map(({ variant, view, label }) => (
          <Button
            key={view}
            className='w-full gap-1'
            variant={variant}
            onClick={() => setView(view)}
          >
            <IoIosAddCircle />
            {label}
          </Button>
        ))}
      </div>

      <main className='divide-y-[1px] pt-4'>
        {/* 선택된 시술 항목 렌더링 */}
        {Array.from(selectedServices.values()).map((service) => (
          <CartServiceItem key={service.key} {...service} />
        ))}

        {/* 선택된 할인 항목 렌더링 */}
        {Array.from(selectedDiscounts.values()).map((discount) => (
          <CartDiscountItem key={discount.key} {...discount} />
        ))}
      </main>
    </>
  );
};

export default CartPage;
