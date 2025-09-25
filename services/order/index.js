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

export const getMyOrderHistory = async (payload = {}) => {
  const { page = 1, limit = 20, fromDate, toDate } = payload;

  // Build query params
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  if (fromDate) {
    params.append("startDate", fromDate);
  }

  if (toDate) {
    params.append("endDate", toDate);
  }

  const { data } = await http
    .get(`/user/orders?${params.toString()}`)
    .catch((err) => {
      throw err;
    });
  return data;
};
