import { useState, useEffect } from 'react';
import { AuthPutAPI, authGetAPI } from '../../../utils/api';
import { LoadingIn } from '../../../Components/Loading/LoadingIn';
import { Header } from '../../../Components/Global/Header';
import { Ad } from '../../../Components/Global/Ad';
import { GlobalTitle } from '../../../Components/Global/Title';
import { HorizontalView } from '../../../Components/Global/View/HorizontalView';
import { VerticalView } from '../../../Components/Global/View/VerticalView';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Button } from '../../../Components/Global/Button';
import Theme from '../../../styles/themes';
import { More } from '../../../Components/Global/More';
import { useNavigation } from '@react-navigation/native';
import { Alert, Image, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { View } from 'react-native';
import PurpleGradient from '../../../Components/Global/LinearGradientView/LinearGradient';
import { Text } from 'react-native';

export function Promoter() {
  const navigation = useNavigation<any>();
  const [jobs, setJobs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);

  async function getDetails() {
    setLoading(true);
    const connect = await authGetAPI('/user/promoter');

    if (connect.status !== 200) {
      alert(connect.body);
      return setLoading(false);
    }
    setJobs(connect.body.userEventPromoter);

    return setLoading(false);
  }

  // async function handleStatus(item: any, index: number) {
  //   setCurrentIndex(index);
  //   setLoading1(true);
  //   const connect = await AuthPutAPI(`/user/promoter/${item.id}`, {
  //     status: item.status,
  //   });
  //   if (connect.status !== 200) {
  //     Alert.alert(connect.body);
  //     return setLoading1(false);
  //   }
  //   navigation.replace("Promoter");
  //   return setLoading1(false);
  // }

  // useEffect(() => {
  //   getDetails();
  // }, []);
  return (
    <>
      <View className="flex-1">
        <PurpleGradient>
          {loading ? (
            <LoadingIn />
          ) : (
            <>
              <View className="p-4">
                <Header />
              </View>
              <View className="flex">
                <Ad />
              </View>
              <View className="p-4">
                <Text className=" mt-40 text-2xl text-white font-poppinsRegular">
                  Jobs - Promoter
                </Text>
              </View>
              <TouchableOpacity className=" flex-row bg-black text-white border border-white rounded-[10px] py-1 px-2.5 self-center absolute bottom-5 items-center justify-center">
                <Image
                  className="w-3 h-3"
                  source={require('../../../../assets/Global/Icons/youtubeIcon.png')}
                />
                <Text className="text-white font-poppinsRegular">
                  {' '}
                  {''}Dúvidas? Veja esse Rápido Vídeo
                </Text>
              </TouchableOpacity>
            </>
          )}
        </PurpleGradient>
      </View>
    </>
  );
}
