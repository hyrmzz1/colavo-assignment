import { IoClose } from 'react-icons/io5';

const Header = () => {
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
    <div className='flex items-center justify-between p-2'>
      <IoClose className='h-6 w-6 text-gray-400' />
      <div className='flex grow flex-col items-center'>
        <p className='text-sm'>양혜림</p>
        <p className='text-xs'>{formattedDate}</p>
      </div>
      <div className='h-6 w-6'></div>
    </div>
  );
};

export default Header;
