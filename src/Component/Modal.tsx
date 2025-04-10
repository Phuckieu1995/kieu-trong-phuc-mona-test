import { XCircle } from "phosphor-react";
import React from "react";
import styled from "styled-components";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #405282;
  padding: 2rem;
  border-radius: 12px;
  max-width: 650px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  color: #fff;
`;

const CloseButton = styled.button`
  color: #fff;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 8px;
  font-size: 28px;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalBox onClick={stopPropagation}>
        <CloseButton onClick={onClose}>
          <XCircle size={24} />
        </CloseButton>
        {title && <Title>{title}</Title>}
        {children}
      </ModalBox>
    </Overlay>
  );
};

export default Modal;
