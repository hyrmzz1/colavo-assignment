import instance from './instance';

export const getServiceItems = async () => {
  const response = await instance.get('/');
  return {
    items: response.data.items || {},
    currencyCode: response.data.currency_code || 'KRW',
  };
};

export const getDiscountItems = async () => {
  const response = await instance.get('/');
  return {
    discounts: response.data.discounts || {},
    currencyCode: response.data.currency_code || 'KRW',
  };
};
