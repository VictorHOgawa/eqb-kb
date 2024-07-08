import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

export const Container = styled.TouchableOpacity`
  position: absolute;
  left: 85%;
  bottom: 0;
  border-radius: 200px;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
`;

export const Icon = styled.Image`
  width: 100%;
  height: 100%;
`;

export const ModalBody = styled.View`
  background: ${Theme.color.primary_40};
  align-self: center;
  width: ${RFValue(250)}px;
`;

export const Input = styled.TextInput`
  background-color: ${Theme.color.secondary_100};
  border: 0;
  border-radius: 10px;
  color: ${Theme.color.gray_10};
  width: 90%;
  align-self: center;
  margin-top: 2%;
  padding: 2%;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Text1 = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Bold};
  font-weight: bold;
`;

export const Display = styled.View`
  align-items: center;
  justify-content: center;
  background-color: ${Theme.color.secondary_100};
  border-radius: 10px;
  padding: 2px 10px;
  width: ${RFValue(60)}px;
`;

export const SmallIcon = styled.Image`
  width: ${RFValue(20)}px;
  height: ${RFValue(20)}px;
`;
