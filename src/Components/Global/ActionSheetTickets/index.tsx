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
import { getAPI } from '../../../utils/api';

interface Props {
  id: string;
  navigate: () => void;
  productSell?: boolean;
  sell?: boolean;
  sellLink?: string;
}

export const TicketSheet = forwardRef<ActionSheetRef, Props>((props, ref) => {
  const { cart, add, isEditingCustomerCart } = useCart();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [ticketSlotId, setTicketSlotId] = useState<string>('');
  const [tickets, setTickets] = useState<any>([]);
  async function getEventTickets() {
    // setLoading(true);
    const GetTickets = await getAPI(`/event/${props.id}/ticketSlot/current`);
    if (GetTickets.status === 200) {
      setTickets(GetTickets.body);
      setTicketSlotId(GetTickets.body.ticketSlot.id);

      return setLoading(false);
    } else {
    }
    // }
  }

  useEffect(() => {
    getEventTickets();
  }, []);
  const handleChange = (type: string, ticket: { name: string; price: number; id: string }) => {
    const exists = cart.tickets.find((item: { ticketId: string }) => item.ticketId === ticket.id);
    const tickets = cart.tickets.filter(
      (item: { ticketId: string }) => item.ticketId !== ticket.id
    );

    if (type === 'increase') {
      const quantity = exists ? exists.quantity + 1 : 1;

      return add(
        [...tickets, { ...ticket, ticketId: ticket.id, slotId: ticketSlotId, quantity }],
        'ticket'
      );
    }
    if (type === 'decrease' && exists && exists.quantity > 1) {
      const quantity = exists.quantity - 1;
      return add(
        [...tickets, { ...ticket, ticketId: ticket.id, slotId: ticketSlotId, quantity }],
        'ticket'
      );
    } else {
      return add(tickets, 'ticket');
    }
  };

  function ticketQuantity(id: string) {
    if (!cart) return 0;
    const ticketExists = cart?.tickets.find(
      (ticket: { ticketId: string }) => ticket.ticketId === id
    );
    return ticketExists ? ticketExists.quantity : 0;
  }
  const [itemsToShow, setItemsToShow] = useState(1);
  useEffect(() => {
    // Primeiro, verifica se props e props.ticket não são nulos

    if (
      tickets &&
      tickets.ticketSlot &&
      tickets.ticketSlot.tickets &&
      Array.isArray(tickets.ticketSlot.tickets)
    ) {
      const length = tickets.ticketSlot.tickets.length;
      if (length) {
        setItemsToShow(length);
      }
    }
  }, [tickets]);
  const formatPrice = (value: any) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  const handleNavigate = () => {
    setTimeout(() => {
      navigation.navigate('EventProducts', {
        product: props.product,
      });
    }, 500);
  };
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
          className={`rounded-t-3xl -mb-8 overflow-hidden flex w-full ${
            itemsToShow >= 5
              ? 'h-[772px]'
              : itemsToShow === 4
                ? 'h-[772px]'
                : itemsToShow === 3
                  ? 'h-[692px]'
                  : itemsToShow === 2
                    ? 'h-[480px]'
                    : itemsToShow === 1
                      ? 'h-[382px]'
                      : 'h-[362px]'
          }`}
        >
          <View className=" h-full ">
            <ScrollViewGradient>
              <View className="w-20 h-1 bg-white self-center rounded-full mt-5 " />

              <View className=" flex relative flex-row items-center p-5 self-center ">
                {tickets?.ticketSlot && tickets?.ticketSlot.name && (
                  <>
                    <Image
                      className="w-7 h-7 -ml-2 absolute"
                      source={require('../../../../assets/Event/ticketIcon.png')}
                    />
                    <Text className="text-2xl ml-2 text-white font-poppinsBold">
                      {tickets?.ticketSlot && tickets?.ticketSlot.name}
                    </Text>
                  </>
                )}
              </View>

              <View className="w-40 h-2 bg-white overflow-hidden -mt-2 self-center rounded-lg">
                <View className="h-full w-1/3 rounded-r-full bg-[#8F01FF]" />
              </View>
              {!props.sell && props.sellLink ? (
                <>
                  <Text className="text-white text-center self-center max-w-[90%] font-poppinsRegular mt-20">
                    Este evento tem venda externa de ingressos
                  </Text>
                  <Text className="text-white text-center self-center max-w-[90%] mb-10 font-poppinsRegular ">
                    Ao prosseguir, você será redirecionado.
                  </Text>
                </>
              ) : (
                <>
                  {!tickets?.ticketSlot?.tickets?.length && (
                    <>
                      <Text className="text-white text-center self-center mb-10 font-poppinsRegular mt-20">
                        Esse evento não possui Ingressos 😔
                      </Text>
                    </>
                  )}
                </>
              )}

              <View className="w-full p-4 gap-y-3 ">
                {/* {tickets.ticketSlot && tickets.ticketSlot.length < 6 ? ( */}
                {tickets &&
                tickets.ticketSlot &&
                Array.isArray(tickets.ticketSlot.tickets) &&
                tickets.ticketSlot.tickets.length < 6 ? (
                  tickets.ticketSlot.tickets.map((item, index) => (
                    <View
                      key={index}
                      className="w-full rounded-xl  h-24 border-2 overflow-hidden flex flex-row items-center border-white"
                    >
                      {ticketQuantity(item.id) !== 0 && (
                        <Animated.View
                          className="absolute w-full h-full"
                          entering={FadeIn.duration(300).easing(Easing.linear)}
                          exiting={FadeOut.duration(300).easing(Easing.linear)}
                        >
                          <LinearGradient
                            className="w-full h-full"
                            colors={['#8F00FF', '#DD7CFF']}
                            start={{ x: 0, y: 0 }} // Começa no topo esquerdo
                            end={{ x: 1, y: 1 }}
                            style={{
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              top: 0,
                              bottom: 0,
                            }} // Faz o gradiente cobrir totalmente o componente
                          />
                        </Animated.View>
                      )}

                      <Image
                        className="w-10 h-10 ml-2"
                        source={require('../../../../assets/Global/Icons/ticketsHDIcon.png')}
                      />
                      <View className="flex flex-col justify-center ml-3">
                        <Text
                          numberOfLines={3}
                          className="text-[16px] font-poppinsBold text-white w-[165px]"
                        >
                          {item.name}
                        </Text>
                        <Text className="text-[14px] self-start font-poppinsRegular text-white">
                          {formatPrice(item.price)}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <TouchableOpacity onPress={() => handleChange('decrease', item)}>
                          {ticketQuantity(item.id) !== 0 ? (
                            <Image
                              className="w-8 mr-1 h-8"
                              source={require('../../../../assets/Global/rmvTicket.png')}
                            />
                          ) : (
                            <Image
                              className="w-8 mr-1 h-8"
                              source={require('../../../../assets/Global/rmvTicketWhite.png')}
                            />
                          )}
                        </TouchableOpacity>
                        <View className="h-10 items-center justify-center w-12 bg-white border-2 rounded-lg border-[#8F00FF]">
                          {isEditingCustomerCart ? (
                            <ActivityIndicator color="#8F00FF" size={'small'} />
                          ) : (
                            <Text className="text-[21px] text-[#8F00FF] font-poppinsBold">
                              {ticketQuantity(item.id)}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleChange('increase', item)}
                          disabled={isEditingCustomerCart}
                        >
                          {ticketQuantity(item.id) !== 0 ? (
                            <Image
                              className="w-8 h-8 ml-1"
                              source={require('../../../../assets/Global/addTicket.png')}
                            />
                          ) : (
                            <Image
                              className="w-8 h-8 ml-1"
                              source={require('../../../../assets/Global/addTicketWhite.png')}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <>
                    {tickets && tickets.ticketSlot && Array.isArray(tickets.ticketSlot.tickets) && (
                      <View className="h-[530px] ">
                        <FlatList
                          data={tickets.ticketSlot.tickets}
                          showsVerticalScrollIndicator={false}
                          renderItem={({ item }) => {
                            return (
                              <View className="w-full rounded-xl mb-2 h-24 border-2  overflow-hidden flex flex-row items-center border-white">
                                {ticketQuantity(item.id) !== 0 && (
                                  <Animated.View
                                    className="absolute w-full h-full"
                                    entering={FadeIn.duration(300).easing(Easing.linear)}
                                    exiting={FadeOut.duration(300).easing(Easing.linear)}
                                  >
                                    <LinearGradient
                                      className="w-full h-full"
                                      colors={['#8F00FF', '#DD7CFF']}
                                      start={{ x: 0, y: 0 }} // Começa no topo esquerdo
                                      end={{ x: 1, y: 1 }}
                                      style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                      }} // Faz o gradiente cobrir totalmente o componente
                                    />
                                  </Animated.View>
                                )}
                                <View className="flex w-full h-full flex-row items-center z-90">
                                  <Image
                                    className="w-10 h-10 ml-2"
                                    source={require('../../../../assets/Global/Icons/ticketsHDIcon.png')}
                                  />
                                  <View className="flex flex-col justify-center ml-3">
                                    <Text className="text-[18px] font-poppinsBold text-white w-[165px]">
                                      {item.name}
                                    </Text>
                                    <Text className="text-[14px] self-start font-poppinsRegular text-white">
                                      {formatPrice(item.price)}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row items-center">
                                    <TouchableOpacity
                                      onPress={() => handleChange('decrease', item)}
                                    >
                                      {ticketQuantity(item.id) !== 0 ? (
                                        <Image
                                          className="w-8 mr-1 h-8"
                                          source={require('../../../../assets/Global/rmvTicket.png')}
                                        />
                                      ) : (
                                        <Image
                                          className="w-8 mr-1 h-8"
                                          source={require('../../../../assets/Global/rmvTicketWhite.png')}
                                        />
                                      )}
                                    </TouchableOpacity>
                                    <View className="h-10 items-center justify-center w-12 bg-white border-2 rounded-lg border-[#8F00FF]">
                                      <Text className="text-[21px] text-[#8F00FF] font-poppinsBold">
                                        {ticketQuantity(item.id)}
                                      </Text>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => handleChange('increase', item)}
                                    >
                                      {ticketQuantity(item.id) === 0 ? (
                                        <Image
                                          className="w-8 h-8 ml-1"
                                          source={require('../../../../assets/Global/addTicket.png')}
                                        />
                                      ) : (
                                        <Image
                                          className="w-8 h-8 ml-1"
                                          source={require('../../../../assets/Global/addTicketWhite.png')}
                                        />
                                      )}
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          }}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
              <View
                className={`w-full p-4 ${!props.sell || !props.productSell ? 'justify-center' : 'justify-between'}  items-center mb-5 flex flex-row `}
              >
                {props.sell && props.productSell && (
                  <TouchableOpacity
                    onPress={props.navigate}
                    className=" w-[160px] h-14 bg-[#6B1DA5]/30 overflow-hidden border-[#6B1DA5] border-2 rounded-2xl flex flex-row items-center justify-center"
                  >
                    <View className=" w-full h-full bg-[#6B1DA5] opacity-50 absolute" />
                    {/* <BlurView
                  intensity={10}
                  tint="light"
                  className="w-full h-full absolute opacity-10 "
                /> */}
                    <Image
                      className="w-[22px] h-5 mr-4"
                      source={require('../../../../assets/Event/backPack.png')}
                    />
                    <Text className="text-[16px] text-white font-poppinsSemiBold w-[60%] ">
                      Adquirir só Produtos
                    </Text>
                  </TouchableOpacity>
                )}
                {cart.tickets.length === 0 && props.sell && !props.productSell ? (
                  <TouchableOpacity
                    onPress={() => Alert.alert('Adicione um ingresso ao carrinho para continuar')}
                    className=" w-44 h-14 bg-white/40 border-2 border-white rounded-2xl flex flex-row items-center justify-center"
                  >
                    <Image
                      className="w-8 h-8 left-1 absolute "
                      source={require('../../../../assets/Global/Icons/purpleTicketIcon.png')}
                    />
                    <Text className="text-[18px] ml-3 self-center text-[#450A88] font-poppinsSemiBold mt-1 ">
                      Continuar
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={props.navigate}
                    className=" w-44 h-14 bg-white/40 border-2 border-white rounded-2xl flex flex-row items-center justify-center"
                  >
                    <Image
                      className="w-8 h-8 left-1 absolute "
                      source={require('../../../../assets/Global/Icons/purpleTicketIcon.png')}
                    />
                    <Text className="text-[18px] ml-3 self-center text-[#450A88] font-poppinsSemiBold mt-1 ">
                      Continuar
                    </Text>
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

export default TicketSheet;
