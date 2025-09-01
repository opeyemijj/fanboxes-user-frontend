import http from "../http";

export const getProducts = async (query = "", cat, rate) => {
  const { data } = await http.get(`/products${query || "?"}&rate=${rate}`);
  return data;
};
export const getProductDetails = async (pid) => {
  const { data } = await http.get(`/products/${pid}`);
  return data;
};
export const getProductsByCategory = async (query = "", category, rate) => {
  const { data } = await http.get(
    `/category/products/${category}${query || "?"}&rate=${rate}`
  );
  return data;
};
export const getProductsByCompaign = async (query = "", slug, rate) => {
  const { data } = await http.get(
    `/compaign/products/${slug}${query || "?"}&rate=${rate}`
  );
  return data;
};

export const getProductSlugs = async () => {
  const { data } = await http.get(`/products-slugs`);
  return data;
};
export const getProductsBySubCategory = async (
  query = "",
  subcategory,
  rate
) => {
  const { data } = await http.get(
    `/subcategory/products/${subcategory}${query || "?"}&rate=${rate}`
  );
  return data;
};

export const getProductsByShop = async (query = "", shop, rate) => {
  const { data } = await http.get(
    `/shop/products/${shop}${query || "?"}&rate=${rate}`
  );
  return data;
};

export const getAllProducts = async () => {
  const { data } = await http.get(`/products`);
  return data;
};
export const getAllFilters = async () => {
  const { data } = await http.get(`/products/filters`);
  return data;
};

export const getNewProducts = async () => {
  const { data } = await http.get(`/products/new`);
  return data;
};
export const getFiltersByShop = async (shop) => {
  const { data } = await http.get(`/filters/${shop}`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get("/new-arrivals");
  return data;
};
export const getRelatedProducts = async (pid) => {
  const { data } = await http.get(`/related-products/${pid}`);
  return data;
};
export const getProductBySlug = async (slug) => {
  const { data } = await http.get(`/products/${slug}`);
  return data;
};

export const getProductReviews = async (pid) => {
  const { data } = await http.get(`/reviews/${pid}`);
  return data;
};
