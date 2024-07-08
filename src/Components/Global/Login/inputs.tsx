import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons"; // Ajuste o import conforme seu ambiente
import { maskCPF, maskCPFOrCNPJ, maskPhone } from "../../../utils/mask";
import { maskCpfCnpj } from "../../../utils/masks";

interface CustomInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
}

export const LoginInput: React.FC<CustomInputProps> = ({
  control,
  name,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,

  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(!secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="flex flex-row border h-14 bg-[#290948] border-[#C45EEB] pl-2 pr-1 text-lg text-white rounded-xl items-center">
          <TextInput
            onBlur={onBlur}
            onChangeText={(text) => {
              let finalValue = text;
              if (name === "cpfCnpj") {
                finalValue = maskCPF(text);
              } else if (name === "mobilePhone") {
                finalValue = maskPhone(text);
              }
              onChange(finalValue);
            }}
            value={
              name === "cpfCnpj"
                ? maskCPF(value)
                : name === "mobilePhone"
                ? maskPhone(value)
                : value
            }
            placeholder={placeholder}
            placeholderTextColor={"lightgray"}
            keyboardType={keyboardType}
            secureTextEntry={!isVisible}
            className="p-2 text-lg text-white w-[85%]"
            {...rest}
          />
          {secureTextEntry && (
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
              <Ionicons
                size={25}
                color="#fff" // Adapte para sua Theme.color.gray_10 ou gray_20
                name={isVisible ? "eye-off" : "eye"}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};
