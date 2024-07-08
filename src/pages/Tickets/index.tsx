import { ScrollView, View } from 'react-native';
import { Ad } from '../../Components/Global/Ad';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { TicketCards } from '../../Components/Pages/Tickets';
import { authGetAPI } from '../../utils/api';
import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Text } from 'react-native';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import HeaderBar from '../../Components/Global/headerBar';

export function Tickets() {
  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  async function getTickets() {
    setLoading(true);
    const connect = await authGetAPI('/customer/ticket');
    if (connect.status !== 200) {
      return setLoading(false);
    }
    setTickets(connect.body.eventTickets);
    return setLoading(false);
  }

  useEffect(() => {
    getTickets();
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
              <TicketCards tickets={tickets} reload={getTickets} />
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
    </PurpleGradient>
  );
}
