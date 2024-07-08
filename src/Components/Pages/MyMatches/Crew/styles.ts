import { AntDesign } from "@expo/vector-icons";
import { FlatList, FlatListProps } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../../styles/themes";

export const Container = styled.View``;

export const Icon = styled(AntDesign)`
  color: ${Theme.color.gray_10};
`;

export const InfoButton = styled.TouchableOpacity`
  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  margin-left: ${RFValue(20)}px;
`;

export const Map = styled(
  FlatList as new (props: FlatListProps<any>) => FlatList<any>
).attrs({
  showsHorizontalScrollIndicator: false,
})`
  width: 100%;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
`;

export const PersonView = styled.TouchableOpacity`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0 10px;
  margin-bottom: 10px;
`;

export const Person = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
`;

export const NoMatches = styled.View`
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 10px;
`;

export const NoMatchesText = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(16)}px;
  align-self: center;
  font-family: ${Theme.fonts.Poppins.Bold};
  text-align: center;
`;
