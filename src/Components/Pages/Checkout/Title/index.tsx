import { Text, View } from 'react-native';
import { Tabs } from '../../../Global/Tabs';
import { HorizontalView } from '../../../Global/View/HorizontalView';

export function Title() {
  return (
    <View className="items-center">
      <Text className="text-[20px] text-gray-100 ">CHECKOUT</Text>
      <HorizontalView style={{ justifyContent: 'space-between', width: '90%' }}>
        <Tabs active={true} />
        <Tabs active={true} />
        <Tabs active={true} />
      </HorizontalView>
    </View>
  );
}
