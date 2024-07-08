import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Ad } from '../../Components/Global/Ad';
import { LoginValidation } from '../../Components/Global/Login';
import { HorizontalView } from '../../Components/Global/View/HorizontalView';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { loginVerifyAPI } from '../../utils/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image, ImageBackground, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import HeaderBar from '../../Components/Global/headerBar';
import { useAuth } from '../../context/autenticationContext';

export function Purchased() {
  const navigation = useNavigation<any>();
  const [reload, setReload] = useState(false);
  const { logged, setLogged } = useAuth();
  const [loading, setLoading] = useState(true);

  async function handleVerify() {
    setLoading(true);
    const verify = await loginVerifyAPI();

    if (verify === 200) {
      setLogged(true);
      setLoading(false);
    } else {
      setLoading(false);
      setLogged(false);
    }
    return setLoading(false);
  }

  useEffect(() => {
    handleVerify();
    setReload(false);
  }, [reload, logged]);

  useEffect(() => {
    handleVerify();
  }, [logged]);

  return (
    <PurpleGradient>
      <View className="flex-1 ">
        {loading ? (
          <LoadingIn />
        ) : (
          <>
            {logged ? (
              <>
                <SafeAreaView
                  style={{
                    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 0 : 0,
                    flex: 1,
                  }}
                >
                  <HeaderBar />
                  <View className="w-[95vw] items-center self-center flex flex-col h-[75%] mt-5 justify-between">
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Tickets')}
                      className="flex   w-full flex-col h-44 relative "
                    >
                      <View className="absolute z-30  -top-4 right-4">
                        <ImageBackground
                          className="w-[70px] h-[64px] flex items-center justify-center"
                          source={require('../../../assets/teste/testeBlur5.png')}
                        >
                          <Image
                            className="w-10 h-[26px] "
                            source={require('../../../assets/teste/testeBlur6.png')}
                          />
                        </ImageBackground>
                      </View>
                      <Text className="text-white font-poppinsBold ml-10 mt-8 text-lg z-50">
                        Acessar Ingressos
                      </Text>
                      <Text className="text-white font-poppinsRegular ml-10 w-[300px] text-[10px] z-50">
                        Clique aqui para acessar seus ingressos, eles dão acessos para os eventos.
                        Lembre-se que ele só pode ser usado 1 vez, então não compartilhe com
                        ninguém.
                      </Text>
                      <TouchableOpacity className="absolute z-30 w-32 h-[29px] flex flex-row bottom-9 left-8">
                        <TouchableOpacity className=" absolute w-40 h-24 -ml-5 -mt-10" />
                        <ImageBackground
                          className="w-28 h-[26px] flex flex-row items-center"
                          source={require('../../../assets/teste/miniblur.png')}
                        >
                          <Image
                            className="w-4 h-4 ml-1 "
                            source={require('../../../assets/teste/infoPng.png')}
                          />
                          <Text className="ml-1 font-poppinsRegular mt-0.5 text-white text-[10px]">
                            Como funciona?
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                      <View className="absolute z-30 w-36 h-[29px] flex flex-row bottom-10 right-8 bg-[#75FB4C] rounded-lg  items-center">
                        <Image
                          className="w-[22px] h-[22px]  "
                          source={require('../../../assets/teste/ticketsIcon3.png')}
                        />
                        <Text className="ml-1  font-poppinsRegular text-[#150029] text-[12px] font-bold">
                          Acessar Ingressos
                        </Text>
                      </View>

                      <Image
                        className="absolute mt-4 self-center -top-5 z-20"
                        source={require('../../../assets/teste/testeBlur4.png')}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('Products')}
                      className="flex w-full flex-col h-44 relative items-center"
                    >
                      <View className="absolute z-30  -top-4 left-4">
                        <ImageBackground
                          className="w-[70px] h-[64px] flex items-center justify-center"
                          source={require('../../../assets/teste/testeBlur5.png')}
                        >
                          <Image
                            className="w-10 h-9 "
                            source={require('../../../assets/teste/drinkCerto.png')}
                          />
                        </ImageBackground>
                      </View>
                      <Text className="text-white font-poppinsBold mr-10 self-end mt-8 text-lg z-50">
                        Acessar Bebidas
                      </Text>
                      <Text className="text-white ml-0 w-[300px]  font-poppinsRegular text-[10px] z-50">
                        Clique aqui para acessar seus ingressos, eles dão acessos para os eventos.
                        Lembre-se que ele só pode ser usado 1 vez, então não compartilhe com
                        ninguém.
                      </Text>
                      <TouchableOpacity className="absolute z-30 w-32 h-[29px] flex flex-row bottom-9 left-8">
                        <TouchableOpacity className=" absolute w-40 h-24 -ml-5 -mt-10 " />
                        <ImageBackground
                          className="w-28 h-[26px] flex flex-row items-center"
                          source={require('../../../assets/teste/miniblur.png')}
                        >
                          <Image
                            className="w-4 h-4 ml-1 "
                            source={require('../../../assets/teste/infoPng.png')}
                          />
                          <Text className="ml-1 font-poppinsRegular mt-0.5 text-white text-[10px]">
                            Como funciona?
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                      <View className="absolute z-30 w-36 h-[29px] flex flex-row bottom-10 right-8 bg-[#75FB4C] rounded-lg  items-center">
                        <Image
                          className="w-6 h-6 ml-[2px] "
                          source={require('../../../assets/teste/bottleIcon.png')}
                        />
                        <Text className="ml-[2px] font-poppinsRegular  text-[#150029] text-[13px] font-bold">
                          Acessar Bebidas
                        </Text>
                      </View>
                      <Image
                        className="absolute mt-4 -top-5 z-20"
                        source={require('../../../assets/teste/drinkBlur2.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('VIP')}
                      className="flex   w-full flex-col h-44 relative items-center"
                    >
                      <View className="absolute z-30  -top-4 right-4">
                        <ImageBackground
                          className="w-[70px] h-[64px] flex items-center justify-center"
                          source={require('../../../assets/teste/testeBlur5.png')}
                        >
                          <Image
                            className="w-12 h-11 rounded-md "
                            source={require('../../../assets/teste/vipCerto.png')}
                          />
                        </ImageBackground>
                      </View>
                      <Image
                        className="absolute mt-4 -top-5 z-20"
                        source={require('../../../assets/teste/vipBlur.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </>
            ) : (
              <LoginValidation reload={() => setReload(true)} />
            )}
          </>
        )}
      </View>
    </PurpleGradient>
  );
}
