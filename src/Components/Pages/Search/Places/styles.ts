import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import Theme from "../../../../styles/themes";

export const Button = styled.TouchableOpacity`
  margin-right: 10px;
`;

export const Container = styled(LinearGradient)`
  width: ${RFValue(210)}px;
  height: auto;
  margin-left: ${RFValue(10)}px;
  background-color: ${Theme.color.secondaryFadePlus};
  justify-content: space-between;
  border-radius: ${RFValue(10)}px;
  padding-bottom: 5px;
`;

export const Image = styled.Image`
  width: 100%;
  height: ${RFValue(100)}px;
  border-radius: 10px;
`;

export const DetailsContainer = styled.View`
  padding: ${RFValue(5)}px;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

export const TextContainer = styled.View`
  padding: ${RFValue(5)}px;
  flex-direction: column;
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${RFValue(12)}px;
  margin-top: ${RFValue(5)}px;
  margin-left: ${RFValue(5)}px;
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const City = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(8)}px;
  margin-top: 5px;
  font-family: ${Theme.fonts.Poppins.Regular};
`;
