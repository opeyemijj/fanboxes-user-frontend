import http from "../../http";

export async function initializeSpin(payload) {
  // payload = {clientSeed,nonce,boxId,items};
  const { data } = await http.post("/user/spin", payload);
  return data;
}

export const getSpinsByAdmin = async () => {
  const { data } = await http.get(`admin/spins`);
  return data;
};

export const getSpinWinningItem = async (payload) => {
  const { data } = await http.post(`/user/spin-verify`, payload);
  return data;
};

export const getMySpinHistory = async (payload = {}) => {
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
    .get(`/user/spin-history?${params.toString()}`)
    .catch((err) => {
      throw err;
    });
  return data;
};
