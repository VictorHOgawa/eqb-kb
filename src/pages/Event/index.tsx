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
import { set } from 'react-hook-form';
import { VipListSheet } from '../../Components/Global/actionSheetVipList';
import { NoProductsModal } from '../../Components/Pages/Event/NoProductsModal';
import { OneSignal } from 'react-native-onesignal';

export function Event() {
  const navigation = useNavigation<any>();
  const [eventDetails, setEventDetails] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const vipListSheetRef = useRef<ActionSheetRef>(null);
  const { id } = useRoute().params as any;
  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [logged, setLogged] = useState(false);
  const [bannerNumber, setBannerNumber] = useState(0);
  const { cart } = useCart();
  const [isLogged, setIsLogged] = useState(false);
  const [date, setDate] = useState('');
  const [isNoProductsModalOpen, setIsNoProductsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [vipListSheetIsOpen, setVipListSheetIsOpen] = useState(false);
  async function getMatchProfile() {
    setMatchLoading(true);
    const connectValidation = await authGetAPI(`match/event/validation/${id}`);
    if (connectValidation.status === 400) {
      setMatchLoading(false);
      Alert.alert(
        'Ops!',
        'Para ver a Galera que vai nesse Evento você precisa estar cadastrado no Galera da Night'
      );
      setMatchLoading(false);
      navigation.navigate('MatchRegister', { id: id, type: 'event' });
    } else if (connectValidation.status === 401) {
      Alert.alert('Ops!', 'Para ver a Galera da Night desse Evento você precisa ter um Ingresso');
      setMatchLoading(false);
    } else if (connectValidation.status === 200) {
      setMatchLoading(false);
      navigation.navigate('Match', { id: id, type: 'event' });
    } else {
      setMatchLoading(false);
      Alert.alert('Ops!', 'Aconteceu algum erro inesperado, tente novamente mais tarde');
    }
  }

  async function getEventInfo() {
    handleMatchBanner();
    const connect = await getAPI(`/event/${id}/details`);
    if (connect.status !== 200) {
      return navigation.goBack();
    }
    setEventDetails(connect.body.event);
    setDate(connect.body.event.date);
    setVideoUrl(connect.body.video);

    return setLoading(false);
  }

  // useEffect(() => {
  // if (id) {
  // getEventInfo();
  // }
  //
  // OneSignal.User.addTag(`${id}`, `${id}`);
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

  const handleNext = () => {
    handleScroll();
    if (type !== '') {
      return setType('');
    }
    if (step === 1 && eventDetails?.products.length !== 0) {
      return setStep(step + 1);
    }
    if (step === 1 && eventDetails?.products.length === 0 && cart.ticket.ticket.length === 0) {
      return Alert.alert('Selecione um (ou mais) Ingresso(s)');
    }

    if (step === 1 && eventDetails?.products.length === 0 && cart.ticket.ticket.length !== 0) {
      setLoading1(true);
      logged ? navigation.navigate('Checkout') : navigation.navigate('Login', { page: 'Checkout' });
      return setLoading1(false);
    }
    if (step === 2 && type === '' && cart.ticket.ticket.length === 0 && cart.product.length === 0) {
      setLoading1(true);
      Alert.alert('Selecione um (ou mais) Produto(s)');
      return setLoading1(false);
    }
    if (
      (step === 2 && type === '' && cart.ticket.ticket.length !== 0) ||
      cart.product.length !== 0
    ) {
      setLoading1(true);
      logged ? navigation.navigate('Checkout') : navigation.navigate('Login', { page: 'Checkout' });
      return setLoading1(false);
    }
  };

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
  function handleNavigate() {
    if (eventDetails?.productSell === false) {
      actionSheetRef.current?.hide();
      navigation.navigate('Checkout');
      return;
    }
    if (eventDetails?.sellLink && eventDetails?.sell === false) {
      Alert.alert(
        'Redirecionamento Externo',
        'Você será redirecionado para um site externo para completar sua compra. Deseja continuar?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              Linking.openURL(eventDetails.sellLink).catch((err) => {
                console.error('Failed to open URL: ', err);
                alert('Não foi possível abrir o link');
              });
            },
          },
        ],
        { cancelable: false }
      );
      actionSheetRef.current?.hide();
      return;
    } else {
      actionSheetRef.current?.hide();
      const products = eventDetails.products;
      setTimeout(() => {
        navigation.navigate('EventProducts', {
          productId: eventDetails?.id,
        });
      }, 100);
      return;
    }
  }
  function handleProductsButtonPress() {
    if (eventDetails?.productSell === false) {
      actionSheetRef.current?.hide();
      setIsNoProductsModalOpen(true);
      return;
    } else {
      actionSheetRef.current?.hide();
      const products = eventDetails.products;
      setTimeout(() => {
        navigation.navigate('EventProducts', {
          productId: eventDetails?.id,
        });
      }, 100);
      return;
    }
  }
  function ChangeActionSheet() {
    vipListSheetRef.current?.hide();
    actionSheetRef.current?.show();
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
  return (
    <PurpleGradient>
      {loading ? (
        <LoadingIn />
      ) : (
        <View className="flex-1 z-10">
          <NoProductsModal
            isProductsModalOpen={isNoProductsModalOpen}
            setIsProductsModalOpen={() => setIsNoProductsModalOpen(false)}
          />
          <Animated.View
            className="z-[111111] absolute  self-center bottom-14"
            style={{ elevation: 10 }}
            entering={FadeInDown.delay(2000).duration(600)}
          >
            <Animated.View style={[animatedStyle]}>
              <TouchableOpacity
                onPress={() => actionSheetRef.current?.show()}
                // onPress={() => navigation.navigate("EventProducts")}
                className="w-72 px-4 z-[90] animate-pulse flex border-[2px] border-[#6B1DA5] flex-row  overflow-hidden h-14 items-center   rounded-2xl "
              >
                <Image
                  source={require('../../../assets/Event/blur80.png')}
                  className="absolute z-[90] opacity-100"
                />
                <BlurView tint="light" intensity={20} className="absolute w-72   h-full z-[90] " />
                <Image
                  source={require('../../../assets/Event/ticketIcon.png')}
                  className="w-9 h-9 z-[90] "
                />
                <Text className="text-white ml-2 z-[90] text-[22px] font-poppinsBold mt-0.5 self-center">
                  Adquirir Ingressos
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
                  <BlurView className="absolute w-full h-full" tint="dark" intensity={90} />
                  <Image
                    source={{ uri: eventDetails?.flyer }}
                    className="w-12 h-[80%] rounded-lg ml-1 "
                  />
                  <View className="flex flex-col ml-1 justify-center">
                    <Text
                      numberOfLines={2}
                      className="text-white max-w-[90%]  font-poppinsSemiBold text-[11px]"
                    >
                      {eventDetails?.name}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Image
                        className="w-4 h-4 text-white mr-1"
                        source={{ uri: eventDetails?.subCategoryIcon }}
                      />
                      <Text className="text-white font-poppinsRegular text-[11px]">
                        {eventDetails?.subCategory}
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
                          <Text className=" text-[#D356F3] font-poppinsRegular text-[11px]">
                            {moment(date).format('ddd').charAt(0).toUpperCase() +
                              moment(date).format('ddd').slice(1)}
                          </Text>
                          <Text className=" text-[#D356F3] font-poppinsRegular -mt-1 text-[15px] ">
                            {moment(date).format('D')}
                          </Text>
                        </View>
                        <View className="h-[15px] w-[80%] bg-[#D356F3] items-center justify-center rounded-b-md">
                          <Text className="text-white font-poppinsRegular text-[11px] ">
                            {moment(date).format('MMM').charAt(0).toUpperCase() +
                              moment(date).format('MMM').slice(1)}
                          </Text>
                        </View>
                      </ImageBackground>
                      <View className="relative w-[70px] z-30 mt-1 justify-center items-center border-[1px] border-[#D356F3] h-[45px] rounded-lg overflow-hidden flex flex-col">
                        <View className="w-full h-full absolute -mt-2 -ml-2 flex flex-col items-center bg-[#D356F3] opacity-60" />
                        <Text className="ml-1 text-[#450A88]  font-poppinsBold mt-0.5 mt-2  text-[9px]">
                          Começa às:
                        </Text>
                        <View className="flex flex-row mt-1 py-1 w-full items-center border-t-[#D356F3] border-t justify-center ">
                          <Image
                            className="w-3 h-[16px] ml-0 "
                            source={require('../../../assets/Event/clockIcon2.png')}
                          />

                          <Text className="ml-1 text-[#450A88] font-poppinsBold mt-0.5  text-[12px]">
                            {eventDetails?.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text
                      numberOfLines={2}
                      className="text-white text-[12px]  w-64 font-poppinsBold  mt-6 z-40 ml-6"
                    >
                      {eventDetails?.name}
                    </Text>
                    <View className="flex flex-row -mt-1 ml-6 items-center ">
                      <Image
                        className="h-[11px] w-[8px]  mr-1 z-40 "
                        source={require('../../../assets/Global/Icons/locationPinHD.png')}
                      />
                      <Text className="text-white text-[12px] self-center font-poppinsRegular x  z-40 ">
                        {eventDetails?.local} {''}
                      </Text>
                      <Text className="text-white text-[12px] font-poppinsRegular  mt-0 z-40 ">
                        {eventDetails?.city} / {eventDetails?.state}
                      </Text>
                    </View>
                    <View className="flex z-40 flex-row w-[88%]    mb-10 -mt-1  items-center self-center">
                      <TouchableOpacity className="relative z-30 mr-2 overflow-hidden w-[100px] h-[27px] rounded-lg items-center flex flex-row">
                        <BlurView className="absolute  w-full h-full" tint="light" intensity={80} />

                        <Image
                          className="w-5 -mt-[2px] rounded-md h-5 ml-1 "
                          source={require('../../../assets/Event/eventWhatsApp.png')}
                        />
                        <Text className="ml-1 text-[#450A88]  font-poppinsBold mt-0.5  text-[10px]">
                          Dúvidas?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="relative z-30 mr-2 overflow-hidden w-[100px] h-[29px] rounded-lg items-center flex flex-row">
                        <BlurView className="absolute  w-full h-full" tint="light" intensity={80} />
                        <Image
                          className="w-5 -mt-[2px] rounded-md h-5 ml-1 "
                          source={require('../../../assets/Event/localizationIcon.png')}
                        />
                        <Text className="ml-1 text-[#450A88] font-poppinsBold mt-0.5  text-[10px]">
                          Localização
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
                  <TouchableOpacity
                    onPress={() => vipListSheetRef.current?.show()}
                    className="w-[52vw] h-[80px]   self-start -mt-1  items-center -ml-1 flex flex-col  justify-between"
                  >
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
                          <Text className="ml-1 text-[#450A88] text-[10px] font-poppinsBold mt-0.5">
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
                    onPress={() => getMatchProfile()}
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
                          <Text className="ml-1 text-[#450A88] text-[10px] font-poppinsBold mt-0.5">
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
                        className="text-white text-[14px]"
                        style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                      >
                        Fique por dentro
                      </Text>
                    </View>
                    <Text className="text-white mb-1 font-poppinsSemiBold text-[20px]">
                      Descrição do Evento
                    </Text>
                  </View>
                  <Text className=" text-white font-poppinsRegular text-justify w-[97%]">
                    {eventDetails?.description}
                  </Text>
                  <View className="flex flex-col ">
                    <View className="flex flex-row mt-6 items-center">
                      <Image
                        className="w-6 h-6 mr-2 "
                        source={require('../../../assets/Event/eventAtraction.png')}
                      />
                      <Text
                        className="text-white text-[14px]"
                        style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                      >
                        Os artistas da festa
                      </Text>
                    </View>
                    <Text className="text-white mb-1 font-poppinsSemiBold text-[20px]">
                      Atrações do Evento
                    </Text>
                  </View>

                  <Image
                    source={{ uri: eventDetails?.attractionImage }}
                    className=" w-[105%] h-52  -ml-4 mt-2"
                  />
                  <Text className=" text-white mt-2 text-[14px] font-poppinsSemiBold">
                    {eventDetails?.attractions}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleProductsButtonPress()}
                  className="w-[95vw] mt-10 mb-10 scale-y-110 items-center self-center flex flex-col  justify-between"
                >
                  <View className="flex   w-full flex-col  relative ">
                    <View className="absolute z-30 flex-row top-8 left-4">
                      <Image
                        source={require('../../../assets/Event/bottles.png')}
                        className="w-9 h-8 "
                      />
                      <Text className="font-poppinsBold -mt-1.5 text-white text-center ml-6 text-[14px] w-[70%]">
                        Compre suas Bebidas com muitas Vantagens
                      </Text>
                    </View>

                    <View className="flex z-40 flex-col w-[100%]  mt-[66px]  justify-between   self-center">
                      <Text className=" text-white ml-6 font-poppinsRegular text-[10px] w-[85%]   ">
                        Compre seus{' '}
                        <Text className="font-poppinsBold">
                          Produtos antecipadas e retire no Local
                        </Text>{' '}
                        sem complicação.{' '}
                        <Text className="font-poppinsBold">
                          Rápido, prático e eleva sua experiência
                        </Text>{' '}
                        na festa a outro nível
                      </Text>

                      <View className="relative mr-4 w-36 self-end z-30 -mt-1 overflow-hidden rounded-lg border-[0.5px] border-white items-center h-[28px] flex flex-row">
                        <BlurView
                          className="absolute 0 w-full h-full"
                          tint="light"
                          intensity={80}
                        />
                        <Image
                          className="w-[18px] h-4 ml-1 "
                          source={require('../../../assets/Event/backPack.png')}
                        />
                        <Text className="ml-1 text-[#450A88] text-[11px] font-poppinsBold mt-0.5">
                          Adquirir Produtos
                        </Text>
                      </View>
                    </View>
                    <Image
                      className="absolute mt-4 self-center -top-5 z-20"
                      source={require('../../../assets/Event/largeProductsButton.png')}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-row mt-10 w-[90%] p-2 ">
                  <Text className=" text-white font-poppinsRegular underline text-[12px]">
                    Clique aqui{' '}
                  </Text>
                  <Text className=" text-white font-poppinsRegular text-[12px]">
                    para ver os Termos e Regras do Evento{' '}
                  </Text>
                </TouchableOpacity>
                <View className="h-40" />
              </>
            </View>

            <TicketSheet
              navigate={() => handleNavigate()}
              productSell={eventDetails?.productSell}
              sell={eventDetails?.sell}
              sellLink={eventDetails?.sellLink}
              id={eventDetails?.id}
              ref={actionSheetRef}
            />
            <VipListSheet
              navigate={() => ChangeActionSheet()}
              id={eventDetails?.id}
              ref={vipListSheetRef}
            />
          </ScrollView>
        </View>
      )}
    </PurpleGradient>
  );
}
