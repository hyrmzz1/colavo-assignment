import { Button } from './ui/button';

const Footer = () => {
  return (
    <div className='border-gray-light flex w-full flex-col items-center gap-y-2 border-t-2 px-4 py-2'>
      <div className='flex w-full items-center justify-between'>
        <p className='text-gray text-xs'>합계</p>
        <p className='text-xl'>0원</p>
      </div>
      <Button className='w-full'>다음</Button>
    </div>
  );
};

export default Footer;
