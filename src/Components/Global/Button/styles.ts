import { TextProps, TouchableOpacityProps } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

interface ContainerProps extends TouchableOpacityProps {
  width?: number;
  height?: number;
  marginTop: number;
  background?: string;
  loading?: boolean;
}

interface TitleProps extends TextProps {
  color?: string;
  fontSize?: number;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  width: ${({ width }) => (width ? RFValue(width) : RFValue(150))}px;
  height: ${({ height }) => (height ? RFValue(height) : RFValue(50))}px;
  background-color: ${({ background }) =>
    background ? background : Theme.color.secondary_100};
  border-radius: ${RFValue(10)}px;
  margin-top: ${({ marginTop }) => RFValue(marginTop)}px;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-direction: row;
  padding: ${RFValue(2)}px;
`;

export const Title = styled.Text<TitleProps>`
  font-size: ${({ fontSize }) =>
    fontSize ? RFValue(fontSize) : RFValue(15)}px;
  color: ${({ color }) => (color ? color : Theme.color.gray_10)};
  font-family: ${Theme.fonts.Poppins.Regular};
`;
