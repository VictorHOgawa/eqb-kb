import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../../styles/themes";

export const Container = styled.View``;

export const NightPremium = styled.TouchableOpacity`
  width: ${RFValue(310)}px;
  height: ${RFValue(90)}px;
  border-radius: 10px;
  align-self: center;
  margin-top: 2%;
`;

export const NightPremiumImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

export const Label = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
  margin-top: ${RFValue(10)}px;
`;
