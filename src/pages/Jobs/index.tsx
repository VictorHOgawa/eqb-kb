import { useNavigation } from '@react-navigation/native';
import { GlobalTitle } from '../../Components/Global/Title';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { Text } from 'react-native';

export function Jobs() {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <View className="flex-1">
      <PurpleGradient>
        {loading ? (
          <LoadingIn />
        ) : (
          <View className="flex-1 px-4">
            {/* <Header /> */}

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                className="w-5 h-5 mt-16 absolute left-0"
                source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
              />
            </TouchableOpacity>
            <Image
              className="h-28 w-32 self-center mt-10 "
              source={require('../../../assets/Global/Logo2.png')}
            />
            {/* </View> */}
            <View className="flex mt-10 items-center flex-row ">
              <Image
                className="h-5 w-5 mr-2 "
                source={require('../../../assets/Global/Icons/entrance.png')}
              />
              <Text className="text-2xl text-white font-poppinsRegular"> Portaria</Text>
            </View>
            <TouchableOpacity
              className="w-[310px] h-[120px] rounded-[10px] self-center mt-[5%]"
              onPress={() => navigation.navigate('Portaria')}
            >
              <Image
                className="w-[310px] h-[120px] rounded-[10px] self-center"
                source={require('../../../assets/Global/JobsDaNight.png')}
              />
            </TouchableOpacity>
            <View className="flex mt-10 items-center flex-row ">
              <Image
                className="h-5 w-5 mr-2 "
                source={require('../../../assets/Global/Icons/promoter.png')}
              />
              <Text className="text-2xl  text-white font-poppinsRegular">Promoter</Text>
            </View>
            <TouchableOpacity
              className="w-[310px] h-[120px] rounded-[10px] self-center mt-[5%]"
              onPress={() => navigation.navigate('Promoter')}
            >
              <Image
                className="w-[310px] h-[120px] rounded-[10px] self-center"
                source={require('../../../assets/Global/PromoterNight.png')}
              />
            </TouchableOpacity>
          </View>
        )}
      </PurpleGradient>
    </View>
  );
}
