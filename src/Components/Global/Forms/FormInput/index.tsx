import React from "react";

import { TextInputProps } from "react-native";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import { BaseInput } from "../BaseInput";
import { Password } from "../Password";

import { removeSpace } from "../../../../utils/textInputFormat";
import {
  maskCard,
  maskCep,
  maskCpfCnpj,
  maskPhone,
  maskDate,
  textOnly,
} from "../../../../utils/masks";

interface Props extends TextInputProps {
  control: Control;
  name: string;
  formData: any;
  passwordContainerStyle?: any;
}

export function InputForm({
  control,
  name,
  formData,
  value,
  passwordContainerStyle,
  ...rest
}: Props) {
  return (
    <View className="w-full">
      <Controller
        control={control}
        render={({ field: { onChange, value } }) =>
          name === "password" || name === "password2" ? (
            <Password
              onChangeText={onChange}
              value={removeSpace(value)}
              containerStyle={passwordContainerStyle}
              {...rest}
            />
          ) : name === "cpfCnpj" ? (
            <BaseInput
              maxLength={14}
              {...rest}
              onChangeText={onChange}
              keyboardType="numeric"
              value={maskCpfCnpj(value)}
            />
          ) : name === "mobilePhone" ? (
            <BaseInput
              maxLength={14}
              {...rest}
              onChangeText={onChange}
              keyboardType="numeric"
              value={maskPhone(value)}
            />
          ) : name === "postalCode" ? (
            <BaseInput
              maxLength={9}
              {...rest}
              onChangeText={onChange}
              keyboardType="numeric"
              value={maskCep(value)}
            />
          ) : name === "holderName" ? (
            <BaseInput
              onChangeText={onChange}
              {...rest}
              value={textOnly(value)}
            />
          ) : name === "number" ? (
            <BaseInput
              maxLength={19}
              onChangeText={onChange}
              keyboardType="numeric"
              value={maskCard(value)}
              {...rest}
            />
          ) : name === "expiryDate" ? (
            <BaseInput
              maxLength={5}
              onChangeText={onChange}
              keyboardType="numeric"
              value={maskDate(value)}
              {...rest}
            />
          ) : name === "name" ? (
            <BaseInput
              onChangeText={onChange}
              {...rest}
              value={textOnly(value)}
            />
          ) : name === "ccv" ? (
            <BaseInput
              maxLength={4}
              onChangeText={onChange}
              {...rest}
              value={value}
            />
          ) : name === "addressNumber" ? (
            <BaseInput
              onChangeText={onChange}
              {...rest}
              value={value}
              keyboardType="numeric"
            />
          ) : (
            <BaseInput onChangeText={onChange} {...rest} value={value} />
          )
        }
        name={name}
      />
    </View>
  );
}
