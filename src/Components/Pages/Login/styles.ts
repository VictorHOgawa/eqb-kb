import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

export const Container = styled.View`
  width: 80%;
  background-color: ${Theme.color.secondary_100};
  border-radius: ${RFValue(15)}px;
  align-self: center;
  padding: ${RFValue(15)}px;
  margin-top: ${RFValue(10)}px;
`;

export const FormContainer = styled.View`
  width: 100%;
`;

export const Label = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Input = styled.TextInput`
  width: 100%;
  background-color: transparent;
  color: ${Theme.color.gray_10};
  padding: ${RFValue(5)}px;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Remember = styled.TouchableOpacity`
  margin-top: ${RFValue(10)}px;
`;

export const Title = styled.Text`
  color: ${Theme.color.gray_10};
  text-decoration: underline;
  text-decoration-color: ${Theme.color.gray_10};
  text-align: center;
  font-size: ${RFValue(15)}px;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Icon = styled.Image`
  width: ${RFValue(25)}px;
  height: ${RFValue(25)}px;
`;

export const LoginArts = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 10px;
`;
