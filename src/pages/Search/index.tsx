import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { EventLoading } from '../../Components/Loading/Home/EventLoading';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { EventCard } from '../../Components/Pages/Home/Events';
import { AuthPostAPI, getAPI } from '../../utils/api';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { FadeIn, FadeOut, Layout, SequencedTransition } from 'react-native-reanimated';
import BaladaImg from '../../../assets/Home/drinkImg1.png';
import BaladaIcon from '../../../assets/Home/drink.png';
import BarImg from '../../../assets/Home/barImg.png';
import BarIcon from '../../../assets/Home/bar.png';
import LoungeImg from '../../../assets/Global/louges.png';
import LoungeIcon from '../../../assets/Home/hookah.png';
import FestaImg from '.../../../assets/Home/partyImg.png';
import FestaIcon from '../../../assets/Home/party.png';
import NightStreetImg from '../../../assets/Home/nightStreetImg.png';
import NightStreetIcon from '../../../assets/Home/nightStreet.png';
import SInucaImg from '../../../assets/Home/bilharImg.png';
import SInucaIcon from '../../../assets/Home/bilhar.png';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import ActionSheetCityButton from '../../Components/Global/ChoseCityButton';
import { FlatList } from 'react-native';
import ActionSheetCitySmall from '../../Components/Pages/Search/ChoseCityButton';
import { useCity } from '../../context/selectedCityContext';
import { useCategoryType } from '../../context/selectedCategoryTypeContext';
import { useCategory } from '../../context/categoryContext';
import HeaderBar from '../../Components/Global/headerBar';
import { SearchEventCard } from '../../Components/Pages/Search/Events';

export function Search() {
  const [location, setLocation] = useState();
  const [error, setError] = useState('');
  const [reload, setReload] = useState(false);
  const navigation = useNavigation<any>();
  const carouselRef = useRef<any>();
  const [events, setEvents] = useState<any>([]);
  const [places, setPlaces] = useState<any>([]);
  const { categories, setCategories, categoriesIndex } = useCategory();
  const [currentCategory, setCurrentCategory] = useState<any>(categories[categoriesIndex]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cityId, setCityId] = useState('');
  const [categoryError, setCategoryError] = useState<null | string>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<any>([]);
  const { categoryType, setCategoryType } = useCategoryType();
  async function getEvents() {
    setReload(true);
    const events = await getAPI(
      `/event?page=1&query=${query}&categoryId=${currentCategory.id}&cityId=${cityId}`
    );
    if (events.status === 200) {
      setEvents(events.body.events);
      setReload(false);
      setLoading(false);
      return setLoading(false);
    } else {
      setReload(false);
    }
  }
  async function getPlaces() {
    setReload(true);
    const places = await getAPI(
      `/place?page=1&query=${query}&categoryId=${currentCategory.id}&cityId=${cityId}`
    );
    if (places.status === 200) {
      setReload(false);
      setPlaces(places.body.places);
      setLoading(false);
      return setLoading(false);
    } else {
      setReload(false);
    }
  }
  async function getAll() {
    setReload(true); // Indica que o carregamento começou

    try {
      // Executa ambas as chamadas API simultaneamente
      const [eventsResponse, placesResponse] = await Promise.all([
        getAPI(`/event?page=1&query=${query}&cityId=${cityId}`),
        getAPI(`/place?page=1&query=${query}&cityId=${cityId}`),
      ]);

      // Verifica se ambas as chamadas foram bem-sucedidas
      if (eventsResponse.status === 200 && placesResponse.status === 200) {
        const combinedData = [...eventsResponse.body.events, ...placesResponse.body.places];
        setAllEvents(combinedData); // Atualiza o estado com a combinação dos eventos e locais
      } else {
        // Lida com possíveis erros de uma das chamadas
        console.error('Erro ao carregar dados:', eventsResponse.status, placesResponse.status);
      }
    } catch (error) {
      console.error('Erro ao fazer chamadas API:', error);
    }

    setReload(false); // Indica que o carregamento terminou
  }
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
  const { width } = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState(1);

  const [oldIndex, setOldIndex] = useState(1);
  const baseOptions = {
    parallaxScrollingOffset: 275,
    parallaxScrollingScale: 1.05,
    parallaxAdjacentItemScale: 0.98,
  };
  useEffect(() => {
    setActiveIndex(categoriesIndex);
    setCurrentCategory(categories[categoriesIndex]);
  }, [categoriesIndex]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [newTitle, setNewTitle] = useState(false);
  useEffect(() => {
    if (
      categories &&
      categories.length > 0 &&
      activeIndex >= 0 &&
      activeIndex < categories.length
    ) {
      setTitle(categories[activeIndex].name);
      setTimeout(() => {
        setNewTitle(false);
      }, 100); // Certifique-se que é .title, não .name
    }
  }, [activeIndex, categories, categoriesIndex]);
  const [title, setTitle] = useState(categories[categoriesIndex].name);
  const CategoryId = useState(categories[categoriesIndex].id);
  const handleSnapToItem = (index: number) => {
    setQuery('');
    setActiveIndex(index);
    const currentCategory = categories[index];
    setNewTitle(true);
    setTitle(currentCategory.name);
    setCurrentCategory(currentCategory);
    setCategoryType(currentCategory.type);
  };

  const moveCarouselLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const moveCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const { selectedCity, setSelectedCity } = useCity();
  useEffect(() => {
    if (currentCategory.type === 'event') {
      getEvents();
    }
    if (currentCategory.type === 'place') {
      getPlaces();
    }
  }, [cityId, query, currentCategory]);
  useEffect(() => {
    if (query !== '') {
      getAll();
    }
  }, [query, cityId]);
  const isEmpty = query
    ? allEvents.length === 0
    : currentCategory.type === 'event'
      ? events.length === 0
      : places.length === 0;
  return (
    <PurpleGradient>
      <View className=" flex-1 ">
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
              <HeaderBar
                title="Explorar"
                icon={
                  <Image
                    className="w-6 h-6   rounded-xl "
                    source={require('../../../assets/Global/Icons/explore.png')}
                  />
                }
              />
              <View className="w-[90%] h-12 flex rounded-md overflow-hidden self-center flex-row   mt-5 mb-5 items-center ">
                <LinearGradient
                  colors={['#9E00F5', '#6325CB']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  className="w-full h-full absolute "
                />
                <TextInput
                  placeholder="Buscar"
                  value={query}
                  onChange={(e) => setQuery(e.nativeEvent.text)}
                  placeholderTextColor={'white'}
                  className=" w-[90%] self-center rounded-lg px-4 text-lg  text-white mt-1 font-poppinsRegular"
                />
                <Image
                  className="ml-auto mr-2 w-5 h-5 "
                  source={require('../../../assets/Global/Icons/lupa.png')}
                />
              </View>
              <Carousel
                ref={carouselRef}
                width={width}
                onSnapToItem={handleSnapToItem}
                height={60}
                loop={true}
                data={categories}
                defaultIndex={categoriesIndex}
                mode="parallax"
                modeConfig={baseOptions}
                scrollAnimationDuration={1000}
                renderItem={({ item, index }) => (
                  <>
                    <TouchableOpacity
                      onPress={moveCarouselLeft}
                      className="absolute  w-28 h-12 ml-5"
                    />
                    <View className="flex flex-col items-center w-28 self-center justify-center">
                      <TouchableOpacity className="w-28 z-[900] h-12 flex items-center justify-center">
                        <Image
                          className="absolute w-28 h-12"
                          source={require('../../../assets/Global/smallNeon.png')}
                        />
                        <View className=" self-center absolute  z-50 ">
                          {activeIndex === index && (
                            <Animated.Image
                              entering={FadeIn.duration(700).delay(100)}
                              className="self-center  w-6 h-6"
                              source={{ uri: item.icon }}
                            />
                          )}
                        </View>

                        <Image
                          className="w-[99px] absolute h-[44px] rounded-md mt-[1px]"
                          source={{ uri: item.background }}
                        />
                        <View className="w-[99px] absolute h-[44px] rounded-md mt-[1px] border-[1px] border-[#D356F3] bg-[#3C1357]/70" />

                        <View className="w-[99px] absolute h-[44px] rounded-md mt-[1px] border-[1px] border-[#D356F3] bg-[#3C1357]/70" />
                        <View className="z-10 absolute">
                          {activeIndex !== index && (
                            <Animated.Text
                              entering={FadeIn.duration(700).delay(100)}
                              className="text-white  self-center"
                            >
                              {item.name}
                            </Animated.Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={moveCarouselRight}
                      className="absolute right-5 mt-2  w-28 h-12 "
                    />
                  </>
                )}
              />

              <View className=" flex flex-row  w-[100vw] pl-4 pr-2 justify-between  items-center">
                <View className="flex flex-col  ">
                  <View className="flex flex-row mt-4 items-center">
                    <Image
                      className="w-6 h-6 mr-2 "
                      source={require('../../../assets/Home/partyIcon.png')}
                    />
                    <Text
                      className="text-gray_40 font-poppinsItalic mt-1 text-[14px]"
                      style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                    >
                      Bora pra Night?
                    </Text>
                  </View>
                  <View className="h-8 max-w-[250px]  ">
                    {newTitle !== true && title && (
                      <Animated.View entering={FadeIn.duration(700)}>
                        {query ? (
                          <Text className="text-white font-poppinsSemiBold mt-1 text-[20px]">
                            Todas as Nights
                          </Text>
                        ) : (
                          <Text className="text-white font-poppinsSemiBold mt-1 text-[20px]">
                            Melhores {title === 'Todos' ? 'eventos' : title}
                          </Text>
                        )}
                      </Animated.View>
                    )}
                  </View>
                </View>
                <ActionSheetCitySmall cityId={cityId} setCityId={setCityId} />
              </View>

              <EventLoading loading={loading}>
                <View className="h-72 flex  justify-center  ">
                  {isEmpty ? (
                    <Animated.View entering={FadeIn.duration(700).delay(100)}>
                      <Text className=" text-primary_100 p-5 self-center font-poppinsRegular mt-1 text-lg">
                        Nenhum Evento Encontrado
                      </Text>
                    </Animated.View>
                  ) : (
                    <View className=" h-full">
                      {!reload && (
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(item: any) => item.id}
                          horizontal
                          data={
                            query ? allEvents : currentCategory.type === 'event' ? events : places
                          }
                          renderItem={({ item }: any) => {
                            return (
                              <View key={item.id}>
                                <SearchEventCard
                                  photo_location={item.flyer}
                                  name={item.name}
                                  local={item.local}
                                  date={item.date}
                                  categoryType={categoryType}
                                  item={item}
                                  id={item.id}
                                  city={item.city}
                                  state={item.state}
                                  onPress={() => {
                                    navigation.navigate(item.openTime ? 'Place' : 'Event', {
                                      id: item.id,
                                    });
                                  }}
                                />
                              </View>
                            );
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
              </EventLoading>
              <View className=" flex flex-row  justify-between ">
                <View className="flex flex-col p-4">
                  <View className="flex flex-row mt-4 items-center">
                    <Image
                      className="w-6 h-6 mr-2 "
                      source={require('../../../assets/Home/swipeIco.png')}
                    />
                    <Text
                      className="text-gray_40 font-poppinsItalic mt-1 text-[14px]"
                      style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                    >
                      Vamos conhecer uma Galera?
                    </Text>
                  </View>
                  <Text className="text-white font-poppinsSemiBold mt-1 text-[20px]">
                    {' '}
                    Bora pra Night com a Galera
                  </Text>
                </View>
              </View>
              <View className=" w-screen h-64 ">
                <TouchableOpacity>
                  <Image
                    className=" w-full -mt-3 h-full"
                    source={require('../../../assets/GaleraDaNightBanner.png')}
                  />
                </TouchableOpacity>
              </View>
              <View className=" h-20" />
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
    </PurpleGradient>
  );
}
