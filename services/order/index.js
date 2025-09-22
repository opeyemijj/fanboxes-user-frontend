import http from "../http";

export const getShippingFeePercentage = async () => {
  const { data } = await http
    .get(`/user/credits/get-shipping-percentage`)
    .catch((e) => {
      throw e;
    });
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await http.post(`/orders/create`, payload).catch((e) => {
    throw e;
  });
  return data;
};
