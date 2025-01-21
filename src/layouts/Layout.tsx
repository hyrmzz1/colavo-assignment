import { PropsWithChildren } from 'react';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-sub'>
      <div className='flex h-full max-h-[920px] w-full max-w-[440px] flex-col bg-white shadow-lg'>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
