import { XCircle } from "phosphor-react";
import React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { ICreateOrder } from "../constants/interface";
import { formatPrice } from "../constants/utils";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  createOrder: ICreateOrder;
}

const ConfirmOrder: React.FC<IProps> = ({
  isOpen,
  onClose,
  createOrder,
  ...rest
}: IProps) => {
  console.log(typeof createOrder.paymentMoney);
  return (
    <Modal title="Confirm Order" isOpen={isOpen} onClose={onClose}>
      <Container>
        <Wrap>
          <Row>
            <Title>User Name</Title>
            <Value>{createOrder?.username}</Value>
          </Row>
          <Row>
            <Title>Email</Title>
            <Value>{createOrder?.email}</Value>
          </Row>
          <Row>
            <Title>Phone</Title>
            <Value>{createOrder?.phone}</Value>
          </Row>
          <RowCart>
            <Title>Carts</Title>
            <Wrap>
              {createOrder?.carts.length > 0 &&
                createOrder?.carts.map((item, index) => (
                  <Row key={index}>
                    <Value>{item.product.name} </Value>
                    <Value>{formatPrice(item.product.price)} VND</Value>
                    <Value>{item.amount}</Value>
                  </Row>
                ))}
            </Wrap>
          </RowCart>
          <Row>
            <Title>Total Payment</Title>
            <Value>{formatPrice(createOrder.totalPayment ?? 0)} VND</Value>
          </Row>
          <Row>
            <Title>Payment Type</Title>
            <Value>{createOrder?.paymentType}</Value>
          </Row>
          {createOrder?.paymentType === "CASH" && (
            <>
              <Row>
                <Title>Payment Money</Title>
                <Value>{formatPrice(createOrder.paymentMoney ?? 0)} VND</Value>
              </Row>
              <Row>
                <Title>Money Remaining</Title>
                <Value>
                  {createOrder.moneyRemaining
                    ? `${formatPrice(createOrder.moneyRemaining ?? 0)} VND`
                    : ""}
                </Value>
              </Row>
            </>
          )}
        </Wrap>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
`;

const Row = styled.div`
  display: flex;
  align-items: left;
  gap: 24px;
`;

const RowCart = styled.div`
  display: flex;
  gap: 20px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Title = styled.div`
  min-width: 160px;
  font-size: 18px;
  text-align: left;
  font-weight: 600;
`;

const Value = styled.div`
  min-width: 40px;
  font-size: 18px;
  text-align: left;
`;

export default ConfirmOrder;
