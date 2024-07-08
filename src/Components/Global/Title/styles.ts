import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import Theme from "../../../styles/themes";

interface TitleProps {
  fontSize?: number;
  background?: string;
  color?: string;
  marginTop?: number;
}

export const Container = styled.View<TitleProps>`
  flex-direction: column-reverse;
  margin-left: 5%;
  margin-top: ${({ marginTop }) => (marginTop ? RFValue(marginTop) : 0)};
`;

export const TitleContainer = styled.View<TitleProps>`
  width: ${({ fontSize }) =>
    fontSize ? RFValue(80 - fontSize) : RFValue(80)}px;
  height: ${RFValue(6)}px;
  background-color: ${({ background }) =>
    background ? background : Theme.color.primary_100};
`;

export const Title = styled.Text<TitleProps>`
  font-size: ${({ fontSize }) =>
    fontSize ? RFValue(fontSize) : RFValue(20)}px;
  color: ${({ color }) => (color ? color : Theme.color.gray_10)};
  font-family: ${Theme.fonts.Poppins.Bold};
`;
