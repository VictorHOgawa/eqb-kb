import { Image } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  width: 100%;
  height: ${RFValue(70)}px;
  align-items: center;
  align-self: center;
  margin-top: ${getStatusBarHeight() + 20}px;
  margin-right: 5%;
  justify-content: space-between;
`;

export const Logo = styled(Image)`
  width: 40%;
  height: ${RFValue(50)}px;
  margin-left: 5%;
  margin-right: -15%;
`;

export const AltLogo = styled(Logo)`
  margin-left: 10%;
`;

export const AltContainer = styled(Container)`
  justify-content: none;
`;
