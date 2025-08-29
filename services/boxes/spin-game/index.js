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
