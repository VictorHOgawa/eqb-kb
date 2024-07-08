import { View } from 'react-native';

export function HorizontalView({ children, ...rest }: any) {
  return (
    <View className="flex-row" {...rest}>
      {children}
    </View>
  );
}
