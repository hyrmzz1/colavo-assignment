import useViewStore from '@/stores/useViewStore';
import CartPage from './CartPage';
import ServicePage from './ServicePage';
import DiscountPage from './DiscountPage';

const Page = () => {
  const currView = useViewStore((state) => state.currView);

  return (
    <div className='grow'>
      {currView === 'cart' && <CartPage />}
      {currView === 'service' && <ServicePage />}
      {currView === 'discount' && <DiscountPage />}
    </div>
  );
};

export default Page;
