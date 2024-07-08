import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import Theme from "../../../../../styles/themes";

export const Container = styled.View`
  margin-top: 20px;
`;

export const ImageContainer = styled.View`
  border: 1px dashed ${Theme.color.gray_10};
  width: ${RFValue(80)}px;
  height: ${RFValue(120)}px;
  align-items: center;
  justify-content: center;
  background-color: ${Theme.color.secondary_100};
  margin: ${RFValue(5)}px;
`;

export const Button = styled(TouchableOpacity)`
  justify-content: center;
  width: ${RFValue(80)}px;
  height: ${RFValue(120)}px;
`;

export const PickedPhoto = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(120)}px;
`;

export const ImageBackground = styled.ImageBackground`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${RFValue(10)}px;
  color: ${Theme.color.gray_10};
  text-align: center;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Label = styled.Text`
  font-size: ${RFValue(18)}px;
  color: ${Theme.color.secondary_100};
  font-family: ${Theme.fonts.Poppins.Bold};
`;

export const LabelContainer = styled.View`
  margin-left: 5px;
`;
export const LabelBar = styled.View`
  width: 15%;
  height: ${RFValue(8)}px;
  background-color: ${Theme.color.primary_100};
`;
