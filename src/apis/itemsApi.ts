import instance from './instance';

export const getServiceItems = async () => {
  const response = await instance.get('/');
  return response.data.items || {};
};

export const getDiscountItems = async () => {
  const response = await instance.get('/');
  return response.data.discounts || {};
};
