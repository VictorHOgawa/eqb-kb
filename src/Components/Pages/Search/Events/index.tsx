import {
  Platform,
  TouchableOpacityProps,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { Calendar } from '../../../Global/Calendar';
import { Button, City, Container, DetailsContainer, TextContainer, Title } from './styles';
import { Text } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  CurvedTransition,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  SequencedTransition,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import { authGetAPI } from '../../../../utils/api';
import { useNavigation } from '@react-navigation/native';
import { ValidationModal } from '../../Place/ValidationModal';
interface Props extends TouchableOpacityProps {
  photo_location?: string;
  name?: string;
  local?: string;
  date: Date;
  item: any;
  id?: string;
  categoryType?: string;
  city?: string;
  state?: string;
}

export function SearchEventCard({
  photo_location,
  name,
  local,
  item,
  date,
  categoryType,
  id,
  city,
  state,
  ...rest
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [startHour, setStartHour] = useState<any>();
  const [endHour, setEndHour] = useState<any>();
  const [matchLoading, setMatchLoading] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    function formatTime() {
      const currentDay = parseInt(moment().format('d')) - 1;
      const currentTime = moment().format('HH:mm');

      const currentOpenTime = item?.openTime.find((day: any) => day.dayOfWeek === currentDay);

      if (currentOpenTime) {
        const isOpenNow = moment(currentTime, 'HH:mm').isBetween(
          moment(currentOpenTime.openTime, 'HH:mm'),
          moment(currentOpenTime.closeTime, 'HH:mm'),
          undefined,
          '[]' // inclusivo: inclui o horário de abertura e fechamento
        );

        setIsOpen(isOpenNow);
        setStartHour(currentOpenTime.openTime);
        setEndHour(currentOpenTime.closeTime);
      }
    }

    if (categoryType === 'place' && item?.openTime) {
      formatTime();
    }
  }, [categoryType, item]);
  async function handleEventMatch() {
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
  async function handlePlaceMatch() {
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
  return (
    <Animated.View
      className="flex-1"
      entering={FadeInDown.duration(1000).delay(100)}
      exiting={FadeOutDown.duration(100)}
    >
      <TouchableOpacity
        className=" -ml-5 "
        {...rest}
        style={{
          shadowColor: '#fff', // Define a cor da sombra como branco
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        }}
      >
        <View className=" w-72 scale-[0.9] h-72  ml-4 rounded-lg overflow-hidden">
          {item.openTime ? (
            <TouchableOpacity
              className="absolute top-1 scale-[1.4] right-5 z-10"
              onPress={() => handlePlaceMatch()}
            >
              {matchLoading ? (
                <ImageBackground
                  className="w-[95px] h-[28px] p-1 "
                  source={require('../../../../../assets/Global/cardHeaderEmpty.png')}
                >
                  <ActivityIndicator size="small" color="#fff" />
                </ImageBackground>
              ) : (
                <Image
                  className="w-[95px] h-[28px] "
                  source={require('../../../../../assets/Global/seePlacePeopl.png')}
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleEventMatch()}
              className="absolute top-1 scale-[1.4] right-5 z-10"
            >
              {matchLoading ? (
                <ImageBackground
                  className="w-[95px]  flex  h-[28px] "
                  source={require('../../../../../assets/Global/cardHeaderEmpty.png')}
                >
                  <ActivityIndicator size="small" className="mt-1" color="#fff" />
                </ImageBackground>
              ) : (
                <Image
                  className="w-[95px] h-[28px] "
                  source={require('../../../../../assets/Global/seeEventPeople.png')}
                />
              )}
            </TouchableOpacity>
          )}
          <View>
            <Image className="h-72 object-cover " source={{ uri: photo_location }} />
          </View>
          <BlurView
            tint="dark"
            intensity={50}
            className="rounded-t-md w-[100%] overflow-hidden self-center bottom-0  absolute "
          >
            <View className="  bg-[#5D1A92]/60  w-full h-[120px]">
              <View className=" self-end w-[100%] p-1 h-14  flex-col flex ">
                <View className=" flex flex-row   ">
                  <Text
                    numberOfLines={2}
                    className="w-[68%]  text-white text-[15px]  font-poppinsSemiBold mr-1"
                  >
                    {name}
                  </Text>
                  <View className="absolute -right-1  scale-90">
                    <Calendar
                      date={categoryType === 'place' ? new Date() : date}
                      type={categoryType}
                      isOpen={isOpen}
                    />
                  </View>
                </View>
                <View className=" w-[68%]   ">
                  <Text className=" text-white text-[13px] font-poppinsRegular " numberOfLines={2}>
                    {city} - {state}
                  </Text>
                </View>
              </View>
              <View className="overflow-hidden h-10 w-40 absolute bottom-2 rounded-lg self-center flex">
                <LinearGradient
                  colors={['#3D37D8', '#832DF2']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="text-white font-poppinsBold mt-1">Acessar essa Night</Text>
                </LinearGradient>
              </View>
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>
      <ValidationModal id={id} open={isValidationOpen} setOpen={setIsValidationOpen} />
    </Animated.View>
  );
}
