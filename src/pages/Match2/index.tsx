import { Feather } from '@expo/vector-icons';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  PanResponder,
  Platform,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FadeIn,
  FadeInDown,
  LightSpeedInLeft,
  LightSpeedInRight,
  default as RNAnimated,
} from 'react-native-reanimated';
import CountDown from 'react-native-countdown-fixed';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import LottieView from 'lottie-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { BackButton } from '../../Components/Global/Back';
import { Button } from '../../Components/Global/Button';
import { HorizontalView } from '../../Components/Global/View/HorizontalView';
import { VerticalView } from '../../Components/Global/View/VerticalView';
import Theme from '../../styles/themes';
import { AuthPostAPI, authGetAPI } from '../../utils/api';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import GradientViewMatch from '../../Components/Global/LinearGradientView/LinearGradientMatch';
import photo0 from '../../../assets/Match/photo.png';
import photo1 from '../../../assets/Match/photo1.png';
import photo2 from '../../../assets/Match/photo2.png';
import photo3 from '../../../assets/Match/photo3.png';
import photo4 from '../../../assets/Match/photo4.png';
import { set } from 'react-hook-form';
import {
  DancingScript_400Regular,
  DancingScript_500Medium,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import { useFonts } from 'expo-font';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'socket.io-client';
import { ImageBackground } from 'react-native';

export function Match2() {
  const [panicked, setPanicked] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const navigation = useNavigation<any>();
  const { id, type } = useRoute().params as any;
  const [currentArray, setCurrentArray] = useState(true);
  const [ignoreCountdown, setIgnoreCountdown] = useState(false);
  const [people, setPeople, peopleRef] = useStateRefIndex([]);
  const [matchIndex, setMatchIndex, matchIndexRef] = useStateRefIndex(2);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>();
  const [imageLoading, setImageLoading] = useState(true);
  const [matchGifLoading, setMatchGifLoading] = useState(false);
  const [currentQueue, setCurrentQueue] = useState(0);
  const [emptyQueue, setEmptyQueue] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [realCountdown, setRealCountdown] = useState(0);
  const [countdownOver, setCountdownOver] = useState(false);
  const [matchId, setMatchId] = useState('');
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const position = useRef(new Animated.ValueXY()).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const CarouselPosition = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const FooterPosition = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const HideElements = useRef(new Animated.Value(2)).current;
  const opacity = useRef(new Animated.Value(0.5));
  const scale = useRef(new Animated.Value(1));
  const opacityOut = useRef(new Animated.Value(1));
  const zIndex = useRef(new Animated.Value(2));
  //
  // StateRef
  // useEffect(() => {
  //   setTimeout(() => {
  //     setMatched(true);
  //   }, 2000);
  // }, []);
  const likeAnimationRef = useRef<any>(null);

  const handleLikeButtonPress = () => {
    // Outras ações que deseja realizar quando o botão for pressionado
    endAnimation(); // Exemplo de função adicional
    handleRelease({ dx: 121, dy: 0 }); // Exemplo de função adicional
    setDisableButton(true);
  };
  const dislikeAnimationRef: any = useRef<any>(null);
  const matchedAnimRef = useRef<any>(null);
  useEffect(() => {
    if (matched) {
      matchedAnimRef.current?.play();
    }
  }, [matched]);

  const handleDisLikeButtonPress = () => {
    // Outras ações que deseja realizar quando o botão for pressionado
    endAnimation();
    handleRelease({ dx: -121, dy: 0 });
    setDisableButton(true);
  };

  function useStateRefIndex(defaultValue: any) {
    const [state, setState] = useState(defaultValue);
    const ref = useRef(state);

    const dispatch: any = useCallback((value: any) => {
      ref.current = typeof value === 'function' ? value(ref.current) : value;
      setState(ref.current);
    }, []);

    return [state, dispatch, ref];
  }
  const [profilesNumber, setProfilesNumber] = useState(6);
  const [changeProfileNumber, setChangeProfileNumber] = useState(7);
  const [pagesNumber, setPagesNumber] = useState(0);

  const handleLike = (gestureState: any) => {
    if (matchIndex === profilesNumber) {
      setProfilesNumber(profilesNumber + 6);
      setPage((prevPage) => prevPage + 1);
    }
    likeAnimationRef.current?.play();
    setDisableButton(true);
    Animated.spring(position, {
      toValue: {
        x: Dimensions.get('window').width + 100,
        y: gestureState.dy,
      },
      useNativeDriver: true,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      const currentIndex = matchIndexRef.current;
      const currentProfile = people[currentIndex];
      handleInteraction('like', currentIndex);
      if (matchIndex === changeProfileNumber) {
        setChangeProfileNumber((prevNumber) => prevNumber + 7);
        getMatchDetails();
      }
      setMatchIndex(currentIndex + 1);
      setCurrentPhoto(null); // Garante que a foto seja resetada como em handleDislike.
    });
  };

  const handleDislike = (gestureState: any) => {
    dislikeAnimationRef.current?.play();
    setDisableButton(true);
    Animated.spring(position, {
      toValue: {
        x: -Dimensions.get('window').width - 100,
        y: gestureState.dy,
      },
      useNativeDriver: true,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      handleInteraction('dislike', matchIndexRef.current);

      if (matchIndexRef.current === 9) {
        setPage(page + 1);
        getMatchDetails();
      }
      setMatchIndex(matchIndexRef.current + 1);
      setCurrentPhoto(null);
    });
  };
  const [totalProfilesCount, setTotalProfilesCount] = useState(0);
  useEffect(() => {
    const TotalCount = totalProfilesCount - 1;
    if (matchIndex !== 0 && matchIndex === totalProfilesCount) {
      setEmptyQueue(true);
    }
  }, [matchIndex, totalProfilesCount]);
  const handleRelease = (gestureState: any) => {
    if (gestureState.dx > 120) {
      handleLike(gestureState);
    } else if (gestureState.dx < -120) {
      handleDislike(gestureState);
    } else {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 4,
        useNativeDriver: true,
      }).start();
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (evt, gestureState) => {
          handleRelease(gestureState);
        },
      }),
    []
  );
  const handleChangePhoto = (photo: any) => {
    setCurrentPhoto(photo);
  };

  const rotate = position.x.interpolate({
    inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
    outputRange: ['-30deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  const bgImagescale = position.x.interpolate({
    inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
    outputRange: [1, 0.95, 1], // Ajusta para 0.95 no centro e 1 nas extremidades
    extrapolate: 'clamp',
  });
  const photoNeonPosition = position.x.interpolate({
    inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
    outputRange: [0, -12, 0], // Ajusta para 0.95 no centro e 1 nas extremidades
    extrapolate: 'clamp',
  });

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1.07,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYValue, {
        toValue: RFValue(-45), // Adjust the value as needed
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(HideElements, {
        toValue: 0, // Adjust the value as needed
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(CarouselPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(FooterPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const endAnimation = () => {
    Animated.parallel([
      Animated.timing(FooterPosition, {
        toValue: Dimensions.get('window').height,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(CarouselPosition, {
        toValue: Dimensions.get('window').width, // Adjust the value as needed
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(HideElements, {
        toValue: 1, // Adjust the value as needed
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScaleUp = () => {
    startAnimation();
    setShowAll(true);
  };

  const handleScaleDown = () => {
    endAnimation();
    setShowAll(false);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 350,
        }),
        Animated.timing(scale.current, {
          toValue: 1.2,
          useNativeDriver: true,
          duration: 350,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.5,
          useNativeDriver: true,
          duration: 350,
        }),
        Animated.timing(scale.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 350,
        }),
      ])
    ).start();
  }, [opacity]);

  useEffect(() => {
    Animated.timing(opacityOut.current, {
      toValue: 0,
      useNativeDriver: true,
      duration: 350,
    }).start();
    Animated.timing(zIndex.current, {
      toValue: 0,
      useNativeDriver: true,
      duration: 350,
    }).start();
  }, [opacityOut]);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (people.length > 0 && matchIndexRef.current < people.length) {
      setCurrentPhoto(people[matchIndexRef.current].photos[0].imageLocation);
    }
  }, [matchIndexRef.current, people]);
  const PhotosTeste = [
    { id: 1, photo: photo0 },
    { id: 2, photo: photo1 },
    { id: 3, photo: photo2 },
    { id: 4, photo: photo3 },
    { id: 5, photo: photo4 },
    { id: 6, photo: photo1 },
  ];

  const renderProfiles = () => {
    return people.map((item: any, index: any) => {
      if (index < matchIndexRef.current) {
        return null;
      }
      if (index === matchIndexRef.current) {
        return (
          <>
            <Animated.View
              key={index}
              style={{
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate: rotate },
                ],
                alignSelf: 'center',
                zIndex: 1,
                height: Dimensions.get('window').height - 370,
                width: Dimensions.get('window').width - 50,
                position: 'absolute',

                marginTop: getStatusBarHeight() + RFValue(100),
                display: 'flex',
                flexDirection: 'row',
              }}
              {...panResponder.panHandlers}
            >
              {/* //Todo */}
              <Animated.View
                className="absolute w-full h-full -left-[0.5px] rounded-lg z-[9]"
                style={{
                  transform: [{ scale: scaleValue }, { translateY: translateYValue }],
                }}
              >
                {currentPhoto !== null && (
                  <Animated.Image
                    onLoad={() => setDisableButton(false)}
                    style={{
                      transform: [{ scale: scaleValue }, { translateY: translateYValue }],
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
                    }}
                    source={{ uri: currentPhoto }}
                  />
                )}
                {!showAll && (
                  <>
                    <View className="w-[96%] opacity-50 self-center h-20 bg-[#9D38CD] absolute -bottom-3 -z-10 rounded-2xl" />
                  </>
                )}
              </Animated.View>
              <AnimatedTouchable
                onPress={handleScaleUp}
                style={{
                  alignSelf: 'flex-end',
                  width: '100%',
                  zIndex: 20,
                }}
              >
                <Animated.View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: RFValue(10),
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <VerticalView
                    style={{
                      alignSelf: 'flex-end',
                      justifyContent: 'space-between',
                    }}
                  >
                    {!showAll && (
                      <>
                        <Text
                          className="text-white text-xl font-poppinsBold"
                          style={{ display: imageLoading ? 'none' : 'flex' }}
                        >
                          {item.name}, {item.age}
                        </Text>
                        {/* <Name1 style={{ display: imageLoading ? "none" : "flex" }}>
                        {item.instagram
                          ? "@" + item.instagram.split("/").pop([3])
                          : ""}
                      </Name1> */}
                        <Text className="text-gray-200 text-lg font-poppinsRegular">
                          {item.location}
                        </Text>
                      </>
                    )}
                  </VerticalView>
                  <Feather
                    name="arrow-up-circle"
                    size={35}
                    color="white"
                    style={{
                      display: imageLoading ? 'none' : 'flex',
                      alignSelf: 'flex-end',
                    }}
                  />
                </Animated.View>
              </AnimatedTouchable>
            </Animated.View>
            <Animated.View
              className=" w-[100%] "
              style={{
                position: 'absolute',
                right: 0,
                left: 0,
                top: -30,
                bottom: 0,
                zIndex: 5,
                marginTop: Dimensions.get('window').height * 0.46,
                transform: [{ translateX: CarouselPosition }],
              }}
            >
              <FlatList
                showsHorizontalScrollIndicator={false}
                className="gap-0.2 "
                horizontal={true}
                data={people[matchIndexRef.current].photos}
                style={{ paddingTop: RFValue(5) }}
                renderItem={({ item, index }: any) => (
                  <TouchableOpacity
                    className=" w-24 border-[1px] border-white bg-blue-500 h-32 ml-14 rounded-lg overflow-hidden"
                    onPress={() => handleChangePhoto(item.imageLocation)}
                  >
                    <Image source={{ uri: item.imageLocation }} className="w-full h-full" />
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                zIndex: 6,
                width: '100%',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,

                height: RFValue(308),
                transform: [{ translateY: FooterPosition }],
              }}
            >
              <Image
                source={require('../../../assets/Match/teste4.png')}
                className=" absolute -z-[1] self-center  w-[105%] h-12 rounded-xl -mt-[5px] "
              />

              <PurpleGradient borderTop={20}>
                <AnimatedTouchable
                  onPress={handleScaleDown}
                  style={{
                    alignSelf: 'flex-end',
                    width: '100%',
                    zIndex: 10,
                  }}
                >
                  <Animated.View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      padding: RFValue(10),
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <VerticalView
                      style={{
                        alignSelf: 'flex-end',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View
                        className="flex flex-col"
                        style={{ justifyContent: 'space-between', margin: 0 }}
                      >
                        <Text
                          className="text-white text-xl font-poppinsBold"
                          style={{ display: imageLoading ? 'none' : 'flex' }}
                        >
                          {item.name}, {item.age}
                        </Text>
                        <Text className="text-gray-200 text-lg font-poppinsRegular">
                          {item.location}
                        </Text>
                        <Feather
                          name="arrow-up-circle"
                          size={35}
                          color="white"
                          style={{
                            position: 'absolute',
                            top: RFValue(2),
                            right: 0,
                            alignSelf: 'flex-end',
                            transform: [{ rotate: '180deg' }],
                          }}
                        />
                      </View>
                      <Text className="text-white text-[15px] font-poppinsRegular">
                        {item.instagram ? '@' + item.instagram.split('/').pop([3]) : ''}
                      </Text>
                      <HorizontalView style={{ width: '100%' }}>
                        <FlatList
                          className="w-full absolute "
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          style={{
                            position: 'relative',
                            backgroundColor: 'transparent',
                          }}
                          contentContainerStyle={{
                            width: '100%',
                            justifyContent: 'space-evenly',
                            flexWrap: 'wrap',
                          }}
                          horizontal
                          data={item.recent}
                          renderItem={({ item, index }: any) => (
                            <View className="border border-[rgba(211, 86, 243, 0.5)] flex-nowrap rounded-lg py-1 px-2.5 m-0.5 ">
                              <Text className=" text-[10px] text-white z-[2] font-poppinsRegular">
                                {item.name}
                              </Text>
                            </View>
                          )}
                        />
                      </HorizontalView>
                      <View className="w-[90%] self-center">
                        <Text className="text-white font-poppinsRegular">{item.description}</Text>
                      </View>
                    </VerticalView>
                  </Animated.View>
                </AnimatedTouchable>
              </PurpleGradient>
            </Animated.View>
          </>
        );
      } else if (index === matchIndex + 1) {
        return (
          <Animated.View
            key={index}
            style={{
              zIndex: -1,
              flex: 1,
              position: 'absolute',
            }}
            {...panResponder.panHandlers}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: Dimensions.get('window').height / 2,
                bottom: Dimensions.get('window').height / 2,
                left: Dimensions.get('window').width / 2,
                right: Dimensions.get('window').width / 2,
                transform: [{ translateX: -100 }, { translateY: -50 }],
                opacity: opacity.current,
                width: 200,
                height: 200,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                className="w-[200px] h-[100px]"
                source={require('../../../assets/GaleraDaNightLogo.png')}
              />
            </Animated.View>
          </Animated.View>
        );
      }
    });
  };

  //
  // Get New Matches
  const [lastLoadedPage, setLastLoadedPage] = useState<any>();

  useEffect(() => {}, [totalProfilesCount]);
  async function getMatchDetails() {
    if (page === lastLoadedPage) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      return;
    }
    const connect1: any = await authGetAPI(`/match/${type}/${id}/profiles?page=${page}`);
    if (connect1.body.error === 'Unauthorized') {
      setCountdown(connect1.body.message);
    }
    if (connect1.status !== 200) {
      setLoading(false);
      return;
    }
    if (page > connect1.body.pages) {
      if (connect1.body.profiles.length === 0) {
        setDisableButton(true);
        setEmptyQueue(true);
        setLoading(false);
      }
      setLoading(false);
      return;
    }

    if (connect1.body.profiles.length > 0) {
      setIgnoreCountdown(true);
      setCountdown(5);
      setRealCountdown(5);
      // Só atualiza o estado se a página atual for diferente da última carregada
      setPeople((prevPeople) => [...prevPeople, ...connect1.body.profiles]);
      setLastLoadedPage(page); // Atualiza a última página carregada
      setTotalProfilesCount((prevCount) => prevCount + connect1.body.profiles.length);
      setLoading(false);
    } else if (connect1.body.profiles.length === 0) {
      setDisableButton(true);
      setEmptyQueue(true);
      setLoading(false);
    }

    setLoading(false);
  }
  async function handleInteraction(action: string, index: number) {
    setCurrentPhoto(null);
    const connect = await AuthPostAPI(`match/${type}/interaction`, {
      type: action,
      placeId: id,
      customerMatchProfileId: people[index].id,
    });

    setDisableButton(false);
    if (connect.status === 200 && connect.body.match.matchId !== null) {
      setMatchedProfile(connect.body.match);
      setMatchId(connect.body.match.matchId);
      return setMatched(true);
    }
  }

  useEffect(() => {
    if (ignoreCountdown) {
      setCountdownOver(true);
    }

    getMatchDetails();
    setMatchIndex(0);
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    if (countdown !== 0) {
      setRealCountdown(countdown);
    }
  }, [countdown]);

  return (
    <View className="flex-1 ">
      <PurpleGradient>
        {loading ? (
          <LoadingIn />
        ) : (
          <>
            {emptyQueue === true && matched === false ? (
              <>
                <>
                  <RNAnimated.View
                    entering={FadeIn.duration(600)}
                    className="w-screen h-[120vh]  z-[9999]"
                  >
                    <PurpleGradient>
                      <RNAnimated.View entering={FadeIn.duration(500)}>
                        <ImageBackground
                          source={require('../../../assets/MyMatches/MatchBg.png')}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <View className="w-[80%]">
                            <Image
                              source={require('../../../assets/Global/galeraDaNight1.png')}
                              className="w-72 h-24 self-center "
                            />
                            <Text className="text-white text-2xl mt-6 mb-10 text-center font-poppinsRegular">
                              Calma, já já tem mais!
                            </Text>
                            <Text className="text-white text-[16px] text-center font-poppinsRegular">
                              Parece que você já explorou todas as conexões por aqui na Galera da
                              Night!
                            </Text>
                            <Text className="text-white text-[16px] mt-2 text-center font-poppinsRegular">
                              Mas não se preocupe, novas pessoas podem aparecer a qualquer momento.
                              Fique ligado e volte logo para mais conexões surpreendentes!"
                            </Text>
                            <TouchableOpacity
                              onPress={() => navigation.navigate('Home')}
                              className="w-60 relative  bg-[#9D38CD]/60 border border-[#9D38CD] self-center mt-20 mb-5 h-16 flex flex-row items-center justify-center rounded-lg"
                            >
                              <Text className="text-lg text-white z-20 font-poppinsRegular mr-1">
                                {' '}
                                Bora pra #Night{' '}
                              </Text>
                              <Image
                                className="h-[27px] w-6 z-20 "
                                source={require('../../../assets/Global/Icons/styleArrowRight.png')}
                              />
                              <Image
                                className="w-[125%] h-[205%] absolute "
                                source={require('../../../assets/MyMatches/blurStrong.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        </ImageBackground>
                      </RNAnimated.View>
                    </PurpleGradient>
                  </RNAnimated.View>
                </>
              </>
            ) : matched === true ? (
              <>
                <Modal
                  visible={matched}
                  onRequestClose={() => {
                    setMatched(false);
                  }}
                  transparent={true}
                >
                  <View className="h-screen w-screen overflow-hidden">
                    <RNAnimated.View
                      entering={FadeInDown.duration(600)}
                      className="absolute z-20 self-center top-36"
                    >
                      <Text className="text-5xl text-white font-dancingScript"> Its a match</Text>
                    </RNAnimated.View>
                    <RNAnimated.View
                      entering={FadeInDown.duration(600).delay(1000)}
                      className="absolute z-20 self-center top-52"
                    >
                      <Text className="text-lg text-white font-poppinsRegular">
                        {' '}
                        {matchedProfile?.name}
                      </Text>
                    </RNAnimated.View>
                    <View className="absolute self-center top-72 z-20 flex flex-row">
                      <RNAnimated.View
                        entering={LightSpeedInLeft.duration(1000)}
                        className="w-32 overflow-hidden  rounded-full  h-32"
                      >
                        <Image
                          source={require('../../../assets/Match/photo.png')}
                          className="w-32 rounded-full h-32"
                        />
                      </RNAnimated.View>
                      <RNAnimated.View
                        entering={LightSpeedInRight.duration(1000)}
                        className="w-32 -ml-10 overflow-hidden  rounded-full border-2 border-[#B055E9] h-32"
                      >
                        <Image
                          source={{ uri: matchedProfile?.photos[0].imageLocation }}
                          className="w-full h-full"
                        />
                      </RNAnimated.View>
                    </View>
                    <RNAnimated.View entering={FadeIn.duration(1000).delay(100)} className="flex-1">
                      <GradientViewMatch>
                        <LottieView
                          ref={matchedAnimRef}
                          // progress={1}
                          speed={2}
                          progress={1}
                          source={require('../../../assets/animation/match.json')} // Caminho para sua animação Lottie
                          loop={false}
                          className="w-full h-full z-10"
                        />
                        <RNAnimated.View
                          entering={FadeInDown.delay(600)}
                          className="flex absolute flex-col h-40 w-screen items-center  bottom-24 self-center  z-50"
                        >
                          <TouchableOpacity
                            className="w-[80%] z-30 h-10 border-2 bg-[#DA29F2] border-[#DA29F2]  rounded-full flex items-center justify-center  "
                            onPress={() =>
                              navigation.dispatch(StackActions.replace('Chat', { id: matchId }))
                            }
                          >
                            <Text className=" text-white font-poppinsRegular">Enviar Mensagem</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="w-[80%] h-10 z-30 border-2 border-[#DA29F2] mt-14  rounded-full flex items-center justify-center  "
                            onPress={() => {
                              getMatchDetails();
                              setMatched(false);
                            }}
                          >
                            <Text className=" text-white font-poppinsRegular">
                              Continuar Olhando
                            </Text>
                          </TouchableOpacity>
                        </RNAnimated.View>
                        <View className="flex-1 items-center justify-center z-30"></View>
                      </GradientViewMatch>
                    </RNAnimated.View>
                  </View>
                </Modal>
              </>
            ) : (
              <>
                <Animated.View
                  style={{
                    position: 'absolute',
                    zIndex: zIndex.current,
                    opacity: !countdownOver ? 1 : opacity.current,
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {countdownOver === false ? (
                    realCountdown < 1 ? (
                      <></>
                    ) : (
                      <>
                        <>
                          {type === 'place' ? (
                            <Image
                              className="absolute w-full h-full -z-[1]"
                              style={{ zIndex: -1 }}
                              source={require('../../../assets/Match/countdownBackgroundPlace.png')}
                            />
                          ) : (
                            <Image
                              className="absolute w-full h-full -z-[1]"
                              style={{ zIndex: -1 }}
                              source={require('../../../assets/Match/countdownBackgroundEvent.png')}
                            />
                          )}
                        </>
                        <View className="w-scree h-scren absolute z-[999] bottom-[300px]  r">
                          {isLoadingMatches ? (
                            ''
                          ) : (
                            <CountDown
                              until={realCountdown}
                              size={30}
                              onFinish={() => {
                                getMatchDetails();
                                setCountdownOver(true);
                              }}
                              digitStyle={{
                                backgroundColor: Theme.color.secondary_100,
                              }}
                              digitTxtStyle={{
                                color: Theme.color.gray_10,
                                fontSize: RFValue(30),
                              }}
                              timeLabelStyle={{
                                color: Theme.color.gray_10,
                                fontSize: RFValue(12),
                                fontWeight: 'bold',
                              }}
                              timeLabels={{
                                d: 'Dias',
                                h: 'Horas',
                                m: 'Minutos',
                                s: 'Segundos',
                              }}
                            />
                          )}
                        </View>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Animated.View>
                {countdownOver === true && <>{renderProfiles()}</>}
              </>
            )}
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                position: 'absolute',
                alignSelf: 'center',
                top: RFValue(35),
                zIndex: 0,
              }}
            >
              <TouchableOpacity
                className="  w-10 h-10 absolute flex items-centerjustify-center rounded-md z-[2000] overflow-hidden   left-5"
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Image
                  className="w-[22px] h-5 "
                  source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
                />
              </TouchableOpacity>
              {!showAll ? (
                <Image
                  className="w-full h-20 -z-10"
                  source={require('../../../assets/GaleraDaNightLogo.png')}
                />
              ) : (
                <View className="w-full h-20" />
              )}
            </Animated.View>
            {countdownOver === true && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: Dimensions.get('window').height / 4.15,
                  left: Dimensions.get('window').width / 3.15,
                  transform: [{ translateX: -100 }, { translateY: -50 }],
                  height: Dimensions.get('window').height - 370,
                  width: Dimensions.get('window').width - 50,
                  alignItems: 'center',
                  zIndex: 0,
                  justifyContent: 'center',
                }}
                className=""
              >
                {matchIndex === totalProfilesCount || matchIndex === totalProfilesCount - 1 ? (
                  <>
                    <View className="absolute w-full flex items-center justify-center rounded-[10px] -z-[11] bg-[#450A88]/40 border border-[#D356F3] h-full">
                      <Image
                        className="w-32 h-32"
                        source={require('../../../assets/Global/Logo2.png')}
                      />
                      <Text className="text-lg font-poppinsBold text-white">
                        Calma, já já tem mais! 🎉{' '}
                      </Text>
                    </View>
                    <View className="w-full h-full  rounded-[10px] -z-[12] flex-1 absolute ">
                      <PurpleGradient />
                    </View>
                  </>
                ) : (
                  <>
                    <Animated.Image
                      onLoad={() => setImageLoading(false)}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: -12,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: people[(matchIndex + 2) % people.length].photos[0].imageLocation,
                      }}
                    />
                    <Animated.Image
                      onLoad={() => setImageLoading(false)}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: -11,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: people[(matchIndex + 1) % people.length].photos[0].imageLocation,
                      }}
                    />
                  </>
                )}

                <Animated.View
                  className={`w-[96%] opacity-50 self-center h-20 bg-[#9D38CD] -bottom-3 absolute -z-20  rounded-2xl `}
                />
                <View className="w-[94%] opacity-30 self-center h-20 bg-[#9D38CD] absolute -bottom-6 -z-30 rounded-2xl" />
                <View className="w-[92%] self-center opacity-20 h-20 bg-[#9D38CD] absolute -bottom-9 -z-40 rounded-2xl" />
              </Animated.View>
            )}
            {countdownOver === true && (
              <View className="flex flex-row justify-evenly absolute w-full bottom-10 z-[90]">
                <TouchableOpacity
                  className="w-32 relative  flex items-center justify-center h-32"
                  disabled={disableButton}
                  style={{ opacity: disableButton ? 1 : 1 }}
                  onPress={handleDisLikeButtonPress}
                >
                  <Image
                    source={require('../../../assets/Match/dislikeBg.png')}
                    className="w-full h-full "
                  />
                  <LottieView
                    ref={dislikeAnimationRef}
                    // progress={1}
                    speed={2}
                    progress={1}
                    source={require('../../../assets/animation/dislike3.json')} // Caminho para sua animação Lottie
                    loop={false}
                    className="self-center w-40  absolute z-20 h-40 rounded-full"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className=" flex relative w-32 h-32 rounded-full items-center justify-center"
                  disabled={disableButton}
                  style={{ opacity: disableButton ? 1 : 1 }}
                  // onPress={() => {
                  //   endAnimation();
                  //   handleRelease({ dx: 121, dy: 0 });
                  //   setDisableButton(true);
                  // }}
                  onPress={handleLikeButtonPress}
                >
                  <Image
                    className="w-full h-full  z-10"
                    source={require('../../../assets/Match/like2.png')}
                  />
                  <LottieView
                    ref={likeAnimationRef}
                    progress={1}
                    source={require('../../../assets/animation/3.json')} // Caminho para sua animação Lottie
                    loop={false}
                    className="left-[1px] w-full  absolute z-20 h-full rounded-full"
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </PurpleGradient>
    </View>
  );
}
