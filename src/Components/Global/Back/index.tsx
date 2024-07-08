import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacityProps, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Theme from '../../../styles/themes';

interface Props extends TouchableOpacityProps {
  color?: string;
}

export function BackButton({ color, ...rest }: Props) {
  const navigation = useNavigation<any>();

  return (
    <View className="w-[60px] h-[60px] mt-[18px]" onPress={() => navigation.goBack()} {...rest}>
      <MaterialIcons name="chevron-left" size={40} color={color ? color : Theme.color.gray_10} />
    </View>
  );
}
