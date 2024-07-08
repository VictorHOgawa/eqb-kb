import { Image } from 'react-native';
import { Button } from '../Button';
import Theme from '../../../styles/themes';
import { Dimensions } from 'react-native';
import { ModalBody } from '../More/styles';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { set } from 'zod';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface PendingQrCodeModalProps {
  showQrCodeImage: boolean;
  setShowQrCodeImage: (value: boolean) => void;
  qrCodeImage: any;
  handleCopy: () => void;
}
export function PendignQrCodeModal({
  showQrCodeImage,
  setShowQrCodeImage,
  qrCodeImage,
  handleCopy,
}: PendingQrCodeModalProps) {
  const [iscodeCopy, setIsCodeCopy] = useState(false);
  const size = useSharedValue(140);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: size.value,
    };
  });
  const handleCopyCode = () => {
    size.value = withTiming(145, { duration: 100 });
    setIsCodeCopy(true);
    handleCopy();
    setTimeout(() => {
      size.value = withTiming(140, { duration: 100 });
      setIsCodeCopy(false);
    }, 5000);
  };
  return (
    <Modal
      backdropOpacity={0.9}
      isVisible={showQrCodeImage}
      onModalHide={() => setShowQrCodeImage(false)}
      onBackdropPress={() => setShowQrCodeImage(false)}
      onBackButtonPress={() => setShowQrCodeImage(false)}
    >
      <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
        <BlurView tint="light" intensity={30} className="rounded-2xl">
          <View className="bg-[#450A88]/80 py-3 rounded-2xl relative">
            <TouchableOpacity className=" ml-4 " onPress={() => setShowQrCodeImage(false)}>
              <Image
                className="h-5 w-3   "
                source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
              />
            </TouchableOpacity>
            <Image
              source={require('../../../../assets/Global/Logo2.png')}
              className="w-28 h-24 self-center"
            />
            <View>
              <View className="flex flex-row justify-center mt-4 items-center">
                <Image
                  className="h-5 w-5 mr-2  "
                  source={require('../../../../assets/Global/Icons/transferArrowWhite.png')}
                />
                <Text className="text-white text-[21px] font-poppinsBold">Realizar Pagamento</Text>
              </View>
              <Text className="text-white text-[15px] mt-2 max-w-[280px] text-center self-center font-poppinsSemiBold">
                Agora é so realizar o pagamento com o Pix gerado e logo o ingresso estará disponível
              </Text>
            </View>
            <Image
              className="self-center mt-5 mb-5"
              source={{
                uri: `data:image/png;base64,${qrCodeImage?.encodedImage}`,
              }}
              style={{
                width: Dimensions.get('window').width * 0.5,
                height: Dimensions.get('window').width * 0.5,
              }}
            />
            <View className="flex flex-row justify-evenly mt-10 mb-10">
              <View className="  w-40 flex items-center justify-center">
                <Animated.View style={animatedStyles} className="flex items-center justify-center">
                  <TouchableOpacity
                    className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white px-2  h-12  rounded-md items-center justify-center flex flex-row "
                    onPress={handleCopyCode}
                  >
                    {iscodeCopy && (
                      <>
                        <Animated.View
                          entering={FadeIn.duration(300)}
                          className="flex flex-row w-full items-center justify-center"
                        >
                          <Image
                            source={require('../../../../assets/Global/blurBuyButton.png')}
                            className="-mt-7 -ml-[25px] absolute w-auto h-auto"
                          />

                          <Image
                            className="h-3 w-[19.5px] mr-2  "
                            source={require('../../../../assets/Global/Icons/verifiedWhite.png')}
                          />
                          <Text className="text-white text-[13px]  font-poppinsSemiBold mt-1 ">
                            Código Copiado
                          </Text>
                        </Animated.View>
                      </>
                    )}
                    {!iscodeCopy && (
                      <>
                        <Animated.View
                          entering={FadeIn.duration(300).delay(100)}
                          className="flex flex-row w-full items-center justify-center"
                        >
                          <Image
                            source={require('../../../../assets/Global/blurBuyButton.png')}
                            className="-mt-[26px] -ml-5 absolute w-[135%] h-[70px]"
                          />

                          <Image
                            className="h-5 w-5 mr-2  "
                            source={require('../../../../assets/Global/Icons/copyCode.png')}
                          />
                          <Text className="text-white text-[13px]  font-poppinsSemiBold mt-1  ">
                            Copiar Código
                          </Text>
                        </Animated.View>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <TouchableOpacity
                className=" bg-[#FFFFFF]/40 border h-12 border-white rounded-lg  flex flex-row overflow-hidden items-center "
                onPress={() => setShowQrCodeImage(false)}
              >
                <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                <View className="flex flex-row px-2 py-3 items-center ">
                  <Image
                    className="h-4 w-4 mr-1  "
                    source={require('../../../../assets/Global/Icons/transferArrows.png')}
                  />
                  <Text className="text-[#290948] text-[13px] mt-0.2 font-poppinsBold">
                    Finalizar Pagamento
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
