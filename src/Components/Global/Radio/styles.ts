import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

interface InsideProps {
  active: boolean;
}

export const Outside = styled.View`
  border-radius: 100px;
  background-color: transparent;
  border: 1px solid ${Theme.color.gray_10};
  width: ${RFValue(20)}px;
  height: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
`;

export const Inside = styled.View<InsideProps>`
  border-radius: 100px;
  background-color: ${(props) =>
    props.active ? `${Theme.color.gray_10}` : "transparent"};
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
`;
