import { Text, View } from 'react-native';
import { LineBreak } from '../../../Global/LineBreak';
import { GlobalTitle } from '../../../Global/Title';

interface DescriptionProps {
  description: {
    name: string;
    description: string;
  };
}
export function Description({ description }: DescriptionProps) {
  return (
    <View>
      <GlobalTitle title={description.name} />
      <LineBreak />
      <Text className="text-gray-100 text-justify">{description.description}</Text>
    </View>
  );
}
