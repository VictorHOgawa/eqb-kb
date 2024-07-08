import { LinearGradient } from "expo-linear-gradient";
import { FlatList, FlatListProps } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../../../styles/themes";
interface Props {}

export const Container = styled.View`
  margin-top: 20px;
`;

export const Title = styled.Text`
  color: ${Theme.color.gray_10};
  text-align: center;
  font-family: ${Theme.fonts.Poppins.Bold};
`;

export const TicketType = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  margin-top: 5px;
  background-color: ${Theme.color.secondary_80};
  justify-content: space-between;

  /* background: linear-gradient(90deg, #8f00ff, #dd7cff); */

  width: 95%;
  max-width: 99%;
  align-self: center;
  border-radius: 5px;

  @media (min-width: 768px) {
    width: 90%;
  }
`;

export const TicketTitle = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(12)}px;
  margin-left: 5px;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const CounterArea = styled.View`
  flex-direction: row;
`;

export const Counter = styled.View`
  border: 1px solid ${Theme.color.gray_10};
  border-radius: 10px;
  width: 50px;
  justify-content: center;
  margin: 0 10px;
  padding-top: 2px;
`;

export const CounterText = styled.Text`
  text-align: center;
  color: white;
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Items = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const ItemButton = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  margin: 5px;
  border: 0;
  background-color: transparent;
`;

export const Item = styled.Image`
  width: 70px;
  height: 70px;
`;

export const Check = styled.View``;

export const Input = styled.TextInput``;

export const Clickable = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const IconButton = styled.TouchableOpacity``;

export const Icon = styled.Image`
  width: ${RFValue(20)}px;
  height: ${RFValue(20)}px;
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
