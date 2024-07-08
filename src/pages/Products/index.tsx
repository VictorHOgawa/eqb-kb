import { View, Image, Text, ScrollView, Platform } from 'react-native';
import { Ad } from '../../Components/Global/Ad';
import { LoadingIn } from '../../Components/Loading/LoadingIn';

import { ProductCards } from '../../Components/Pages/Products';
import { authGetAPI } from '../../utils/api';
import { useState, useEffect } from 'react';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import HeaderBar from '../../Components/Global/headerBar';
import { SafeAreaView } from 'react-native';

export function Products() {
  const [events, setEvents] = useState<any>({
    placeProducts: [],
    eventProducts: [],
  });
  const [loading, setLoading] = useState(false);

  async function getProducts() {
    setLoading(true);
    const connect = await authGetAPI('/customer/product');

    if (connect.status !== 200) {
      return setLoading(false);
    }
    setEvents(connect.body);
    return setLoading(false);
  }
  useEffect(() => {
    getProducts();
  }, []);
  const navigation = useNavigation<any>();
  return (
    <PurpleGradient>
      <View className="flex-1 ">
        {loading ? (
          <LoadingIn />
        ) : (
          <SafeAreaView
            style={{
              paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 0 : 0,
              flex: 1,
            }}
          >
            <ScrollView>
              <HeaderBar />
              <View className={` top-4 left-4  absolute`}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ zIndex: 8 }}
                  className="  w-8 h-8  flex items-center justify-center rounded-md overflow-hidden   "
                >
                  <Image
                    className="w-[20px]  h-[18px]"
                    source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
                  />
                </TouchableOpacity>
              </View>
              <Ad />
              <ProductCards events={events} reload={getProducts} />
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
    </PurpleGradient>
  );
}
