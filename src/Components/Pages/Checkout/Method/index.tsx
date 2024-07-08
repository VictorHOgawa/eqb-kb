import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface MethodProps {
  selected: string;
  isGeneratedQrCode: boolean;
  setSelected: any;
}
export function Method({ selected, setSelected, isGeneratedQrCode }: MethodProps) {
  const [isCreditCard, setIsCreditCard] = useState(false);

  // Criando valores animados para opacidade
  const opacityPix = useSharedValue(isCreditCard ? 0.5 : 1);
  const opacityCard = useSharedValue(isCreditCard ? 1 : 0.5);

  // Definindo o estilo animado
  const animatedStylePix = useAnimatedStyle(() => {
    return {
      opacity: withSpring(opacityPix.value, { damping: 10, stiffness: 100 }),
    };
  });

  const animatedStyleCard = useAnimatedStyle(() => {
    return {
      opacity: withSpring(opacityCard.value, { damping: 10, stiffness: 100 }),
    };
  });

  const handleSelectPix = () => {
    setIsCreditCard(false);
    setSelected('Pix');
    opacityPix.value = 1;
    opacityCard.value = 0.5;
  };
  useEffect(() => {
    if (isGeneratedQrCode) {
      opacityCard.value = 0.5;
      opacityPix.value = 0.5;
    }
  }, [isGeneratedQrCode]);
  const handleSelectCreditCard = () => {
    setIsCreditCard(true);
    setSelected('Card');
    opacityPix.value = 0.5;
    opacityCard.value = 1;
  };

  return (
    <View className="w-[100%] mt-2 mb-2 flex-row justify-between items-center ">
      <TouchableOpacity
        className={`${isGeneratedQrCode ? 'opacity-50' : ' opacity-100'}`}
        disabled={isGeneratedQrCode}
        onPress={handleSelectCreditCard}
      >
        <Animated.Image
          className="h-[95px] w-[170px]"
          style={[animatedStyleCard]}
          source={require('../../../../../assets/Checkout/CreditCard.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        className={`${isGeneratedQrCode ? 'opacity-50' : ' opacity-100'}`}
        disabled={isGeneratedQrCode}
        onPress={handleSelectPix}
      >
        <Animated.Image
          className="h-[95px] w-[170px]"
          style={[animatedStylePix]}
          source={require('../../../../../assets/Checkout/pixNew2.png')}
        />
      </TouchableOpacity>
    </View>
  );
}
