import { Platform, TouchableOpacityProps, View, Image, TouchableOpacity } from 'react-native';
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

export function EventCard({
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
  useEffect(() => {
    function formatTime() {
      const currentDay = parseInt(moment().format('d')) - 1;
      const currentTime = moment().format('HH:mm');

      const currentOpenTime = item?.openTime.find((day: any) => day.props.dayOfWeek === currentDay);

      if (currentOpenTime) {
        const isOpenNow = moment(currentTime, 'HH:mm').isBetween(
          moment(currentOpenTime.props.openTime, 'HH:mm'),
          moment(currentOpenTime.props.closeTime, 'HH:mm'),
          undefined,
          '[]' // inclusivo: inclui o horário de abertura e fechamento
        );

        setIsOpen(isOpenNow);
        setStartHour(currentOpenTime.props.openTime);
        setEndHour(currentOpenTime.props.closeTime);
      }
    }

    if (categoryType === 'place' && item?.openTime) {
      formatTime();
    }
  }, [categoryType, item]);
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
        <View className=" w-[255px] scale-[0.9] h-[255px]  ml-4 rounded-lg overflow-hidden">
          <View>
            <Image className="h-[255px] object-cover " source={{ uri: photo_location }} />
          </View>
          <BlurView
            tint="dark"
            intensity={50}
            className="rounded-t-md w-[100%] overflow-hidden self-center bottom-0  absolute "
          >
            <View className="  bg-[#5D1A92]/60  w-full h-full">
              <View className="h-28 w-[100%] p-1  flex-col flex justify-between">
                <View className=" flex flex-row  ">
                  <Text
                    numberOfLines={2}
                    className="w-[68%] text-white text-[15px]  font-poppinsBold mr-1"
                  >
                    {name}
                  </Text>
                  <View className="absolute right-0">
                    <Calendar date={date} type={'event'} isOpen={isOpen} />
                  </View>
                </View>
                <View className=" w-[68%] items-center flex flex-row  ">
                  <Image
                    className="h-4 w-3 mr-1 "
                    source={require('../../../../../assets/Global/Icons/locationPinUnFill.png')}
                  />
                  <Text className=" text-white text-[13px] font-poppinsRegular" numberOfLines={2}>
                    {city} - {state}
                  </Text>
                </View>
                <View className="overflow-hidden h-8 w-40  rounded-lg self-center flex">
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
                    <Text className="text-white font-bold">Acessar essa Night</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
