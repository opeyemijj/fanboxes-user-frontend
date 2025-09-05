import http from "../http";

export const fetchCarouselItems = async () => {
  const { data } = await http.get(`/home/hero-carousel/active`);
  return data;
};
