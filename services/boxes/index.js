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

export const getAdminOwnedProducts = async (params = {}) => {
  const { page = 1, limit = 12, category, search, sortBy } = params;

  // Build query string
  let queryString = `ownerType=Admin`;

  // Add pagination parameters
  queryString += `&page=${page}&limit=${limit}`;

  // Add category filter if provided and not "all"
  if (category && category !== "all") {
    queryString += `&category=${category}`;
  }

  // Add search filter if provided
  if (search) {
    queryString += `&name=${encodeURIComponent(search)}`;
  }

  // Add sorting parameters
  if (sortBy) {
    switch (sortBy) {
      case "newest":
        queryString += `&date=-1`;
        break;
      case "alphabetical":
        queryString += `&alphabetical=1`;
        break;
      case "price-low-high":
        queryString += `&price=1`;
        break;
      case "price-high-low":
        queryString += `&price=-1`;
        break;
      case "most-popular":
        queryString += `&top=-1`;
      default:
        queryString += ``;
        break;
    }
  }

  const { data } = await http.get(`/products?${queryString}&isActive=true`);
  return data;
};
