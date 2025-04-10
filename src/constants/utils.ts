export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("vn", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
