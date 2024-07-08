import { FlatList, FlatListProps } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../styles/themes";

export const Container = styled.View`
  flex: 1;
  background-color: ${Theme.color.background};
  padding-bottom: 100px;
`;

export const Text = styled.Text`
  font-family: ${Theme.fonts.Poppins.Regular};
  color: ${Theme.color.gray_10};
`;

export const JobCard = styled.View`
  background-color: ${Theme.color.secondary_100};
  border-radius: 10px;
  padding: 10px 5px;
  margin-top: 2%;
  width: 95%;
  align-self: center;
`;

export const Image = styled.Image`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  border-radius: 5px;
  object-fit: cover;
`;

export const Icon = styled.Image`
  width: ${RFValue(12)}px;
  height: ${RFValue(12)}px;
`;

export const Help = styled.TouchableOpacity`
  flex-direction: row;
  background-color: black;
  color: ${Theme.color.gray_10};
  border: 1px solid ${Theme.color.gray_10};
  border-radius: 10px;
  padding: 5px 10px;
  align-self: center;
  position: absolute;
  bottom: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
`;

export const Map = styled(
  FlatList as new (props: FlatListProps<any>) => FlatList<any>
).attrs({
  showsHorizontalScrollIndicator: false,
})`
  width: 100%;
  margin-top: 15px;
`;

export const ModalBody = styled.View`
  background-color: ${Theme.color.secondary_100};
  border-radius: 10px;
  width: 90%;
  padding: 10px;
  align-self: center;
  margin-top: 50%;
  align-items: center;
`;

export const EventPhoto = styled.Image`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  border-radius: 10px;
`;

export const Names = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Bold};
  font-size: ${RFValue(20)};
`;

export const TicketIcon = styled.Image`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
`;
