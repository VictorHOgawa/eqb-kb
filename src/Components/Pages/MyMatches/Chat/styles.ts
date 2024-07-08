import { FlatList, FlatListProps } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../../styles/themes";

interface ChatProps {
  active: boolean;
}

export const Container = styled.ScrollView`
  margin-top: 15px;
`;

export const Chats = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${Theme.color.secondary_40};
  border-radius: 10px;
  padding: 5px;
  margin-bottom: ${RFValue(10)}px;
  justify-content: space-between;
  width: 100%;
`;

export const Map = styled(
  FlatList as new (props: FlatListProps<any>) => FlatList<any>
).attrs({
  showsHorizontalScrollIndicator: false,
})`
  width: 100%;
`;

export const Person = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: 100px;
`;

export const Name = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(15)}px;
  font-family: ${Theme.fonts.Poppins.Bold};
`;

export const LocationImage = styled.Image`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: 5px;
`;

export const LocationName = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(10)}px;
  font-family: ${Theme.fonts.Poppins.Bold};
`;

export const ChatIcon = styled.Image<ChatProps>`
  width: ${({ active }) => (active ? RFValue(20) : RFValue(30))}px;
  height: ${({ active }) => (active ? RFValue(20) : RFValue(30))}px;
  margin-top: ${({ active }) => (active ? RFValue(5) : 0)}px;
`;

export const OpenChat = styled.TouchableOpacity<ChatProps>`
  width: ${({ active }) => (active ? RFValue(20) : RFValue(30))}px;
  height: ${({ active }) => (active ? RFValue(20) : RFValue(30))}px;
  align-self: center;
`;

export const NoMatches = styled.View`
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: ${RFValue(10)}px;
`;

export const NoMatchesText = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(16)}px;
  font-family: ${Theme.fonts.Poppins.Bold};
  text-align: center;
`;
