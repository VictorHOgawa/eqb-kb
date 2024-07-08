import styled from "styled-components/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Theme from "../../../../styles/themes";

export const Container = styled.View`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: row;
`;

export const EventCard = styled.View`
  width: ${RFValue(210)}px;
  height: ${RFValue(180)}px;
  margin-left: 10px;
`;

export const EventImage = styled.View`
  width: ${RFValue(210)}px;
  height: ${RFValue(100)}px;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 10px;
`;

export const Title = styled.View`
  width: ${RFValue(120)}px;
  height: ${RFValue(10)}px;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 10px;
  border-color: ${Theme.color.primary_100};
`;
