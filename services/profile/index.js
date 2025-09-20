import http from "../http";

export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`/users/profile`, payload);
  return data;
};
export const changePassword = async ({ ...payload }) => {
  const { data } = await http.put(`/users/change-password`, payload);
  return data;
};

export const getAddress = async (payload) => {
  const { data } = await http.get(`/users/addresses?id=${payload}`);
  return data;
};
export const updateAddress = async ({ _id, ...payload }) => {
  const { data } = await http.put(`/users/addresses/${_id}`, payload);
  return data;
};
export const createAddress = async ({ ...payload }) => {
  const { data } = await http.post(`/users/addresses/`, payload);
  return data;
};
export const deleteAddress = async ({ _id }) => {
  const { data } = await http.delete(`/users/addresses/${_id}`);
  return data;
};
export const getProfile = async () => {
  const { data } = await http.get(`/users/profile`);
  return data;
};

export const getCart = async (ids) => {
  const { data } = await http.post(`/cart`, {
    products: ids,
  });
  return data;
};

export const fetchWalletBalanceAndHistory = async (params = {}) => {
  try {
    const { limit, page, status, transactionType, fromDate, toDate } = params;

    // Create URLSearchParams object for proper URL encoding
    const searchParams = new URLSearchParams();

    // Add parameters only if they exist and are valid
    if (limit !== undefined && limit !== null)
      searchParams.append("limit", limit.toString());
    if (page !== undefined && page !== null)
      searchParams.append("page", page.toString());

    // Only add status if it exists and is not 'all'
    if (status && status !== "all") searchParams.append("status", status);

    if (transactionType)
      searchParams.append("transactionType", transactionType);
    if (fromDate) searchParams.append("fromDate", fromDate);
    if (toDate) searchParams.append("toDate", toDate);

    // Build the URL
    const queryString = searchParams.toString();
    const url = `/wallet/balance-and-history${
      queryString ? `?${queryString}` : ""
    }`;

    // console.log({ url });
    const { data } = await http.get(url);
    return data;
  } catch (err) {
    console.error("Error fetching balance:", err);
    throw err;
  }
};

export const updateMyShippingAddress = async (payload = {}) => {
  const { data } = await http
    .patch(`/users/update-shipping-address`, payload)
    .catch((err) => {
      throw err;
    });
  return data;
};

export const getTransactionByRefId = async (ref) => {
  const { data } = await http
    .get(`/wallet/get-transaction-by-ref?refId=${ref}`)
    .catch((err) => {
      throw err;
    });
  return data;
};
