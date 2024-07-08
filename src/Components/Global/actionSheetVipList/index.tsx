import React, { RefAttributes, forwardRef, useEffect, useState } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import Theme from '../../../styles/themes';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import ScrollViewGradient from '../LinearGradientView/LinearGradient';
import { Text } from 'react-native';
import { Image } from 'react-native';
import TicketGradient from '../LinearGradientView/LinearGradientTicket';
import { useCart } from '../../../context/cart';
import { FlatList } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthPostAPI, getAPI } from '../../../utils/api';

interface Props {
  id: string;
  navigate: () => void;
}

export const VipListSheet = forwardRef<ActionSheetRef, Props>((props, ref) => {
  const { cart, add, isEditingCustomerCart } = useCart();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [ticketSlotId, setTicketSlotId] = useState<string>('');
  const [vipList, setVipList] = useState<any>('');
  async function getVipList() {
    // setLoading(true);
    const GetList = await getAPI(`/event/${props.id}/VipList/current`);
    if (GetList.status === 200) {
      setVipList(GetList.body.VipList.id);
      return setLoading(false);
    } else {
      return setVipList('');
    }
  }

  useEffect(() => {
    getVipList();
  }, []);

  const handleNavigate = () => {
    setTimeout(() => {
      navigation.navigate('EventProducts', {
        product: props.product,
      });
    }, 500);
  };
  async function RegisterVipList() {
    setLoading(true);
    const RegisterList = await AuthPostAPI(`customer/vipList/${vipList}`, {});
    if (RegisterList.status === 200) {
      Alert.alert(
        'Sucesso',
        'Você entrou na lista VIP! um ingresso foi adicionado em sua Carteira Night',
        [{ text: 'OK', onPress: () => navigation.navigate('Purchased') }]
      );
      return setLoading(false);
    } else {
      Alert.alert('Ops', 'A lista VIP esta indisponível no momento tente novamente mais tarde');
      setLoading(false);
    }
  }

  return (
    <ActionSheet
      ref={ref}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'transparent',
        //   backgroundColor: "#230743",
      }}
      indicatorStyle={{
        width: 100,
      }}
      gestureEnabled={true}
    >
      <View className="w-full  -mt-3 rounded-3xl">
        <Image
          source={require('../../../../assets/Match/teste4.png')}
          className=" absolute -z-[1] self-center  w-screen h-12   rounded-xl -mt-[6px] "
        />
        <View
          className={`rounded-t-3xl -mb-8  h-[400px] overflow-hidden flex w-full 
           `}
        >
          <View className=" h-full ">
            <ScrollViewGradient>
              <View className="w-20 h-1 bg-white self-center rounded-full mt-5 " />

              <View className=" flex relative flex-row items-center p-5 self-center ">
                <>
                  <Image
                    className="w-20 h-20 -ml-14  absolute"
                    source={require('../../../../assets/Event/vipList.png')}
                  />
                  <Text className="text-2xl ml-2 text-white font-poppinsBold">Lista VIP</Text>
                </>
              </View>
              <View className="w-[85%] flex self-center flex-col">
                {vipList ? (
                  <>
                    <Text className="text-white font-poppinsRegular text-[16px] text-center mb-16">
                      Pronto para uma noite inesquecível? Entre na nossa lista VIP e garanta seu
                      acesso exclusivo!
                    </Text>
                    <Text className="text-white font-poppinsRegular text-md">
                      Confirme sua presença e prepare-se para a Night
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-white text-lg font-poppinsRegular text-center mb-16">
                      A lista VIP esta fechada, mas a Night ainda promete ser incrível!
                    </Text>
                    <Text className="text-white font-poppinsRegular text-[11px]">
                      Adquira seu ingresso e não perca uma noite espetacular
                    </Text>
                  </>
                )}
              </View>
              <View className="w-full p-4 justify-between mb-5 flex flex-row ">
                <TouchableOpacity
                  onPress={() => ref.current?.hide()}
                  className=" w-[160px] h-14 bg-[#6B1DA5]/30 overflow-hidden border-[#6B1DA5] border-2 rounded-2xl flex flex-row items-center justify-center"
                >
                  <View className=" w-full h-full bg-[#6B1DA5] opacity-50 absolute" />
                  {/* <BlurView
                  intensity={10}
                  tint="light"
                  className="w-full h-full absolute opacity-10 "
                /> */}
                  <Image
                    className="w-[22px] absolute h-5 left-2"
                    source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                  />
                  <Text className="text-[16px] text-white self-center mt-1 font-poppinsBold  ">
                    Voltar
                  </Text>
                </TouchableOpacity>
                {vipList ? (
                  <TouchableOpacity
                    onPress={() => RegisterVipList()}
                    disabled={loading}
                    className=" w-44 h-14 bg-[#D356F3]/60 border border-white rounded-2xl flex flex-row items-center justify-center"
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Image
                          className="w-[23px] h-5 left-1 absolute "
                          source={require('../../../../assets/Global/Icons/yellowDiamondFill.png')}
                        />
                        <Text className="text-[18px] ml-3 self-center text-white font-poppinsBold">
                          Confirmar Presença
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={props.navigate}
                    className=" w-44 h-14 bg-[#D356F3]/60 border border-white rounded-2xl flex flex-row items-center justify-center"
                  >
                    <>
                      <Image
                        className="w-[21px] h-5 left-1 absolute "
                        source={require('../../../../assets/Global/Icons/ticketsHDIcon.png')}
                      />
                      <Text className="text-[16px] ml-3 self-center text-white font-poppins font-poppinsBold">
                        Adquirir Ingresso
                      </Text>
                    </>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollViewGradient>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
});

export default VipListSheet;
