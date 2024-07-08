import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../../styles/themes";

export const Container = styled.View`
  flex-direction: row;
  align-self: center;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  width: 33%;
  margin-top: 5%;
  align-items: center;
  justify-content: center;
`;

export const Background = styled.Image`
  object-fit: contain;
  position: absolute;
`;

export const Text = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
  z-index: 2;
  font-size: ${RFValue(12)}px;
`;

export const Icon = styled.Image`
  width: ${RFValue(12)}px;
  height: ${RFValue(12)}px;
`;
