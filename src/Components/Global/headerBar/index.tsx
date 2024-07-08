import { Image, Text, View } from 'react-native';
import { CityButton } from '../../Pages/Home/CityButton';
import { TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ActionSheetCity from '../ActionSheetCity';
import { getAPI } from '../../../utils/api';

interface Props {
  icon?: React.ReactNode;
  title?: string;
}
export default function HeaderBar({ icon, title }: Props) {
  return (
    <View className="flex mt-4 flex-row mb-5 justify-between relative w-[205px]  border-[0.5px] border-white  bg-[#1E043E]  items-center h-8 rounded-xl self-center overflow-hidden ">
      <Image
        className="w-8 h-8  rounded-xl  "
        source={require('../../../../assets/MyMatches/myMatchNameLogo1.png')}
      />
      <View className="w-[128px] flex items-center justify-center flex-row">
        <Text className="text-white text-[13px] text-center font-poppinsBold mt-1 self-center ">
          {title ? title : 'Carteira da Night'}
        </Text>
      </View>
      <View className="w-8 h-8 flex items-center justify-center">
        {icon ? (
          icon
        ) : (
          <Image
            className="w-5 h-5   rounded-xl "
            source={require('../../../../assets/Global/Icons/ticketsIcon.png')}
          />
        )}
      </View>
    </View>
  );
}
