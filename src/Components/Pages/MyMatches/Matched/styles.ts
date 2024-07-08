import { styled } from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { FlatList, FlatListProps } from "react-native";
import Theme from "../../../../styles/themes";

interface LockedProps {
  locked: boolean;
}

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
  width: 98%;
  margin-top: 15px;
  border-bottom-color: ${Theme.color.background};
  border-bottom-width: 1px;
  border-bottom-style: solid;
`;

export const PersonView = styled.View`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
`;

export const Person = styled.Image<LockedProps>`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  opacity: ${({ locked }) => (locked ? 0.3 : 1)};
  border-radius: 100px;
`;

export const Locked = styled.Image`
  position: absolute;
  width: ${RFValue(25)}px;
  height: ${RFValue(25)}px;
`;
