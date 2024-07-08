import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import Theme from '../../../../../styles/themes';
import { AuthPostAPI } from '../../../../../utils/api';
import { useCart } from '../../../../../context/cart';
import {
  ActivityIndicator,
  Alert,
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AnimatedReanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PixProps {
  coupon: string;
  setCoupon: any;
  AddCoupon: any;
  loadingCoupon: boolean;
  QrCode: boolean;
  setQrCode: any;
  pix: any;
  setPix: any;
}

export function PixMethod({
  coupon,
  setCoupon,
  AddCoupon,
  loadingCoupon,
  QrCode,
  setQrCode,
  pix,
  setPix,
}: PixProps) {
  const { cart, cleanCart, customerCartId } = useCart();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  async function getPix() {
    const connect = await AuthPostAPI(`/purchase/payment/pix/${customerCartId}`, {});
    if (connect.status !== 200) {
      Alert.alert(connect.body);
      return setLoading1(false);
    }
    AsyncStorage.removeItem('cart');
    cleanCart();
    setPix(connect.body.payment);
    return setLoading1(false);
  }
  const [isPixCodeCopied, setIsPixCodeCopied] = useState(false);

  const handleFinish = () => {
    setLoading(true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'AppRoutes',
            params: {
              screen: 'Purchased',
            },
          },
        ],
      })
    );
    return setLoading(false);
  };
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.01, { duration: 500 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedStyleScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const [teste, setTeste] = useState<any>([]);
  const [isSmallButton, setIsSmallButton] = useState(false);
  const alturaAnimada = useRef(new Animated.Value(112)).current;
  const handleClick = () => {
    // Alterna entre os valores de altura
    Animated.timing(alturaAnimada, {
      toValue: QrCode ? 112 : 56,
      duration: 400,
      useNativeDriver: false,
    }).start();

    setQrCode(true);
    setLoading1(true);
    setTimeout(() => {}, 2000);

    return getPix();
  };
  useEffect(() => {
    if (QrCode) {
      setIsSmallButton(true);
    }
  }, []);

  const widthAnim = useSharedValue(220); // Shared value inicializado com 150

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(widthAnim.value, {
        duration: 300, // Duração da animação em milissegundos
      }),
    };
  });
  const handleCopy = async () => {
    await Clipboard.setStringAsync(pix.payload);
    setIsPixCodeCopied(true);
    widthAnim.value = withSpring(250, { duration: 1 });
    setTimeout(() => {
      widthAnim.value = withSpring(210, { duration: 1 });
      setIsPixCodeCopied(false);
    }, 3000);
  };
  return (
    <AnimatedReanimated.View
      entering={FadeIn.duration(400).delay(200)}
      exiting={FadeOut.duration(200)}
    >
      <Text className="text-white text-lg mb-2 font-poppinsRegular mt-0"> 2. Gerar PIX </Text>
      <Animated.View
        style={{ height: isSmallButton ? 56 : alturaAnimada }}
        className={` bg-pix rounded-xl self-center text-white w-80  ${
          QrCode ? ' justify-center px-6  ' : ' p-6 '
        } flex  transition-400`}
      >
        <TouchableOpacity onPress={handleClick} disabled={QrCode}>
          {QrCode ? (
            <>
              <View className="flex flex-col">
                <View className="flex flex-row">
                  <Image
                    className=" h-8 w-8 mr-2"
                    source={require('../../../../../../assets/Checkout/PixWhite.png')}
                  />
                  {loading1 ? (
                    <>
                      <ActivityIndicator color="white" size="small" />
                    </>
                  ) : (
                    <>
                      <Text className="text-white text-lg font-poppinsBold mt-1">Pix Gerado </Text>
                      <Image
                        className="w-6 h-6"
                        source={require('../../../../../../assets/Global/Icons/ApplyCoupon.png')}
                      />
                    </>
                  )}
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="flex flex-row items-center justify-between w-full">
                <View className="flex flex-col">
                  <View className="flex flex-row">
                    <Image
                      className=" h-8 w-8 mr-2"
                      source={require('../../../../../../assets/Checkout/PixWhite.png')}
                    />
                    <Text className="text-white text-lg font-poppinsBold mt-1">Gerar Pix </Text>
                  </View>
                  <Text className=" text-white text-md font-poppinsRegular">
                    Gerar Código Copia e Cola
                  </Text>
                </View>
                <Image
                  className=" h-6 w-7  mt-6"
                  source={require('../../../../../../assets/Checkout/Arrow.png')}
                />
              </View>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      {QrCode ? (
        <>
          {loading1 ? (
            <></>
          ) : (
            <>
              {pix ? (
                <AnimatedReanimated.View entering={FadeIn.duration(600)}>
                  <View className=" flex flex-row max-w-[90%] mb-2 font-poppinsRegular">
                    <Text className="text-white text-[17px] mb-2 mt-5 font-poppinsRegular">3.</Text>
                    <Text className="text-white text-[17px] mb-2 mt-5 font-poppinsRegular">
                      Copie o Código copia e cola ou Leia o QrCode e efetue o pagamento.
                    </Text>
                  </View>

                  <Image
                    className=" h-48 w-48 self-center  rounded-lg"
                    source={{
                      uri: `data:image/png;base64,${pix.encodedImage}`,
                    }}
                  />
                  <AnimatedReanimated.View style={animatedStyle} className="self-center ">
                    <TouchableOpacity
                      className="bg-pix  h-12 w-full  mt-2 mb-2 px-2  flex self-center rounded-lg flex-row items-center  "
                      onPress={handleCopy}
                    >
                      {isPixCodeCopied && (
                        <AnimatedReanimated.View
                          className="flex flex-row self-center  h-full items-center "
                          entering={FadeIn.duration(600)}
                        >
                          <Text className=" text-white text-[13px] mt-1 font-poppinsRegular">
                            Código Copiado com Sucesso
                          </Text>
                          <Image
                            source={require('../../../../../../assets/Checkout/VerifiedIcon.png')}
                            className=" h-4 w-5 ml-2"
                          />
                        </AnimatedReanimated.View>
                      )}
                      {!isPixCodeCopied && (
                        <AnimatedReanimated.View
                          className="flex flex-row self-center  h-full items-center "
                          entering={FadeIn.duration(600)}
                        >
                          <Text className=" text-white text-[13px] mt-1 font-poppinsRegular">
                            Clique aqui para Copiar
                          </Text>
                          <Image
                            source={require('../../../../../../assets/Checkout/copyIcon.png')}
                            className=" h-6 w-6 ml-2"
                          />
                        </AnimatedReanimated.View>
                      )}
                    </TouchableOpacity>
                  </AnimatedReanimated.View>
                  <AnimatedReanimated.View style={animatedStyleScale}>
                    <TouchableOpacity
                      className=" px-2 h-12 mt-6 w-80 relative bg-[#75FB4C]/40  border-[1px] border-[#75FB4C] self-center rounded-lg flex items-center flex-row  justify-center "
                      onPress={handleFinish}
                      disabled={loading}
                    >
                      <Image
                        source={require('../../../../../../assets/Checkout/blurGreen.png')}
                        className="-mt-2 -ml-2 absolute w-[365px] h-[69px] rounded-3xl"
                      />
                      <View className=" absolute w-full h-full " />
                      <Text className=" text-[15px] text-[#290948] font-poppinsBold mt-1">
                        Pagamento Concluído? Clique aqui
                      </Text>
                      <Image
                        source={require('../../../../../../assets/Global/Icons/ApplyCoupon.png')}
                        className=" h-4 w-6"
                      />
                    </TouchableOpacity>
                  </AnimatedReanimated.View>
                </AnimatedReanimated.View>
              ) : (
                <>
                  <ActivityIndicator
                    color={Theme.color.secondary_100}
                    size="small"
                    style={{ marginTop: '5%' }}
                  />
                </>
              )}
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </AnimatedReanimated.View>
  );
}
