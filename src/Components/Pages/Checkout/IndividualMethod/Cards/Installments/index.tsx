import ActionSheet from '@alessiocancian/react-native-actionsheet';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../../../../../context/cart';
import Theme from '../../../../../../styles/themes';
import { AuthPostAPI } from '../../../../../../utils/api';
import { Button } from '../../../../../Global/Button';
import { GlobalTitle } from '../../../../../Global/Title';
import { VerticalView } from '../../../../../Global/View/VerticalView';
import { useWatch } from 'react-hook-form';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface InstallmentsProps {
  formData: any;
  installmentCount: number;
  setInstallmentCount: any;
  installment: any;
  setInstallment: any;
  installments: any;
  setInstallments: any;
  control: any;
}
export function Installments({
  formData,
  setInstallmentCount,
  installmentCount,

  installment,
  setInstallment,
  installments,
  setInstallments,
  control,
}: InstallmentsProps) {
  const ref = useRef<any>();
  const handleOpen = () => {
    ref.current?.show();
  };
  const handleClose = (item: any) => {
    setInstallment(item);
    setInstallmentCount(Number(item.split('x ')[0]));
  };

  const data = useWatch({ control });

  return (
    <View className="flex w-full mt-4 mb-[31px] self-center">
      <TouchableOpacity
        className="w-[80%] rounded-lg flex items-center justify-center border-primary_100 border-[0.5px] h-12 bg-secondary_100 text-gray_10"
        style={{
          alignSelf: 'center',
        }}
        onPress={handleOpen}
      >
        <View className="flex w-full items-center justify-center">
          <Image
            className="w-9 h-9 absolute  left-4"
            source={require('../../../../../../../assets/Global/Icons/credit-card.png')}
          />
          <Text className="text-white font-poppins mt-1.5 text-lg">{installment}</Text>
        </View>
      </TouchableOpacity>
      <ActionSheet
        ref={ref}
        title="Parcelas"
        options={installments}
        cancelButtonIndex={0}
        onPress={(index: number) => {
          if (index == 0) {
          } else {
            handleClose(installments[index]);
          }
        }}
      />
    </View>
  );
}
