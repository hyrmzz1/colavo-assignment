import useViewStore from '@/stores/useViewStore';
import useCartStore from '@/stores/useCartStore';
import { CartDiscountItem, CartServiceItem } from '@/components/CartItem';
import { DiscountItemProps, ServiceItemProps } from '@/types/itemTypes';
import { IoIosAddCircle } from 'react-icons/io';
import { Button } from '@/components/ui/button';

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

      <ul className='divide-y-[1px] pt-4'>
        {Array.from(selectedServices.entries()).map(
          ([key, item]: [string, ServiceItemProps]) => (
            <li key={key}>
              <CartServiceItem
                itemKey={key}
                key={key}
                name={item.name}
                price={item.price}
                count={item.count}
              />
            </li>
          )
        )}

        {Array.from(selectedDiscounts.entries()).map(
          ([key, item]: [string, DiscountItemProps]) => (
            <li key={key}>
              <CartDiscountItem
                itemKey={key}
                key={item.key}
                name={item.name}
                rate={item.rate}
              />
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default CartPage;
