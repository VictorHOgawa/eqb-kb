import { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useCart } from '../../../../context/cart';
import Theme from '../../../../styles/themes';
import { AuthPostAPI } from '../../../../utils/api';
import { HorizontalView } from '../../../Global/View/HorizontalView';
import { FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';
import { VerticalView } from '../../../Global/View/VerticalView';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { Text, View } from 'react-native';
import { Image } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TotalProps {
  selected: string;
  total: any;
  loading: boolean;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export function Total({ selected, total, loading }: TotalProps) {
  const [seeAll, setSeeAll] = useState(false);
  const [isShowingTaxes, setIsShowingTaxes] = useState(false);

  const animateExpansion = () => {
    LayoutAnimation.configureNext({
      duration: 500, // Duração da animação em milissegundos
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0.7, // Ajuste este valor para menos rigidez
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    // Altera o estado que controla a visibilidade dos detalhes
    setSeeAll(!seeAll);
  };

  return (
    <Animated.View className="bg-secondary_100 border border-[#D356F3] mt-32 rounded-2xl text-white w-[85%] self-center mb-4 flex items-center p-1">
      {loading ? (
        <></>
      ) : (
        <>
          {!seeAll ? (
            <></>
          ) : (
            <>
              {total.tickets.length !== 0 && (
                <>
                  <View className="w-full ">
                    <View className="flex flex-row mt-5  ml-1.5 -mb-2 items-center">
                      <View className="h-4 w-1.5 rounded-sm -mt-2 bg-primary_100" />
                      <Text className="text-white font-poppinsBold "> Ingressos</Text>
                    </View>
                  </View>
                  <FlatList
                    className="w-[95%]"
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={total.tickets}
                    renderItem={({ item, index }) => (
                      <>
                        {item.length === 0 ? (
                          <></>
                        ) : (
                          <>
                            <View
                              className={`${index !== total.tickets.length - 1 ? 'border-b' : ''} flex flex-row w-[100%] justify-between border-b-primary_100/70 p-1 mt-0.5`}
                            >
                              <View className="w-full   flex justify-between items-center flex-row">
                                <View className="flex flex-row w-[68%] ">
                                  <Text className="text-white font-poppinsRegular ">
                                    x{item.quantity} {'-'} {''}
                                    {item.name}
                                  </Text>
                                </View>
                                <View className="flex flex-row">
                                  <Text className="text-white font-poppinsRegular">
                                    {item.price.toLocaleString('pt-br', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    })}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </>
                        )}
                      </>
                    )}
                  />
                </>
              )}
              {total.products.length !== 0 && (
                <>
                  <View className="w-full">
                    <View className="flex flex-row mt-2  ml-1.5 -mb-2 items-center">
                      <View className="h-4 w-1.5 rounded-sm -mt-2 bg-primary_100" />
                      <Text className="text-white font-poppinsBold "> Produtos</Text>
                    </View>
                  </View>
                  <FlatList
                    className="w-[95%]"
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={total.products}
                    renderItem={({ item, index }) => (
                      <>
                        {item.length === 0 ? (
                          <></>
                        ) : (
                          <>
                            <View
                              className={`${index !== total.tickets.length - 1 ? 'border-b' : ''} flex flex-row w-[100%] self-center justify-between items-center border-b-primary_100/70 p-1 mt-0.5`}
                            >
                              <View className="flex flex-col w-[68%] mr-1 ">
                                <Text className="text-white  font-poppinsRegular">
                                  x{item.quantity} {'-'} {''}
                                  {item.name}
                                </Text>
                              </View>
                              <View className="flex flex-col ">
                                <Text className="text-white font-poppinsRegular">
                                  {item.price.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}
                      </>
                    )}
                  />
                </>
              )}
              {total.discount !== 0 && total.coupon && (
                <>
                  <View className=" flex flex-row w-[95%] justify-between border-b-[#F4F7FB] pb-1 mt-0.5">
                    <View className="flex flex-row mt-0  -mb-2 items-center">
                      <View className="h-4 w-1.5 rounded-sm -mt-2 bg-primary_100" />
                      <Text className="text-white font-poppinsBold "> Descontos de Cupon</Text>
                    </View>
                  </View>
                  <View className="border-b flex flex-row w-[95%] justify-between border-b-[#F4F7FB] pb-1 ">
                    <View className="flex flex-row mt-0 w-[70%]  items-center">
                      <Text className="text-white font-poppinsRegular"> {total.coupon}</Text>
                    </View>
                    <Text className="text-green-500 font-poppinsRegular">
                      {total.coupon.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                </>
              )}
              {total.pixDiscount !== 0 && selected === 'Pix' && total.pixDiscount && (
                <Animated.View
                  entering={FadeIn.duration(600)}
                  className=" flex flex-row w-[95%] justify-between border-b-[#F4F7FB] pb-1 mt-0.5"
                >
                  <View className="flex flex-row mt-0  -mb-2 items-center">
                    <View className="h-4 w-1.5 rounded-sm -mt-2 bg-primary_100" />
                    <Text className="text-white font-poppinsBold "> Desconto Night</Text>
                  </View>
                  <Text></Text>
                  <Text className="text-green-500 font-poppinsRegular">
                    {total.pixDiscount.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Text>
                </Animated.View>
              )}
              <View className=" flex flex-row w-[95%]  justify-between border-b-[#F4F7FB] p-1 mt-1">
                <Text className="text-gray-300 text-[12px] font-poppinsRegular ">
                  Impostos, Taxas e Outros{' '}
                </Text>
                <TouchableOpacity onPress={() => setIsShowingTaxes(!isShowingTaxes)}>
                  {isShowingTaxes ? (
                    <Text className="text-white font-poppinsRegular ">
                      {total.taxValue.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  ) : (
                    <Ionicons
                      className="text-lg"
                      size={18}
                      color={Theme.color.gray_20}
                      name="eye"
                    />
                  )}
                </TouchableOpacity>
              </View>

              {total.discount !== 0 && (
                <View className="border-b flex flex-row w-[95%] justify-between border-b-[#F4F7FB] p-1 mt-0.5">
                  <HorizontalView
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <VerticalView>
                      <Text>Descontos</Text>
                    </VerticalView>
                    <VerticalView></VerticalView>
                    <VerticalView>
                      <Text style={{ color: Theme.color.green_50 }}>
                        {total.discount.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </Text>
                    </VerticalView>
                  </HorizontalView>
                </View>
              )}
            </>
          )}
          <View className="border border-[#D356F3] w-[90%] rounded-md py-2 mt-2 px-1 ">
            <HorizontalView
              style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <VerticalView>
                <Text className="text-white font-poppinsBold">Total</Text>
              </VerticalView>
              {selected === 'Pix' ? (
                <>
                  {total.discount !== 0 ||
                    (total.pixDiscount !== 0 && total.total && (
                      <VerticalView>
                        <Animated.Text
                          entering={FadeIn.duration(500)}
                          className="text-white line-through font-poppinsBold"
                        >
                          {total.total.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </Animated.Text>
                      </VerticalView>
                    ))}
                  <View>
                    <Animated.Text
                      entering={FadeIn.duration(500)}
                      className={`${total.discount !== 0 || total.pixDiscount !== 0 ? 'text-green-500' : 'text-white'} font-poppinsBold`}
                    >
                      {total.pixValue &&
                        total.pixValue.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                    </Animated.Text>
                  </View>
                </>
              ) : (
                <>
                  {total.discount !== 0 && total.total && (
                    <VerticalView>
                      <Animated.Text
                        entering={FadeIn.duration(500)}
                        className="text-white line-through  font-poppinsBold"
                      >
                        {total.total.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </Animated.Text>
                    </VerticalView>
                  )}
                  <VerticalView style={{ justifyContent: ' flex-end' }}>
                    <Animated.Text
                      entering={FadeIn.duration(500)}
                      className={`${total.discount !== 0 ? 'text-green-500' : 'text-white'} font-poppinsBold`}
                    >
                      {total.creditValue &&
                        total.creditValue.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                    </Animated.Text>
                  </VerticalView>
                </>
              )}
            </HorizontalView>
          </View>
          <Text className="mt-2 underline text-white font-poppinsBold" onPress={animateExpansion}>
            Ver Detalhes
          </Text>
        </>
      )}
    </Animated.View>
  );
}
