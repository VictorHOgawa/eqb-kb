import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ZodError, z } from 'zod';
import {
  maskCEP,
  maskCPFOrCNPJ,
  maskCardNumber,
  maskExpiryDate,
} from '../../../../../../utils/mask';
import { maskPhone } from '../../../../../../utils/masks';

interface NewCardProps {
  formData: any;
  setFormData: (formData: any) => void;
  stepTwo: boolean;
  stepTree: boolean;
  validate: any;
  onUpdate: any;
  onValidationComplete: (isValid: boolean) => void;
}

interface ErrorProps {
  [key: string]: string;
}

// Schema de validação Zod
const stepOneSchema = z.object({
  holderName: z.string().min(1, 'Campo obrigatório'),
  number: z.string().min(19, 'Número de cartão inválido'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Data de expiração inválida'),
  ccv: z.string().length(3, 'CCV inválido'),
});

const stepTwoSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  email: z.string().email('Email inválido'),
  mobilePhone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Telefone inválido'),
});

const stepThreeSchema = z.object({
  cpfCnpj: z
    .string()
    .regex(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, 'CPF/CNPJ inválido'),
  postalCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  addressNumber: z.string().min(1, 'Campo obrigatório'),
});

export const NewCard: React.FC<NewCardProps> = ({
  formData,
  setFormData,
  stepTree,
  onUpdate,

  validate,
  onValidationComplete,
  stepTwo,
}) => {
  const [errors, setErrors] = useState<ErrorProps>({});

  const handleInputChange = (field: any, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    if (onUpdate) onUpdate(newFormData);
  };

  const validateAllFields = () => {
    let currentSchema;
    if (stepTwo) {
      currentSchema = stepTwoSchema;
    } else if (stepTree) {
      currentSchema = stepThreeSchema;
    } else {
      currentSchema = stepOneSchema;
    }

    const result = currentSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      onValidationComplete(true);
    } else {
      const error: ZodError = result.error;

      const updatedErrors = error.issues.reduce((accumulator: any, issue) => {
        accumulator[issue.path[0]] = issue.message;
        return accumulator;
      }, {});
      setErrors(updatedErrors);
      onValidationComplete(false);
    }
  };
  const [hasValidated, setHasValidated] = useState(false);
  useEffect(() => {
    if (hasValidated) {
      // Executa validateAllFields apenas se já houve uma validação anterior
      validateAllFields();
    } else {
      setHasValidated(true); // Marca que o componente já foi montado, mas evita a primeira validação
    }
  }, [validate]);
  return (
    <>
      <View className="flex w-[95%]   self-center">
        {stepTree && (
          <Animated.View entering={FadeIn.duration(600)}>
            <Text className="text-white text-md font-poppinsRegular ">CPF/CNPJ:</Text>
            <TextInput
              value={formData.cpfCnpj}
              onChangeText={(value) => handleInputChange('cpfCnpj', maskCPFOrCNPJ(value))}
              keyboardType="numeric"
              placeholder="CPF/CNPJ"
              placeholderTextColor={'lightgray'}
              className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
            />
            <View className="h-3">
              {errors.cpfCnpj && <Text className="text-red-500 text-[8px]">{errors.cpfCnpj}</Text>}
            </View>
            <View className="flex flex-row justify-between">
              <>
                <View className=" w-[55%] flex-col">
                  <Text className="text-white text-md font-poppinsRegular ">CEP:</Text>
                  <TextInput
                    value={formData.postalCode}
                    onChangeText={(value) => handleInputChange('postalCode', maskCEP(value))}
                    keyboardType="numeric"
                    placeholder="CEP"
                    placeholderTextColor={'lightgray'}
                    className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
                  />
                  <View className="h-3">
                    {errors.postalCode && (
                      <Text className="text-red-500 text-[8px]">{errors.postalCode}</Text>
                    )}
                  </View>
                </View>
              </>
              <>
                <View className="w-[40%] flex-col">
                  <Text className="text-white text-md font-poppinsRegular ">Nº da Casa</Text>
                  <TextInput
                    value={formData.addressNumber}
                    onChangeText={(value) => handleInputChange('addressNumber', value)}
                    placeholder="Número da Casa"
                    placeholderTextColor={'lightgray'}
                    className="h-14 text-base bg-[#420A89] rounded-md  placeholder:text-white mb-2 p-2"
                  />
                  <View className="h-3">
                    {errors.addressNumber && (
                      <Text className="text-red-500 text-[8px]">{errors.addressNumber}</Text>
                    )}
                  </View>
                </View>
              </>
            </View>
          </Animated.View>
        )}
        {stepTwo && (
          <Animated.View entering={FadeIn.duration(600)}>
            <Animated.View entering={FadeIn.duration(600)}>
              <Text className="text-white text-md font-poppinsRegular ">Nome Completo:</Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Nome Completo"
                placeholderTextColor={'lightgray'}
                className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
              />
              <View className="h-3">
                {errors.name && <Text className="text-red-500 text-[8px]">{errors.name}</Text>}
              </View>
              <Text className="text-white text-md font-poppinsRegular ">Email:</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Email"
                placeholderTextColor={'lightgray'}
                className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
              />
              <View className="h-3">
                {errors.email && <Text className="text-red-500 text-[8px]">{errors.email}</Text>}
              </View>
              <Text className="text-white text-md font-poppinsRegular ">Telefone:</Text>
              <TextInput
                value={formData.mobilePhone}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange('mobilePhone', maskPhone(value))}
                placeholder="(00)00000-0000"
                placeholderTextColor={'lightgray'}
                className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
              />
              <View className="h-3">
                {errors.mobilePhone && (
                  <Text className="text-red-500 text-[8px]">{errors.mobilePhone}</Text>
                )}
              </View>
            </Animated.View>
          </Animated.View>
        )}
        {!stepTree && !stepTwo && (
          <Animated.View entering={FadeIn.duration(600)}>
            <Text className="text-white text-md font-poppinsRegular ">Nome do Cartão</Text>
            <TextInput
              value={formData.holderName}
              onChangeText={(value) => handleInputChange('holderName', value)}
              placeholder="Nome do Titular"
              placeholderTextColor={'lightgray'}
              className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
              onBlur={() => handleInputChange('holderName', formData.holderName)}
            />
            <View className="h-3">
              {errors.holderName && (
                <Text className="text-red-500 text-[8px]">{errors.holderName}</Text>
              )}
            </View>

            <Text className="text-white text-md font-poppinsRegular ">Numero do Cartão</Text>
            <TextInput
              value={formData.number}
              onChangeText={(value) => handleInputChange('number', maskCardNumber(value))}
              placeholder="Número do Cartão"
              placeholderTextColor={'lightgray'}
              className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
              keyboardType="numeric"
            />
            <View className="h-3">
              {errors.number && <Text className="text-red-500 text-[8px]">{errors.number}</Text>}
            </View>

            <View className="flex-row justify-between">
              <View className="w-1/2 pr-2">
                <Text className="text-white text-md font-poppinsRegular ">Expiração:</Text>
                <TextInput
                  value={formData.expiryDate}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange('expiryDate', maskExpiryDate(value))}
                  placeholder="MM/AA"
                  placeholderTextColor={'lightgray'}
                  className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
                />
                <View className="h-3">
                  {errors.expiryDate && (
                    <Text className="text-red-500 text-[8px]">{errors.expiryDate}</Text>
                  )}
                </View>
              </View>
              <View className="w-1/2 pl-2">
                <Text className="text-white text-md font-poppinsRegular ">CVV</Text>
                <TextInput
                  value={formData.ccv}
                  onChangeText={(value) => handleInputChange('ccv', value)}
                  maxLength={3}
                  placeholder="CCV"
                  placeholderTextColor={'lightgray'}
                  className="h-14 text-base bg-[#420A89] rounded-md placeholder:text-white mb-2 p-2"
                  keyboardType="numeric"
                />
                <View className="h-3">
                  {errors.ccv && <Text className="text-red-500 text-[8px]">{errors.ccv}</Text>}
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </>
  );
};
