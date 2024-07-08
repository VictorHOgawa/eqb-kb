import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  TextInputProps,
  ViewProps,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import Theme from "../../../../styles/themes";

interface Props extends TextInputProps {
  containerStyle?: any;
}

export function Password({ containerStyle, ...rest }: Props) {
  const [hidePass, setHidePass] = useState(true);

  return (
    <View className="items-center flex flex-row h-14 rounded-md text-white border-[0.4px] bg-[#D356F3] border-white p-2">
      <TextInput
        className="w-[90%] text-white text-lg "
        {...rest}
        placeholderTextColor={Theme.color.gray_30}
        secureTextEntry={hidePass}
      />
      <TouchableOpacity
        className="w-[15%] items-center justify-center"
        onPress={() => setHidePass(!hidePass)}
      >
        {hidePass ? (
          <Ionicons
            className="text-lg"
            size={25}
            color={Theme.color.gray_10}
            name="eye"
          />
        ) : (
          <Ionicons
            className="text-lg"
            size={25}
            color={Theme.color.gray_20}
            name="eye-off"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
