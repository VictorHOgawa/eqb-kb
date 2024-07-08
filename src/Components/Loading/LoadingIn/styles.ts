import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

export const Logo = styled.Image`
  width: ${RFValue(180)}px;
  height: ${RFValue(180)}px;
  position: absolute;
  align-self: center;
  top: 40%;
`;
