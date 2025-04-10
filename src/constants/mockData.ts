import { ICart, ICreateOrder, IProduct } from "./interface";

export const defaultProducts: IProduct[] = [
  {
    id: "1",
    name: "Iphone 11",
    price: 10000000,
  },
  {
    id: "2",
    name: "Iphone 12",
    price: 12500000,
  },
  {
    id: "3",
    name: "Iphone 13",
    price: 13000000,
  },
  {
    id: "4",
    name: "Iphone 14",
    price: 20000000,
  },
  {
    id: "5",
    name: "Iphone 15",
    price: 22400000,
  },
  {
    id: "6",
    name: "Iphone 16",
    price: 25400000,
  },
];

export const defaultCreateOrder: ICreateOrder = {
  username: "",
  email: "",
  phone: "",
  carts: [],
  totalPayment: 0,
  paymentType: "CASH",
  paymentMoney: 0,
  moneyRemaining: 0,
};

export const PaymentType = {
  cash: "CASH",
  transfer: "TRANSFER",
};
