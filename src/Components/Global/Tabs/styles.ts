import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";
import { RFValue } from "react-native-responsive-fontsize";

interface TabProps {
  active: ConstrainBoolean;
}

export const Container = styled.View<TabProps>`
  background-color: ${({ active }) =>
    active ? Theme.color.primary_80 : Theme.color.gray_10};
  width: ${RFValue(80)}px;
  height: ${RFValue(6)}px;
  border-radius: ${RFValue(10)}px;
`;
