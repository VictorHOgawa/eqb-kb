import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import { View } from 'native-base';
import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import Modal from 'react-native-modal';
import Animated, { FadeIn } from 'react-native-reanimated';

interface NoProductsModalProps {
  isProductsModalOpen: boolean;
  setIsProductsModalOpen: () => void;
}
export function NoProductsModal({
  isProductsModalOpen,
  setIsProductsModalOpen,
}: NoProductsModalProps) {
  const [hasRecommendation, setHasRecommendation] = useState(false);
  function handleBackButtonPress() {
    setIsProductsModalOpen();
  }
  return (
    <Modal
      isVisible={isProductsModalOpen}
      onModalHide={setIsProductsModalOpen}
      onBackButtonPress={setIsProductsModalOpen}
      onBackdropPress={setIsProductsModalOpen}
    >
      <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
        <BlurView tint="light" intensity={30} className=" z-[99] rounded-2xl">
          <View className="bg-[#450A88]/80 py-3 z-[100] rounded-2xl relative">
            <View className=" flex flex-row  z-90 items-center  justify-between">
              <TouchableOpacity className=" ml-4 " onPress={() => handleBackButtonPress()}>
                <Image
                  className="h-5 w-3   "
                  source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../../../../assets/Global/Logo2.png')}
              className="w-28 h-24 self-center"
            />
            {!hasRecommendation ? (
              <View className="h-40 w-full flex items-center justify-center">
                <Text className="text-white text-[16px] mt-5 max-w-[210px] text-center self-center font-poppinsSemiBold">
                  Infelizmente esse evento não possui produtos disponíveis
                </Text>
                <Text className="text-white text-[10px] mt-5 max-w-[210px] text-center self-center font-poppinsSemiBold">
                  Voce pode nos ajudar enviando uma recomendação de venda para o organizador, só
                  leva um click
                </Text>
              </View>
            ) : (
              <Animated.View
                entering={FadeIn.duration(600)}
                className="h-40 w-full flex flex-col items-center justify-center"
              >
                <LottieView
                  autoPlay
                  speed={0.8}
                  progress={1}
                  source={require('../../../../../assets/Event/confirmAnimation.json')} // Caminho para sua animação Lottie
                  loop={false}
                  className="w-[60%] h-[60%] mt-10 z-10"
                />
                <Text className="text-white text-[12px] mt-5 max-w-[210px] text-center self-center font-poppinsSemiBold">
                  Sua Recomendação foi Repassada!
                </Text>
              </Animated.View>
            )}
            {!hasRecommendation ? (
              <View className="flex flex-row z-[999] justify-evenly mt-10 mb-10">
                <TouchableOpacity
                  className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                  onPress={() => handleBackButtonPress()}
                >
                  <Image
                    source={require('../../../../../assets/Global/blurBuyButton.png')}
                    className="-mt-2 -ml-2 absolute w-36 h-14"
                  />
                  <Image
                    className="h-5 w-3 absolute left-3 "
                    source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
                  />
                  <Text className="text-white text-[12px]  font-poppinsBold mt-1 ">Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setHasRecommendation(true)}
                  className=" bg-[#FFFFFF]/40 border h-10 w-44 border-white rounded-lg  flex flex-row overflow-hidden items-center "
                >
                  <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                  <View className="flex flex-row   items-center justify-center w-full h-full  ">
                    <Image
                      className="h-7 w-7 mr-1  "
                      source={require('../../../../../assets/Global/Icons/recomendationBlue.png')}
                    />
                    <Text className="text-[#290948] font-poppinsBold mt-1 text-[12px] ">
                      Recomendar Venda
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <Animated.View
                entering={FadeIn.duration(600)}
                className="flex flex-row z-[999] justify-evenly mt-10 mb-10"
              >
                <TouchableOpacity
                  className=" bg-[#C45EEB]/40 border-[1px] overflow-hidden relative border-[#C45EEB] text-white  h-10 w-44 rounded-md items-center justify-center flex flex-row "
                  onPress={() => setIsProductsModalOpen()}
                >
                  <Image
                    source={require('../../../../../assets/Global/blurBuyButton.png')}
                    className="-mt-2 -ml-2 absolute w-52 h-14"
                  />
                  <Image
                    className="h-5 w-3 absolute left-3 "
                    source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
                  />
                  <Text className="text-white text-[12px]  font-poppinsBold mt-[3px] ">
                    Retornar ao Evento
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
