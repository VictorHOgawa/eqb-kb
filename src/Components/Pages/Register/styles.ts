import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

export const Container = styled.View`
  align-self: center;
`;

export const FormContainer = styled.View`
  width: 100%;
  background-color: ${Theme.color.secondary_100};
  border-radius: ${RFValue(15)}px;
  padding: ${RFValue(15)}px;
`;

export const Label = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
  margin-top: ${RFValue(10)}px;
`;
