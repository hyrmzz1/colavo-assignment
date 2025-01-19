import { PropsWithChildren } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='bg-gray-sub flex h-screen w-screen items-center justify-center'>
      <div className='flex h-full max-h-[920px] w-full max-w-[440px] flex-col bg-white shadow-lg'>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
