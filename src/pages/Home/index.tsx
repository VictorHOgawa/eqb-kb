import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ad } from '../../Components/Global/Ad';
import { LineBreak } from '../../Components/Global/LineBreak';
import { GlobalTitle } from '../../Components/Global/Title';
import { EventLoading } from '../../Components/Loading/Home/EventLoading';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { EventCard } from '../../Components/Pages/Home/Events';
import { AuthPostAPI, getAPI, loginVerifyAPI } from '../../utils/api';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { StatusBar } from 'react-native';
import ActionSheetCityButton from '../../Components/Global/ChoseCityButton';
import { set } from 'react-hook-form';
import { useAuth } from '../../context/autenticationContext';
import Animated from 'react-native-reanimated';
import { FlatList } from 'react-native';
import { useCity } from '../../context/selectedCityContext';
import { CategoryProvider, useCategory } from '../../context/categoryContext';
import { CategoryTypeProvider, useCategoryType } from '../../context/selectedCategoryTypeContext';
import CategoriesComponent from '../../Components/Pages/Home/CategoryComponents';
import { OneSignal } from 'react-native-onesignal';

export function Home() {
  const [location, setLocation] = useState();
  const [error, setError] = useState('');

  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<any>([]);
  const [places, setPlaces] = useState<any>([]);
  const { categories, setCategories } = useCategory();
  const { logged, setLogged } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cityId, setCityId] = useState('');
  const [categoryError, setCategoryError] = useState<null | string>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { categoryType, setCategoryType } = useCategoryType();
  async function getEvents() {
    // setLoading(true);
    const events = await getAPI(`/event?page=1&query&categoryId=${''}&cityId=${cityId}`);
    if (events.status === 200) {
      setEvents(events.body.events);
      setLoading(false);
      return setLoading(false);
    } else {
    }
  }
  async function getPlaces() {
    // setLoading(true);
    const places = await getAPI(`/place?page=1&query&categoryId=${categories.id}&cityId=${cityId}`);
    if (places.status === 200) {
      setPlaces(places.body.places);
      setLoading(false);
      return setLoading(false);
    } else {
    }
  }

  // useEffect(() => {
  //   OneSignal.Notifications.addEventListener('click', (notification) => {
  //     const data: any = notification.notification.additionalData;

  //     if (!data) {
  //       return;
  //     }

  //     if (data.type === 'event') {
  //       console.log('entrou');
  //       navigation.navigate('Event', { id: data.id });
  //     }

  //     if (data.type === 'place') {
  //       navigation.navigate('Place', { id: data.id });
  //     }
  //   });
  // }, []);

  async function postLocalization() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    try {
      let { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      // Construir o payload com as coordenadas
      const locationPayload = {
        latitude: latitude,
        longitude: longitude,
      };

      // Enviar a requisição com as coordenadas
      const connectValidation = await AuthPostAPI(`/match/place/presence`, {
        latitude: locationPayload.latitude,
        longitude: locationPayload.longitude,
      });

      if (connectValidation.status === 200) {
      } else {
      }
    } catch (error) {}
  }
  useEffect(() => {
    postLocalization();
  }, [logged]);
  const getCategory = async () => {
    try {
      const response = await getAPI('/category');
      if (response.status === 200 && response.body && Array.isArray(response.body.categories)) {
        setCategories(response.body.categories);
        setCategoriesLoading(false);
      } else {
        setCategoryError('Failed to fetch categories');
        setCategoriesLoading(false);
      }
    } catch (err) {
      setCategoryError('Failed to fetch categories');
      setCategoriesLoading(false);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getEvents();
    getPlaces();
  }, [cityId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }
      let location: any = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const connect = await AuthPostAPI('/place/presence', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  let Text2 = 'Waiting..';
  if (error) {
    Text2 = error;
  } else if (location) {
    Text2 = JSON.stringify(location);
  }

  const onRefresh = useCallback(() => {
    setLoading(true);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 2000);
  }, []);

  // const openUrl = ({ url }: any) => {
  //   useCallback(async () => {
  //     const canOpen = await Linking.canOpenURL(url);
  //     if (canOpen) {
  //       Linking.openURL(url);
  //     }
  //   }, [url]);
  // };

  // useEffect(() => {
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       openUrl({ url });
  //     }
  //   });
  // }, []);

  const getInitialURL = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      Linking.openURL(initialUrl);
      const page = await initialUrl.split('--/')[1].split('?')[0];
      const id = await initialUrl.split('id=')[1].split('&')[0];
      navigation.navigate(page, {
        id: id,
      });
    }
  };

  useEffect(() => {
    getInitialURL();
  }, []);
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
  const { selectedCity, setSelectedCity } = useCity();
  async function handleVerify() {
    setLoading(true);
    const verify = await loginVerifyAPI();
    if (verify === 200) {
      setLogged(true);
    } else {
      setLogged(false);
    }
    return setLoading(false);
  }
  useEffect(() => {
    handleVerify();
  }, []);
  return (
    <PurpleGradient>
      {loading ? (
        <LoadingIn />
      ) : (
        <SafeAreaView
          style={{
            paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 0 : 0,
            flex: 1,
            zIndex: 20,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 z-20"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <ActionSheetCityButton cityId={cityId} setCityId={setCityId} />
            <Ad />
            <Image
              className="w-[320px] self-center mt-5 h-[83px] "
              source={require('../../../assets/Home/mostLiked.png')}
            />
            <CategoriesComponent loading={categoriesLoading} error={categoryError} />

            <View className=" flex flex-row mt-5 justify-between ">
              <View className="flex flex-col p-4">
                <View className="flex flex-row mt-4 items-center">
                  <Image
                    className="w-6 h-6 mr-2 "
                    source={require('../../../assets/Home/partyIcon.png')}
                  />
                  <Text
                    className="text-white max-w-[70%] font-poppinsItalic text-[14px]"
                    style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                    numberOfLines={1}
                  >
                    {selectedCity.name === 'Todas as Cidades'
                      ? 'Bora curtir'
                      : `Bora sair em ${selectedCity.name}`}
                  </Text>
                </View>
                <Text
                  className="text-white text-[18px] font-poppinsBold"
                  style={{ fontFamily: 'Poppins_700Bold' }}
                >
                  Curta a Night na sua cidade
                </Text>
              </View>
              <Image
                className="w-20 h-20 mr-2 self-center  "
                resizeMode="contain"
                source={require('../../../assets/Global/Logo2.png')}
              />
            </View>
            <EventLoading loading={loading}>
              <>
                {events.length === 0 ? (
                  <Text className=" text-primary_100 font-poppinsRegular ml-4 text-lg">
                    Nenhum Evento Encontrado
                  </Text>
                ) : (
                  <View>
                    <AnimatedFlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      data={events}
                      keyExtractor={(item: any) => item.id}
                      renderItem={({ item }: any) => {
                        return (
                          <>
                            <EventCard
                              photo_location={item.flyer}
                              item={item}
                              name={item.name}
                              local={item.local}
                              date={item.date}
                              city={item.city}
                              state={item.state}
                              onPress={() => {
                                // Verifique o ID ao navegar
                                navigation.navigate('Event', { id: item.id });
                              }}
                            />
                          </>
                        );
                      }}
                    />
                  </View>
                )}
              </>
            </EventLoading>

            <View className=" flex flex-row  justify-between ">
              <View className="flex flex-col p-4">
                <View className="flex flex-row mt-4 items-center">
                  <Image
                    className="w-6 h-6 mr-2 "
                    source={require('../../../assets/Home/swipeIco.png')}
                  />
                  <Text
                    className="text-white text-[14px] font-poppinsItalic"
                    style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                  >
                    Tenha Experiências
                  </Text>
                </View>
                <Text className="text-white font-poppinsSemiBold text-[18px]">
                  Com a Galera da Night
                </Text>
              </View>
              <Image
                className="w-32 h-32 mr-2  self-center  "
                resizeMode="contain"
                source={require('../../../assets/Global/galeraDaNight1.png')}
              />
            </View>
            <View className=" flex flex-row w-[95%]     -mt-6 self-center">
              <View className=" w-[180px] h-[220px] rounded-lg  overflow-hidden ">
                <Image
                  source={require('../../../assets/Home/kissGif.gif')}
                  className="w-[100%] h-[100%] rounded-lg  "
                />
              </View>
              <View className=" flex flex-col ml-2 overflow-hidden justify-between  w-[50%] ">
                <View className=" flex flex-row items-center justify-start ">
                  <Image
                    className="h-7 w-7 mr-1 "
                    source={require('../../../assets/Global/Icons/chatWithLogoInside.png')}
                  />
                  <View className=" flex flex-col ">
                    <Text className="text-[14px]  font-poppinsRegular text-white">
                      Saiba onde a galera
                    </Text>
                    <Text className="text-[14px]  font-poppinsRegular text-white">
                      está curtindo hoje
                    </Text>
                  </View>
                </View>
                <View className=" flex flex-col mt-1 justify-between ">
                  <Text className="text-white font-poppinsRegular text-[9px]">
                    Vem pra Night! o App que joga no seu time. Quer saber quem vai estar naquela{' '}
                    <Text className="font-poppinsBold text-[9px]">festa incrível </Text> ou no{' '}
                    <Text className="font-poppinsBold text-[9px]">barzinho que você adora?</Text> A
                    Night te mostra! 🌙
                  </Text>
                  <Text className="text-white mt-2 font-poppinsRegular text-[9px]">
                    <Text className="font-poppinsBold text-[9px]">
                      Encontre novos amigos, descubra paqueras e mergulhe em curtição garantida.
                    </Text>{' '}
                    Seja para curtir a noite ou para criar conexões, a Night é sua escolha certa.
                    Vem viver momentos únicos conosco! 🎉"
                  </Text>
                </View>
                <View className=" mt-1 scale-[0.8] justify-start flex -ml-4 self-start">
                  <TouchableOpacity className=" bg-[#6B1DA5]/30 rounded-2xl border-2 border-[#6B1DA5] h-9 w-40 flex items-center justify-center flex-row">
                    <Image
                      className=" w-4 h-[19px] mr-2 "
                      source={require('../../../assets/Home/fireIco.png')}
                    />
                    <Text className="text-white  text-8 font-poppinsSemiBold">
                      Se Joga na Night
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* <View className=" w-full self-center  flex  p-4  mt-10">
              <Image
                className=" h-16 left-4 w-16 absolute "
                source={require('../../../assets/Home/logoImg.png')}
              />
              <View className=" flex flex-row justify-center w-full items-center ">
                <Image
                  className=" h-8 w-8 mr-2"
                  source={require('../../../assets/Home/ticketIconHome.png')}
                />
                <Text className=" font-bold font-poppinsRegular text-[16px] text-white ">
                  Ingressos NightApp
                </Text>
              </View>
              <View className=" w-[95%] mt-6 h-80 border-2 border-white rounded-2xl self-center"></View>
            </View> */}
            <View className=" h-40" />
          </ScrollView>
        </SafeAreaView>
      )}
    </PurpleGradient>
  );
}
