import { Link, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { LineBreak } from '../../Components/Global/LineBreak';
import { LoadingIn } from '../../Components/Loading/LoadingIn';

import { useCart } from '../../context/cart';
import Theme from '../../styles/themes';
import { authGetAPI, getAPI, loginVerifyAPI } from '../../utils/api';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { ImageBackground } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import { BlurView } from 'expo-blur';

import TicketSheet from '../../Components/Global/ActionSheetTickets';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import YoutubeIframe from 'react-native-youtube-iframe';
import { ValidationModal } from '../../Components/Pages/Place/ValidationModal';
import { FlatList } from 'react-native-gesture-handler';
import { OneSignal } from 'react-native-onesignal';

export function Place() {
  const navigation = useNavigation<any>();
  const [eventDetails, setEventDetails] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { id } = useRoute().params as any;
  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [newUrel, setNewUrl] = useState<any>('');
  const [logged, setLogged] = useState(false);
  const [bannerNumber, setBannerNumber] = useState(0);
  const { cart } = useCart();
  const [isLogged, setIsLogged] = useState(false);
  const [date, setDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isValidationOpen, setIsValidationOpen] = useState(false);

  async function getEventInfo() {
    handleMatchBanner();
    const connect = await getAPI(`/place/${id}/details`);
    if (connect.status !== 200) {
      return navigation.goBack();
    }
    setEventDetails(connect.body.place);
    setDate(connect.body.date);
    setVideoUrl(connect.body.place.video);

    return setLoading(false);
  }

  useEffect(() => {
    if (id) {
      getEventInfo();
    }
  }, [id]);

  // useEffect(() => {
  //   if (id) {
  //     getEventInfo();
  //   }

  //   OneSignal.User.addTag(`${id}`, `${id}`);
  // }, [id]);

  async function handleVerify() {
    const verify = await loginVerifyAPI();
    if (verify !== 200) {
      return setLogged(false);
    }
    return setLogged(true);
  }

  useEffect(() => {
    handleVerify();
  }, []);

  const [url, setUrl] = useState('');

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setUrl(initialUrl);
      }
    };
    getUrlAsync();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${url}/--/Event?id=${id}`,
        url: `${url}/--/Event/${id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const scrollRef = useRef<any>();
  const handleScroll = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleMatchBanner = () => {
    function generateRandomNumber(min: number, max: number) {
      const randomNumber = Math.random() * (max - min + 1) + min;
      return Math.floor(randomNumber);
    }
    const randomNumber = generateRandomNumber(1, 5);
    return setBannerNumber(randomNumber);
  };
  const [matchLoading, setMatchLoading] = useState(false);
  async function getMatchProfile() {
    setMatchLoading(true);
    const connectValidation = await authGetAPI(`match/place/validation/${id}`);
    if (connectValidation.status === 400) {
      setMatchLoading(false);
      Alert.alert(
        'Ops!',
        'Para ver a Galera que vai nesse Evento você precisa estar cadastrado no Galera da Night'
      );
      setMatchLoading(false);
      navigation.navigate('MatchRegister', { id: id, type: 'place' });
    } else if (connectValidation.status === 401) {
      setIsValidationOpen(true);
      setMatchLoading(false);
    } else if (connectValidation.status === 200) {
      setMatchLoading(false);
      navigation.navigate('Match', { id: id, type: 'place' });
    } else {
      setMatchLoading(false);
      Alert.alert('Ops!', 'Aconteceu algum erro inesperado, tente novamente mais tarde');
    }
  }

  function handleNavigate() {
    actionSheetRef.current?.hide();
    const products = eventDetails.products;
    setTimeout(() => {
      navigation.navigate('PlaceProducts', {
        productId: eventDetails?.id,
      });
    }, 100);
  }
  const handleWhatsAppButtonPress = async () => {
    const url = eventDetails?.whatsAppLink;
    // Verifica se o dispositivo pode abrir a URL
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Abre a URL se for suportada
      await Linking.openURL(url);
    } else {
      console.error('Não foi possível abrir a URL: ' + url);
    }
  };
  const handleLocationButtonPress = async () => {
    const url = eventDetails?.geolocation;
    // Verifica se o dispositivo pode abrir a URL
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Abre a URL se for suportada
      await Linking.openURL(url);
    } else {
      console.error('Não foi possível abrir a URL: ' + url);
    }
  };
  const extractVideoID = (url: any) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  };
  useEffect(() => {
    if (videoUrl) {
      setNewUrl(extractVideoID(videoUrl));
    }
  }, [videoUrl]);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.01, { duration: 500 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const handleRedirect = async (url: string, type: string) => {
    Alert.alert(
      `Redirecionando para o ${type}`,
      `Você será redirecionado para o ${type}. Deseja continuar?`,
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
            } else {
              Alert.alert(`Não foi possível abrir a URL: ${url}`);
            }
          },
        },
      ]
    );
  };
  return (
    <PurpleGradient>
      {loading ? (
        <LoadingIn />
      ) : (
        <View className="flex-1 z-10">
          <Animated.View
            className="z-[111111] absolute  self-center bottom-14"
            style={{ elevation: 10 }}
            entering={FadeInDown.delay(2000).duration(600)}
          >
            <Animated.View style={[animatedStyle]}>
              <TouchableOpacity
                onPress={handleNavigate}
                // onPress={() => navigation.navigate("EventProducts")}
                className="w-72 px-4 z-[90] flex border-[2px] border-[#6B1DA5] flex-row  overflow-hidden h-14 items-center   rounded-2xl "
              >
                <Image
                  source={require('../../../assets/Event/blur80.png')}
                  className="absolute z-[90] opacity-90"
                />
                <BlurView tint="light" intensity={20} className="absolute w-72   h-full z-[90] " />
                <Image
                  source={require('../../../assets/Event/ticketIcon.png')}
                  className="w-9 h-9 z-[90] "
                />
                <Text className="text-white ml-2 z-[90] text-[22px] font-poppinsBold mt-1 self-center">
                  Adquirir Produtos
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <ScrollView showsVerticalScrollIndicator={false} className=" flex-1 min-h-screen  ">
            <View className="">
              <>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ zIndex: 8 }}
                  className="  w-8 h-8 z-10 absolute flex items-center justify-center rounded-md top-10 overflow-hidden   left-5"
                >
                  <Image
                    source={require('../../../assets/Match/backgroundBLur.png')}
                    className="w-8 h-8 absolute"
                  />
                  <Image
                    className="w-[20px]  h-[18px]"
                    source={require('../../../assets/Match/backArrowPurple.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onShare()}
                  style={{ zIndex: 8 }}
                  className="  w-8 h-8 absolute flex items-center justify-center bg-[#6B1DA5] rounded-md top-10 overflow-hidden   right-5"
                >
                  <Image
                    className="w-[20px]  h-[18px]"
                    source={require('../../../assets/Global/Icons/sendIcon.png')}
                  />
                </TouchableOpacity>
                <Image
                  className="w-full h-72 rounded-b-3xl "
                  source={{ uri: eventDetails?.flyer }}
                />

                <TouchableOpacity className=" w-60 rounded-lg flex flex-row items-center overflow-hidden h-16 -mt-20  ml-4 relative">
                  <Image
                    source={require('../../../assets/Event/blur2.png')}
                    className="w-full h-full absolute "
                  />
                  <BlurView className="absolute w-full h-full" tint="dark" intensity={60} />
                  <Image
                    source={{ uri: eventDetails?.flyer }}
                    className="w-12 h-[80%] rounded-lg ml-1 "
                  />
                  <View className="flex flex-col ml-1 justify-center">
                    <Text className="text-white font-poppinsSemiBold mt-1 text-[12px]">
                      {eventDetails?.name}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Image
                        className="w-4 h-4 text-white mr-1"
                        source={{ uri: eventDetails?.subcategoryIcon }}
                      />
                      <Text className="text-white text-[12px] font-poppinsRegular mt-1">
                        {eventDetails?.subcategory}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <LineBreak />
                <View className="w-[370px] -mt-3  items-center self-center flex flex-col  justify-between">
                  <View className="flex   w-full flex-col  relative ">
                    <View className="absolute z-30  -top-4 right-4">
                      <ImageBackground
                        className="w-[70px] h-[64px] flex flex-col items-center justify-center"
                        source={require('../../../assets/teste/testeBlur5.png')}
                      >
                        <View className="h-[35px] w-[80%] flex flex-col items-center rounded-t-md bg-white">
                          <Text className="font-poppinsRegular text-[#D356F3] text-[12px]">
                            {moment(date).format('ddd')}
                          </Text>
                          <Text className="font-poppinsRegular -mt-1 text-[#D356F3] text-[16px]">
                            {moment(date).format('D')}
                          </Text>
                        </View>
                        <View className="h-[15px] w-[80%] bg-[#D356F3] items-center justify-center rounded-b-md">
                          <Text className="text-white text-[11px] font-poppinsRegular">
                            {moment(date).format('MMM')}
                          </Text>
                        </View>
                      </ImageBackground>
                    </View>
                    <Text
                      numberOfLines={2}
                      className="text-white text-[13px] w-64 font-poppinsBold mt-6 z-40 ml-6"
                    >
                      {eventDetails?.name}
                    </Text>
                    <View className="flex flex-col   ml-6 self-start ">
                      <Text className="text-white   text-[12px]  font-poppinsRegular -mt-1 z-40">
                        Horário de funcionamento
                      </Text>
                      <Text className="text-white  text-[12px]  font-poppinsRegular -mt-1 z-40">
                        {eventDetails?.openTime[0].openTime} - {eventDetails?.openTime[0].closeTime}
                      </Text>
                    </View>
                    {/* <View className="flex flex-row  ml-6 items-center ">
                      <Image
                        className="h-[10px] w-[7px] mr-1 z-40 "
                        source={require('../../../assets/Global/Icons/locationPinHD.png')}
                      />
                      <Text className="text-white text-[12px] self-center font-poppinsRegular mt-0 z-40">
                        {eventDetails?.local} {''}
                      </Text>
                      <Text className="text-white text-[12px] font-poppinsRegular mt-0 z-40">
                        {eventDetails?.city} / {eventDetails?.state}
                      </Text>
                    </View> */}
                    <View className="flex z-40 flex-row w-[88%] mb-10 -mt-1 items-center self-center">
                      <TouchableOpacity
                        onPress={() => handleRedirect(eventDetails.whatsAppLink, 'WhatsApp')}
                        className="relative z-30 mr-2 overflow-hidden w-[100px] h-[27px] rounded-lg items-center flex flex-row"
                      >
                        <BlurView className="absolute  w-full h-full" tint="light" intensity={80} />

                        <Image
                          className="w-5 -mt-[2px] rounded-md h-5 ml-1 "
                          source={require('../../../assets/Event/eventWhatsApp.png')}
                        />
                        <Text className="ml-1 text-[#450A88] font-poppinsBold text-[10px]">
                          Dúvidas?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRedirect(eventDetails.geolocation, 'Maps')}
                        className="relative z-30 mr-2 overflow-hidden w-[100px] h-[29px] rounded-lg items-center flex flex-row"
                      >
                        <BlurView className="absolute  w-full h-full" tint="light" intensity={80} />
                        <Image
                          className="w-5 -mt-[2px] rounded-md h-5 ml-1 "
                          source={require('../../../assets/Event/localizationIcon.png')}
                        />
                        <Text className="ml-1 text-[#450A88] font-poppinsBold text-[10px]">
                          Localização
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRedirect(eventDetails.instagramLink, 'Instagram')}
                        className="relative z-30 mr-2 overflow-hidden w-[100px] h-[29px] rounded-lg items-center flex flex-row"
                      >
                        <BlurView className="absolute  w-full h-full" tint="light" intensity={80} />
                        <Image
                          className="w-5 -mt-[2px] rounded-md h-5 ml-1 bg-white "
                          source={require('../../../assets/Global/Icons/instagram.png')}
                        />
                        <Text className="ml-1 text-[#450A88] font-poppinsBold text-[10px]">
                          Instagram
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Image
                      className="absolute mt-4 self-center -top-5 z-20"
                      source={require('../../../assets/Event/testeBlurEvent.png')}
                    />
                  </View>
                </View>
                <View className="flex flex-row mt-4 mb-10">
                  <TouchableOpacity className="w-[52vw] h-[80px]   self-start -mt-1  items-center -ml-1 flex flex-col  justify-between">
                    <View className="flex   w-full flex-col  relative ">
                      <View className="absolute z-30  -top-4 left-4">
                        <ImageBackground
                          className="w-[70px] h-[64px] flex flex-col items-center justify-center"
                          source={require('../../../assets/Event/colorFullBlur.png')}
                        >
                          <Image
                            source={require('../../../assets/Event/vipList.png')}
                            className="w-20 h-20 "
                          />
                        </ImageBackground>
                      </View>
                      <View className="flex z-40 flex-row w-[100%]  mt-16 ml-6 justify-between  items-center ">
                        <View className="relative z-30 w-[120px]  overflow-hidden rounded-lg border-[0.5px] border-white items-center h-[30px] flex flex-row">
                          <BlurView
                            className="absolute  w-full h-full"
                            tint="light"
                            intensity={80}
                          />
                          <Image
                            className="w-[18px] h-4 ml-1 "
                            source={require('../../../assets/Event/diamondNightPurple.png')}
                          />
                          <Text className="ml-1 text-[$450A88] text-[10px] font-poppinsBold">
                            Acessar Lista Vip
                          </Text>
                        </View>
                      </View>

                      <Image
                        className="absolute mt-4 self-center  h-[140px] w-[230px] -top-5 z-20"
                        source={require('../../../assets/Event/miniBlur1.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={getMatchProfile}
                    className="w-[52vw] h-[120px]  -ml-[3vw]  self-start -mt-1  items-center  flex flex-col  justify-between"
                  >
                    <View className="flex   w-full flex-col  relative items-center h-full justify-center ">
                      <View className="absolute z-30  -top-4 right-4">
                        <ImageBackground
                          className="w-[70px] h-[64px] flex flex-col items-center justify-center"
                          source={require('../../../assets/teste/testeBlur5.png')}
                        >
                          <Image
                            source={require('../../../assets/MyMatches/nightPeoples.png')}
                            className="w-14 h-12 -ml-1 "
                          />
                        </ImageBackground>
                      </View>
                      <View className="flex z-40 flex-row w-[100%]  mt-10 ml-12 justify-between  items-center self-center">
                        <View className="relative z-30 w-[160px] overflow-hidden rounded-lg border-[0.5px] border-white items-center h-[30px] flex flex-row">
                          <BlurView
                            className="absolute w-full h-full"
                            tint="light"
                            intensity={80}
                          />
                          <Image
                            className="w-[18px] h-4 ml-1 "
                            source={require('../../../assets/Event/heartIconPurple.png')}
                          />
                          <Text className="ml-1 text-[#450A88] text-[10px] font-poppinsBold">
                            Acessar Galera da Night
                          </Text>
                        </View>
                      </View>

                      <Image
                        className="absolute mt-4 self-center h-[140px] w-[230px] -top-5 z-20"
                        source={require('../../../assets/Event/miniBlur1.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="w-full pl-4 pr-2 self-center">
                  <View className="flex flex-col ">
                    <View className="flex flex-row mt-4 items-center">
                      <Image
                        className="w-6 h-[15px] mr-2 "
                        source={require('../../../assets/Event/eventDetails.png')}
                      />
                      <Text
                        className="text-white font-poppinsItalic text-[14px]"
                        style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                      >
                        Fique por dentro
                      </Text>
                    </View>
                    <Text className="text-white mb-1 font-poppinsSemiBold text-[20px]">
                      Descrição do Estabelecimento
                    </Text>
                  </View>
                  <Text className=" text-white font-poppinsRegular">
                    {eventDetails?.description}
                  </Text>
                  <View className="flex flex-col ">
                    <View className="flex flex-row mt-6 items-center">
                      <Image
                        className="w-6 h-6 mr-2 "
                        source={require('../../../assets/Event/eventAtraction.png')}
                      />
                      <Text
                        className="text-white font-poppinsItalic text-[14px]"
                        style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                      >
                        Se liga nos Detalhes
                      </Text>
                    </View>
                    <Text className="text-white mb-1 font-poppinsSemiBold text-[20px]">
                      Detalhes do {eventDetails?.name}
                    </Text>
                  </View>
                  <View className="self-center w-full  overflow-hidden">
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={eventDetails?.photos}
                      horizontal
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <View className="flex mt-4 mb-4 flex-row  items-center">
                          <Image
                            className="w-40 h-40 rounded-md mr-2 "
                            source={{ uri: item.imageLocation }}
                          />
                        </View>
                      )}
                    />
                  </View>
                  <Text className=" text-white mt-2 text-[14px] font-poppinsRegular">
                    {eventDetails?.attractions}
                  </Text>
                </View>

                <TouchableOpacity className="flex flex-row mt-10 w-[90%] p-2 ">
                  <Text className="font-poppinsRegular text-white underline text-[12px]">
                    Clique aqui{' '}
                  </Text>
                  <Text className="font-poppinsRegular text-white text-[12px]">
                    para ver os Termos e Regras do Evento{' '}
                  </Text>
                </TouchableOpacity>
                <View className="h-10" />
              </>
            </View>

            <TicketSheet
              navigate={() => handleNavigate()}
              id={eventDetails?.id}
              ref={actionSheetRef}
            />
          </ScrollView>
        </View>
      )}
      <ValidationModal id={id} open={isValidationOpen} setOpen={setIsValidationOpen} />
    </PurpleGradient>
  );
}
