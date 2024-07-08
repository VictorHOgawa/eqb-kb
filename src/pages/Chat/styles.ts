import { Dimensions, FlatList, FlatListProps } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import Theme from "../../styles/themes";

interface MessageProps {
  status: boolean;
}

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${Theme.color.primary_80};
`;

export const Header = styled.View`
  flex-direction: row;
  width: 100%;
  height: ${RFValue(70)}px;
  margin-top: ${getStatusBarHeight() + 20}px;
  align-items: center;
  justify-content: center;
  border-bottom-color: ${Theme.color.primary_20};
  border-bottom-style: solid;
  border-bottom-width: 2px;
  padding-bottom: ${RFValue(10)}px;
`;

export const Pic = styled.Image`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  border-radius: 100px;
`;

export const Name = styled.Text`
  font-family: ${Theme.fonts.Poppins.Regular};
  color: ${Theme.color.gray_10};
`;

export const MainView = styled.View`
  flex: 1;
`;

export const Input = styled.TextInput`
  width: 80%;
  height: ${RFValue(40)}px;
  border-radius: 10px;
  background-color: ${Theme.color.secondary_100};
  padding: ${RFValue(10)}px;
  font-family: ${Theme.fonts.Poppins.Regular};
  color: ${Theme.color.gray_10};
`;

export const MessageView = styled.View`
  flex: 1;
  background-color: ${Theme.color.primary_100};
  height: ${Dimensions.get("screen").height * 0.65};
  margin-bottom: 20%;
  padding: 0 10px;
  overflow: auto;
`;

export const MessageBubble = styled.View<MessageProps>`
  flex-direction: row;
  flex-grow: 1;
  align-self: ${({ status }) => (!status ? "flex-start" : "flex-end")};
  min-width: ${RFValue(40)}px;
  max-width: ${Dimensions.get("window").width - RFValue(80)}px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: ${({ status }) => (!status ? 0 : "20px")};
  border-bottom-right-radius: ${({ status }) => (!status ? "20px" : 0)};
  justify-content: ${({ status }) => (!status ? "flex-start" : "flex-end")};
  padding: ${RFValue(10)}px;
  background-color: ${({ status }) =>
    !status ? Theme.color.gray_10 : "#AA3FEC"};
  margin: ${RFValue(5)}px 0px;
`;

export const Message = styled.Text<MessageProps>`
  text-align: ${({ status }) => (!status ? "left" : "right")};
  color: ${({ status }) =>
    !status ? Theme.color.secondary_100 : Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
`;

export const Map = styled(
  FlatList as new (props: FlatListProps<any>) => FlatList<any>
).attrs({
  showsHorizontalScrollIndicator: false,
})`
  width: 100%;
  margin-top: 15px;
`;

export const OpenProfile = styled.TouchableOpacity``;

export const ModalBody = styled.View`
  background: ${Theme.color.primary_40};
  align-self: center;
  width: ${RFValue(250)}px;
`;

export const ProfilePic = styled.Image`
  align-self: center;
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  border-radius: 100px;
`;

export const ProfileName = styled.Text`
  color: ${Theme.color.gray_10};
  font-size: ${RFValue(18)}px;
  font-family: ${Theme.fonts.Poppins.Bold};
`;

export const ProfileDescription = styled.Text`
  color: ${Theme.color.gray_10};
  font-family: ${Theme.fonts.Poppins.Regular};
  font-size: ${RFValue(14)}px;
`;

export const ProfileSettings = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5%;
`;
