import { AllHTMLAttributes, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styled, { keyframes } from "styled-components";
import MultiSelect from "./MultiSelect";
import { IProduct, ICart, ICreateOrder } from "../constants/interface";
import {
  defaultCreateOrder,
  defaultProducts,
  PaymentType,
} from "../constants/mockData";
import { Backspace } from "phosphor-react";
import { formatPrice } from "../constants/utils";
import ConfirmOrder from "./ConfirmOrder";

const CreateOrder: React.FC = () => {
  const [createOrder, setCreateOrder] =
    useState<ICreateOrder>(defaultCreateOrder);
  const [products, setProducts] = useState<IProduct[]>(defaultProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const totalPayment = useMemo(() => {
    const total = createOrder.carts.reduce((acc, curr) => {
      const cartTotalPay = curr.amount * curr.product.price;
      return (acc += cartTotalPay);
    }, 0);

    setCreateOrder((prev) => {
      return {
        ...prev,
        totalPayment: total,
      };
    });

    return total;
  }, [
    createOrder.carts.length,
    createOrder.carts,
    selectedProducts.length,
    createOrder.paymentType,
  ]);

  const totalMoneyRemaining = useMemo(() => {
    if (createOrder.paymentMoney && createOrder.paymentMoney < totalPayment) {
      setCreateOrder((prev) => {
        return {
          ...prev,
          moneyRemaining: 0,
        };
      });

      return 0;
    }

    const totalRemaining = !createOrder.paymentMoney
      ? 0
      : createOrder.paymentMoney - totalPayment;

    setCreateOrder((prev) => {
      return {
        ...prev,
        moneyRemaining: totalRemaining,
      };
    });

    return totalRemaining;
  }, [totalPayment, createOrder.paymentMoney, createOrder.paymentType]);

  const handleChangeText = (e: any) => {
    setCreateOrder((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
      const foundCart = createOrder.carts.find(
        (item) => item.product.id === productId
      );
      if (!foundCart) return;
      setCreateOrder((prev) => {
        return {
          ...prev,
          carts: prev.carts.filter((item) => item.id !== foundCart.id),
        };
      });
    } else {
      setSelectedProducts([...selectedProducts, productId]);
      const newCart: ICart = {
        id: uuidv4().toString(),
        product: products.find((item) => item.id === productId) ?? products[0],
        amount: 1,
      };

      setCreateOrder((prev) => {
        return {
          ...prev,
          carts: [...prev.carts, newCart].sort(),
        };
      });
    }
  };

  const handleRemoveToCart = (cartId: string) => {
    const foundCart = createOrder.carts.find((item) => item.id === cartId);
    if (!foundCart) return;
    const newselectedProducts = selectedProducts.filter(
      (id) => id !== foundCart.product.id
    );
    setSelectedProducts(newselectedProducts);
    setCreateOrder((prev) => {
      return {
        ...prev,
        carts: prev.carts.filter((item) => item.id !== cartId),
      };
    });
  };

  const handleChangePrice = (cartId: string, newPrice: number) => {
    if (newPrice <= 0) return;

    const foundCart = createOrder.carts.find((item) => item.id === cartId);

    if (!foundCart) return;

    const newProduct = { ...foundCart.product, price: newPrice };

    setCreateOrder((prev) => {
      return {
        ...prev,
        carts: createOrder.carts.map((item) =>
          item.id === cartId ? { ...item, product: newProduct } : item
        ),
      };
    });

    setProducts(
      products.map((item) =>
        item.id === foundCart.product.id ? { ...item, price: newPrice } : item
      )
    );
  };

  const handleChangeAmount = (cartId: string, newAmount: number) => {
    if (newAmount < 0) return;

    const foundCart = createOrder.carts.find((item) => item.id === cartId);

    if (!foundCart) return;
    setCreateOrder((prev) => {
      return {
        ...prev,
        carts: prev.carts.map((item) =>
          item.id === cartId ? { ...item, amount: newAmount } : item
        ),
      };
    });
  };

  const handleChangeRadio = (type: "CASH" | "TRANSFER") => {
    setCreateOrder((prev) => {
      return {
        ...prev,
        paymentType: type,
        paymentMoney: type === "TRANSFER" ? 0 : prev.paymentMoney,
        moneyRemaining: type === "TRANSFER" ? 0 : prev.moneyRemaining,
      };
    });
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const regex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    return regex.test(phone);
  };

  const handleValidation = () => {
    if (
      !createOrder.username ||
      !createOrder.email ||
      !createOrder.phone ||
      !validateEmail(createOrder.email) ||
      !validatePhone(createOrder.phone) ||
      createOrder.carts.length === 0 ||
      (createOrder.paymentType === "CASH" && !createOrder.paymentMoney)
    ) {
      setIsError(true);
      return false;
    }

    return true;
  };

  const handleCreateOrder = async () => {
    const resultValid = handleValidation();

    if (!resultValid) return;
    setIsSubmiting(true);
    await new Promise((resolve) =>
      setTimeout(() => {
        setIsSubmiting(false);
        setIsOpenModal(true);
      }, 1000)
    );
  };

  return (
    <Container>
      <BigTitle>Create Order</BigTitle>
      <Form>
        <Title>Order Form</Title>
        <FormContent>
          <FieldGroup>
            <SubTitle>Name</SubTitle>
            <FieldWrapBottom>
              <FieldWrapTop>
                <CustomInput
                  onFocus={() => setIsError(false)}
                  name="username"
                  type="text"
                  onChange={handleChangeText}
                />
                {isError && !createOrder.username ? (
                  <ErrMessage>User Name is required</ErrMessage>
                ) : (
                  <></>
                )}
              </FieldWrapTop>
            </FieldWrapBottom>
          </FieldGroup>

          <FieldGroup>
            <SubTitle>Email</SubTitle>
            <FieldWrapBottom>
              <FieldWrapTop>
                <CustomInput
                  onFocus={() => setIsError(false)}
                  name="email"
                  type="email"
                  onChange={handleChangeText}
                />
                {isError && !createOrder.email ? (
                  <ErrMessage>Email is required</ErrMessage>
                ) : isError && !validateEmail(createOrder.email) ? (
                  <ErrMessage>Email is not in correct format.</ErrMessage>
                ) : (
                  <></>
                )}
              </FieldWrapTop>
            </FieldWrapBottom>
          </FieldGroup>

          <FieldGroup>
            <SubTitle>Phone</SubTitle>
            <FieldWrapBottom>
              <FieldWrapTop>
                <CustomInput
                  onFocus={() => setIsError(false)}
                  name="phone"
                  type="number"
                  maxLength={13}
                  onChange={(e) =>
                    setCreateOrder((prev) => {
                      return { ...prev, phone: e.target.value };
                    })
                  }
                />
                {isError && !createOrder.phone ? (
                  <ErrMessage>Phone is required</ErrMessage>
                ) : isError && !validatePhone(createOrder.phone) ? (
                  <ErrMessage>Phone is not in correct format.</ErrMessage>
                ) : (
                  <></>
                )}
              </FieldWrapTop>
            </FieldWrapBottom>
          </FieldGroup>

          <FieldGroup>
            <SubTitle>Products</SubTitle>
            <MultiSelect
              options={products}
              optionSelectedIds={selectedProducts}
              handleOptionSelect={handleProductSelect}
              onClickEvent={() => setIsError(false)}
            ></MultiSelect>
          </FieldGroup>

          <FieldGroup>
            <SubTitle>Carts</SubTitle>
            <Cart>
              {createOrder.carts.length > 0 ? (
                createOrder.carts.map((cart, index) => (
                  <CartItem key={index}>
                    <CartItemName>{cart.product.name}</CartItemName>
                    <FieldWrapBottom width="30%">
                      <FieldWrapTop>
                        <CustomInput
                          type="number"
                          maxLength={12}
                          value={cart.product.price}
                          onChange={(e: any) =>
                            handleChangePrice(
                              cart.id,
                              e?.target?.value as number
                            )
                          }
                        />
                      </FieldWrapTop>
                    </FieldWrapBottom>
                    <FieldWrapBottom width="20%">
                      <FieldWrapTop>
                        <CustomInput
                          type="number"
                          value={cart.amount}
                          onChange={(e: any) =>
                            handleChangeAmount(
                              cart.id,
                              e?.target?.value as number
                            )
                          }
                        />
                      </FieldWrapTop>
                    </FieldWrapBottom>
                    <IconWrap>
                      <Backspace
                        onClick={() => handleRemoveToCart(cart.id)}
                        size={24}
                      />
                    </IconWrap>
                  </CartItem>
                ))
              ) : isError && createOrder.carts.length === 0 ? (
                <ErrMessage>
                  The Cart is empty, please select any product
                </ErrMessage>
              ) : (
                <span>Empty Cart</span>
              )}
            </Cart>
            {createOrder.carts.length > 0 && (
              <TotalText>
                <span style={{ color: "#00b3ff" }}>Total</span>:{" "}
                {totalPayment ? `${formatPrice(totalPayment)} VND` : ""}
              </TotalText>
            )}
          </FieldGroup>

          <FieldGroup>
            <SubTitle>Payment Type</SubTitle>
            <RadioGroup>
              <label htmlFor="cash">
                <RadioInput
                  name="cash"
                  type="radio"
                  value={PaymentType.cash}
                  checked={createOrder.paymentType === PaymentType.cash}
                  onChange={() => handleChangeRadio("CASH")}
                />
                <RadioText onClick={() => handleChangeRadio("CASH")}>
                  {PaymentType.cash}
                </RadioText>
              </label>

              <label htmlFor="transfer">
                <RadioInput
                  name="transfer"
                  type="radio"
                  value={PaymentType.transfer}
                  checked={createOrder.paymentType === PaymentType.transfer}
                  onChange={() => handleChangeRadio("TRANSFER")}
                />
                <RadioText onClick={() => handleChangeRadio("TRANSFER")}>
                  {PaymentType.transfer}
                </RadioText>
              </label>
            </RadioGroup>
          </FieldGroup>

          {createOrder.paymentType === "CASH" && (
            <FieldGroup>
              <PaymentMoneyGroup>
                <PaymentCard>
                  <PaymentTitle>Payment Money</PaymentTitle>
                  <FieldWrapBottom>
                    <FieldWrapTop>
                      <CustomInput
                        value={createOrder.paymentMoney}
                        onChange={handleChangeText}
                        name="paymentMoney"
                        type="number"
                        maxLength={13}
                      />
                      {isError &&
                      createOrder.paymentType === "CASH" &&
                      !createOrder.paymentMoney ? (
                        <>
                          <ErrMessage>Please input money</ErrMessage>
                        </>
                      ) : (
                        <></>
                      )}
                    </FieldWrapTop>
                  </FieldWrapBottom>
                </PaymentCard>
                <PaymentCard>
                  <PaymentTitle>Money Remaining</PaymentTitle>
                  <FieldWrapBottom>
                    <FieldWrapTop>
                      <PaymentMoneyValue>
                        {totalMoneyRemaining > 0
                          ? `${formatPrice(totalMoneyRemaining)} VND`
                          : "0"}{" "}
                      </PaymentMoneyValue>
                    </FieldWrapTop>
                  </FieldWrapBottom>
                </PaymentCard>
              </PaymentMoneyGroup>
            </FieldGroup>
          )}
        </FormContent>
        <WrapButton>
          <CreateButton onClick={handleCreateOrder}>
            Create Order {isSubmiting && <Spiner />}{" "}
          </CreateButton>
        </WrapButton>
      </Form>
      {isOpenModal && (
        <ConfirmOrder
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          createOrder={createOrder}
        ></ConfirmOrder>
      )}
    </Container>
  );
};

export default CreateOrder;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 85vh;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
  overflow: hidden;
`;

const Form = styled.div`
  padding: 32px 24px;
  background: #1a2644;
  width: 50%;
  margin: 0 auto;
  min-height: 100px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BigTitle = styled.h3`
  width: fit-content;
  margin: 0;
  font-size: 40px;
  color: #fff;
`;

const Title = styled.h3`
  width: fit-content;
  margin: 0;
  margin-left: 2.5px;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  flex-grow: 1;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: space-between;
`;

export const FieldWrapBottom = styled.div<{ height?: string; width?: string }>`
  background: transparent;
  border-radius: 10px;
  height: ${(p) => (p?.height ? p?.height : "56px")};
  width: ${(p) => (p?.width ? p?.width : "100%")};
  padding: 2.5px;
  transition: all 0.1s ease-in-out;
  &:hover {
    background: linear-gradient(90deg, #a93eff, #5e40de, #00b3ff);
  }
`;

export const FieldWrapTop = styled.div<{ padding?: string; width?: string }>`
  background: #0e0e2a;
  height: 100%;
  border-radius: 8px;
  border: none;
  padding: ${(p) => (p?.padding ? p?.padding : "4px 8px")};
  width: ${(p) => (p?.width ? p?.width : "auto")};

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SubTitle = styled.span`
  color: #fff;
  font-size: 16px;
  text-align: left;
  margin-left: 2.5px;
`;

const ErrMessage = styled.p`
  width: 100%;
  color: red;
  font-size: 13px;
  text-align: left;
  margin-top: 4px;
`;

const CustomButton = styled.button`
  border: none;
  outline: none;
  color: #fff;
  border-radius: 16px;
  padding: 8px 16px;
  width: fit-content;
  background: linear-gradient(90deg, #a93eff, #5e40de, #00b3ff);
  transition: all 0.2s ease-in-out;
  &:focus,
  &:active {
    border: none;
    outline: none;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const CreateButton = styled(CustomButton)`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spiner = styled.div`
  border: 3px solid #fff;
  border-radius: 50%;
  border-left: none;
  border-top: none;
  background: transparent;
  width: 20px;
  height: 20px;
  animation: ${rotate} 2s linear infinite;
`;

export const CustomInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: 15px;
`;

const Cart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CartItemName = styled.span`
  font-size: 14px;
  min-width: 100px;
`;

const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const TotalText = styled.span`
  font-size: 16px;
  color: #fff;
  width: 100%;
  text-align: left;
  margin-top: 8px;
`;

const RadioGroup = styled.div`
  margin-top: 4px;
  display: flex;
  gap: 8px;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const RadioText = styled.span`
  font-size: 16px;
  cursor: pointer;
`;

const PaymentMoneyGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const PaymentCard = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PaymentTitle = styled.span`
  font-size: 16px;
  text-align: left;
  margin-left: 4px;
`;

const PaymentMoneyValue = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  height: 100%;
  font-size: 16px;
  text-align: left;
  margin-left: 4px;
`;

const WrapButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
