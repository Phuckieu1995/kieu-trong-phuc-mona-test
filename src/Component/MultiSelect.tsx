import styled from "styled-components";
import { FieldWrapBottom, FieldWrapTop } from "./CreateOrder";
import { useState, useRef, useEffect } from "react";
import { IProduct } from "../constants/interface";
import { formatPrice } from "../constants/utils";
import { CaretDown } from "phosphor-react";

interface IProps {
  options?: IProduct[];
  optionSelectedIds?: string[];
  handleOptionSelect: (id: string) => void;
  onClickEvent: () => void;
}

const MultiSelect = ({
  options,
  optionSelectedIds,
  handleOptionSelect,
  onClickEvent,
}: IProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenOptions = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <Container onClick={onClickEvent} ref={divRef}>
      <FieldWrapBottom
        height="40px"
        onClick={handleOpenOptions}
        width={"fit-content"}
      >
        <FieldWrapTop>
          <SelectBtn>
            <SelectTitle>Select Product</SelectTitle>
            <ArrowIcon isRolate={isOpen ? 1 : 0}>
              <CaretDown size={16} />
            </ArrowIcon>
          </SelectBtn>
        </FieldWrapTop>
      </FieldWrapBottom>
      <OptionContainer isOpen={isOpen ? 1 : 0}>
        <FieldWrapBottom height="100%">
          <FieldWrapTop>
            <Options>
              {options?.map((item, index) => (
                <Option
                  active={optionSelectedIds?.includes(item.id) ? 1 : 0}
                  key={index}
                  onClick={() => handleOptionSelect(item.id)}
                >
                  {item?.name} , {formatPrice(item.price)}
                  {" VND"}
                  <input
                    type="checkbox"
                    checked={optionSelectedIds?.includes(item.id)}
                    //onChange={() => handleOptionSelect(item.id)}
                  />
                </Option>
              ))}
            </Options>
          </FieldWrapTop>
        </FieldWrapBottom>
      </OptionContainer>
    </Container>
  );
};

export default MultiSelect;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SelectBtn = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 8px;
`;

const SelectTitle = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
`;

const OptionContainer = styled.div<{ isOpen: number }>`
  position: absolute;
  width: 100%;
  height: 150px;
  transition: all 0.2s ease-in-out;
  transform-origin: top;
  transform: ${(p) => (p?.isOpen === 0 ? "scaleY(0)" : "scaleY(100%)")};
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
  margin-top: 4px;
  transition: all 0.2s ease-in-out;
  :hover {
    color: #00b3ff;
  }
`;

const Option = styled.div<{ active: number }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${(p) => (p?.active === 0 ? "#fff" : "#00b3ff")};
  transition: all 0.2s ease-in-out;
`;

const ArrowIcon = styled.div<{ isRolate: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  transition: all 0.3s ease-in-out;
  transform: ${(p) => (p?.isRolate === 0 ? "rolate(0)" : "rotate(180deg)")};
`;
