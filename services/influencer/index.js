import http from "../http";
export const getInfluencerProductBySlug = async (slug) => {
  const { data } = await http.get(`/vendor/products/${slug}`);
  return data;
};

export const getInfluencerShop = async () => {
  const { data } = await http.get(`/vendor/shop`);
  return data;
};
export const influencerDashboardAnalytics = async () => {
  const { data } = await http.get(`/vendor/dashboard-analytics`);
  return data;
};
export const getInfluencerLowStockProducts = async (page) => {
  const { data: response } = await http.get(
    `/vendor/low-stock-products?page=${page}`
  );
  return response;
};
export const getInfluencerProducts = async (page, search) => {
  const { data: response } = await http.get(
    `/vendor/products?search=${search}&page=${page}`
  );
  return response;
};
export const deleteInfluencerProduct = async (slug) => {
  const { data: response } = await http.delete(`/vendor/products/${slug}`);
  return response;
};
export const createInfluencerProduct = async (payload) => {
  const { data: response } = await http.post(`/vendor/products`, payload);
  return response;
};
export const createInfluencerBoxItem = async (payload) => {
  // console.log(payload, "OKK SEE");
  const { data: response } = await http.post(`/vendor/boxItem`, payload);
  return response;
};
export const updateInfluencerProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(
    `/vendor/products/${currentSlug}`,
    payload
  );
  return response;
};
export const getOrdersByInfluencer = async (payload) => {
  const { data } = await http.get(`/vendor/orders?${payload}`);
  return data;
};
export const addShopByInfluencer = async (payload) => {
  const { data } = await http.post(`/vendor/shops`, payload);
  return data;
};
export const updateShopByInfluencer = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/vendor/shops/${currentSlug}`, payload);
  return data;
};
export const getShopDetailsByInfluencer = async () => {
  const { data } = await http.get(`/vendor/shop/stats`);
  return data;
};
export const getIncomeByInfluencer = async (slug, page) => {
  const { data } = await http.get(`/vendor/shops/income?page=${page || 1}`);
  return data;
};

export const incrementVisitCount = async (slug) => {
  const { data } = await http.patch(`/influencer/${slug}/visit`);
  return data;
};

export const followInfluencer = async (shopId) => {
  const { data } = await http.put(`/shops/${shopId}/follow`).catch((err) => {
    throw err;
  });
  return data;
};
