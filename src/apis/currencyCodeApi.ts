import instance from './instance';

export const getCurrencyCode = async () => {
  const response = await instance.get('/');
  return response.data.currency_code || 'KRW';
};
