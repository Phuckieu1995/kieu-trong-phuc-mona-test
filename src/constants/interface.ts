export interface IProduct {
  id: string;
  name: string;
  price: number;
}

export interface ICart {
  id: string;
  product: IProduct;
  amount: number;
}

export interface ICreateOrder {
  username: string;
  email: string;
  phone: string;
  carts: ICart[];
  totalPayment?: number;
  paymentType: "CASH" | "TRANSFER";
  paymentMoney?: number;
  moneyRemaining?: number;
}
