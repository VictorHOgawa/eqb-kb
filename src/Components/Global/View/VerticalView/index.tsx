import { View } from 'react-native';

export function VerticalView({ children, ...rest }: any) {
  return <View {...rest}>{children}</View>;
}
