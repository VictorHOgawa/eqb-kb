import { FlatList, FlatListProps } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

export const Container = styled.View`
  width: 95%;
  align-self: center;
  flex: 1;
`;

export const Card = styled.View`
  background-color: ${Theme.color.secondary_100};
  border-radius: 10px;
  padding: 5px 2px;
  width: 100%;
  align-self: center;
  margin-bottom: ${RFValue(20)}px;
`;

export const Details = styled.View`
  flex-direction: row;
  width: 80%;
  justify-content: space-between;
`;

export const TicketImage = styled.Image`
  width: ${RFValue(70)}px;
  height: ${RFValue(70)}px;
  border-radius: 10px;
`;

export const Icons = styled.Image``;

export const Text1 = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(10)}px;
  font-family: ${Theme.fonts.Poppins.Regular};
  margin-top: 5px;
  text-align: left;
  align-self: flex-start;
  font-weight: bold;
`;

export const Area = styled.View`
  border-style: solid;
  border-color: ${Theme.color.primary_60};
  border-width: 1px;
  border-radius: 5px;
  padding: 0 2px;
  height: ${RFValue(22)}px;
`;

export const Match = styled.Image`
  align-self: flex-end;
`;

export const Help = styled.TouchableOpacity`
  flex-direction: row;
  background-color: black;
  color: ${Theme.color.gray_10};
  border: 1px solid ${Theme.color.gray_10};
  border-radius: 10px;
  padding: 5px 10px;
  margin-top: auto;
  align-self: center;
  position: absolute;
  bottom: 2%;
`;

export const Map = styled(
  FlatList as new (props: FlatListProps<any>) => FlatList<any>
).attrs({
  showsHorizontalScrollIndicator: false,
})`
  width: 98%;
  margin-top: 15px;
  margin-left: 1%;
`;

export const Test = styled.View`
  width: 50px;
  height: 50px;
`;

export const Close = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: blue;
`;

export const MainModalBody = styled.View`
  width: 100%;
  height: 90%;
  background-color: ${Theme.color.background};
  align-self: center;
`;

export const QrCodeImage = styled.Image`
  width: ${RFValue(300)}px;
  height: ${RFValue(300)}px;
  align-self: center;
  margin-top: 5%;
`;

export const NoProducts = styled.View`
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 20%;
`;

export const ModalBody = styled.View`
  background: ${Theme.color.primary_40};
  align-self: center;
  width: 100%;
`;

export const Icon = styled.Image`
  width: ${RFValue(20)}px;
  height: ${RFValue(20)}px;
`;
