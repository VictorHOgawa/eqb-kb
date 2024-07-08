import { Entypo, Feather } from "@expo/vector-icons";
import { FlatList, FlatListProps } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import Theme from "../../../../styles/themes";

// export const Container = styled(LinearGradient)`
// margin-top: 10px;
// flex-direction:row;
// align-items: center;
// justify-content: space-between;
// border-radius: ${RFValue(8)}px;
// border-width: 1px;
// border-color: ${Theme.color.light};
// align-self: center;
// padding:4px 10px;
// width: ${RFValue(230)}px;
// height: ${RFValue(45)}px;
// `

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  justify-content: space-between;
  padding: 4px 10px;
  width: 70%;
  height: ${RFValue(45)}px;
  border-radius: ${RFValue(8)}px;
  background-color: transparent;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: center;
  padding: 4px 10px;
  width: 100%;
  height: 100%;
`;

export const Title = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${Theme.color.gray_10};
  margin-left: 10px;
  margin-right: 10px;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const LocationIcon = styled(Entypo)`
  font-size: 25px;
  color: ${Theme.color.primary_100};
`;

export const Icon = styled(Feather)`
  font-size: 25px;
  color: ${Theme.color.gray_10};
`;

export const ModalBody = styled.View`
  width: 100%;
  height: ${RFPercentage(60)}px;
  margin-top: 60%;
`;

export const CityRow = styled.View`
  flex-direction: row;
  background-color: ${Theme.color.gray_10};
  align-items: center;
  justify-content: center;
  margin-top: ${RFPercentage(5)}px;
`;

export const CityText = styled.Text`
  color: ${Theme.color.secondary_100};
  font-size: ${RFValue(25)}px;
  font-family: ${Theme.fonts.Poppins.Regular};
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
