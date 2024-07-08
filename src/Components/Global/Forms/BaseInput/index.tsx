import React from "react";
import { TextInputProps, TextInput } from "react-native";

import Theme from "../../../../styles/themes";
import { View } from "react-native";
import { Image } from "react-native";

interface InputProps extends TextInputProps {}

export function BaseInput({ ...rest }: InputProps) {
  return (
    <View className=" flex flex-row border-[0.4px] h-14  bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
      <TextInput
        className="  p-2 text-lg text-white w-[90%] "
        placeholderTextColor={Theme.color.gray_30}
        {...rest}
      />
      <Image
        className="w-5 h-5 ml-auto"
        source={require("../../../../../assets/Global/Icons/pencilAndPaper.png")}
      />
    </View>
  );
}
