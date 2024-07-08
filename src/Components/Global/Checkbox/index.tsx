import { RFValue } from 'react-native-responsive-fontsize';
import Theme from '../../../styles/themes';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: any;
}

export function Checkbox({ checked, onPress }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="border-2 bg-gray-400 w-5 h-5 items-center justify-center">
        {checked ? (
          <FontAwesome5 name="check-square" size={RFValue(20)} color={Theme.color.gray_100} />
        ) : (
          <FontAwesome5 name="square" size={RFValue(20)} color={Theme.color.gray_100} />
        )}
      </View>
    </TouchableOpacity>
  );
}
