import React from "react";
import { TextInputProps, TextInput } from "react-native";

import { View } from "react-native";
import { Image } from "react-native";

interface InputProps extends TextInputProps {}

export function CreditCardInput({ ...rest }: InputProps) {
  return (
    <View className=" flex flex-row border-[0.4px] bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
      <TextInput className="  p-2 text-lg text-white  " {...rest} />
      <Image
        className="w-5 h-5 ml-auto"
        source={require("../../../../../assets/Global/Icons/pencilAndPaper.png")}
      />
    </View>
  );
}
