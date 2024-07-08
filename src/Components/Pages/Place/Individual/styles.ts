import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../../styles/themes";

export const Container = styled.View`
  width: 90%;
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 5%;
  padding-bottom: 2%;
  border-bottom-width: 1px;
  border-bottom-color: ${Theme.color.gray_10};
  border-bottom-style: solid;
`;

export const Left = styled.View``;

export const Info = styled.View`
  flex-direction: row;
  align-items: center;
  width: 80%;
`;

export const Icon = styled.Image`
  width: ${RFValue(12)}px;
  height: ${RFValue(12)}px;
  margin-right: 5px;
`;

export const Text = styled.Text`
  font-family: ${Theme.fonts.Poppins.Regular};
  color: ${Theme.color.gray_10};
`;
