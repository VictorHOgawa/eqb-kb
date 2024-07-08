import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { FlatList } from 'react-native-gesture-handler';
import TicketGradient from '../../Components/Global/LinearGradientView/LinearGradientTicket';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/cart';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MotiView } from 'moti';

import { BlurView } from 'expo-blur';
import Animated, {
  Layout,
  SlideInRight,
  FadeIn,
  withSpring,
  SlideOutRight,
  SequencedTransition,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { getAPI } from '../../utils/api';
import { set } from 'react-hook-form';

export default function EventProducts() {
  const route = useRoute();
  const { productId } = route.params as { productId: any };
  const [filteredProduct, setFilteredProduct] = useState<any>([]);
  const { cart, add, isEditingCustomerCart } = useCart();
  const [product, setProduct] = useState<any>([]);
  const [moreProducts, setMoreProducts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  function handleSelectType(type: string) {
    setFilteredProduct(product.filter((item: any) => item.type === type));
    setType(type);
  }
  async function getProducts() {
    const connect = await getAPI(`/event/${productId}/product/current`);
    if (connect.status !== 200) {
      setLoading(false);
    }
    setProduct(connect.body.products);

    return setLoading(false);
  }
  useEffect(() => {
    getProducts();
  }, [productId]);

  const handleChange = (type: string, product: { name: string; price: number; id: string }) => {
    const exists = cart.products.find(
      (item: { productId: string }) => item.productId === product.id
    );
    const products = cart.products.filter(
      (item: { productId: string }) => item.productId !== product.id
    );
    if (type === 'increase') {
      const quantity = exists ? exists.quantity + 1 : 1;

      return add([...products, { ...product, productId: product.id, quantity }], 'product');
    }
    if (type === 'decrease' && exists && exists.quantity > 1) {
      const quantity = exists.quantity - 1;
      return add([...products, { ...product, productId: product.id, quantity }], 'product');
    } else {
      return add(products, 'product');
    }
  };

  function productQuantity(id: string) {
    const productExists = cart.products.find(
      (product: { productId: string }) => product.productId === id
    );
    return productExists ? productExists.quantity : 0;
  }

  function handleTitle(type: string) {
    switch (type) {
      case 'COMBO':
        return 'Combo';

      case 'VODKA':
        return 'Vodka';

      case 'WHISKEY':
        return 'Whiskey';

      case 'BEER':
        return 'Cerveja';

      case 'ENERGÉTICOS':
        return 'Energéticos';

      case 'OUTROS':
        return 'Outros';
      default:
        '';
    }
  }
  const navigation = useNavigation<any>();
  const formatPrice = (value: any) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  const [type, setType] = useState<any>(null);

  const handleSetType = (selectedType: any) => {
    if (type === selectedType) {
      setType(null); // Remove filter if the same type is clicked again
    } else {
      setType(selectedType);
    }
  };

  const filteredProducts = type ? product.filter((item) => item.category === type) : product;

  const customSpringAnimation = {
    layout: {
      // Usando withSpring para uma animação mais natural
      animation: withSpring({
        damping: 20,
        stiffness: 90,
        mass: 0.5,
      }),
      config: {},
    },
  };
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(filteredProducts.length * 96, {
      duration: 500,
    });
  }, [filteredProducts]);

  // Estilo animado para a view externa
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });
  const handleGoToCheckout = () => {
    if (cart.products.length === 0 && cart.tickets.length === 0) {
      Alert.alert('Adicione produtos ou ingressos ao carrinho para prosseguir');
    } else {
      navigation.navigate('Checkout');
    }
  };
  return (
    <PurpleGradient>
      <View className="w-full p-2 absolute bottom-5 z-20 justify-between mb-0 flex flex-col ">
        <View className=" flex w-full justify-between flex-row ">
          <TouchableOpacity
            disabled={isEditingCustomerCart}
            onPress={() => handleGoToCheckout()}
            className={` w-44 ${isEditingCustomerCart ? 'opacity-75' : 'opacity-100'} h-14 bg-[#6B1DA5]/90 relative overflow-hidden border-[#6B1DA5] border-2 rounded-2xl flex flex-row items-center justify-center`}
          >
            <View className=" w-full h-full bg-[#6B1DA5] opacity-50 absolute" />
            <BlurView intensity={10} tint="light" className="w-full h-full absolute opacity-10 " />
            <Image
              className="w-[22px] h-5 mr-2"
              source={require('../../../assets/Event/backPack.png')}
            />
            <Text className="text-[14px] text-white font-poppinsSemiBold w-[60%] ">
              Continuar sem Bebidas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleGoToCheckout()}
            disabled={isEditingCustomerCart}
            className={`${isEditingCustomerCart ? 'opacity-75' : 'opacity-100'} w-44 h-14 bg-[#447f34]/95 border-2 border-[#75FB4C] rounded-2xl flex flex-row items-center justify-center`}
          >
            <Image
              className="w-7 h-7  left-2 absolute mr-1"
              source={require('../../../assets/Global/Icons/finishEventProducts.png')}
            />
            <Text className="text-[18px] ml-2 mt-1 self-center text-white font-poppinsBold">
              Finalizar
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="w-[80vw] bg-[#b5afaf]/90 border-[1px] border-white self-center rounded-xl h-10 mt-2 flex flex-row items-center p-2">
          <Image
            className="w-6 h-6  mr-2"
            source={require('../../../assets/Global/Icons/warning.png')}
          />
          <Text className="text-white font-poppinsBold mt-1 text-[11px]">
            {' '}
            Entenda como funciona a Compra de Bebidas
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 ">
        <Animated.View entering={FadeIn.duration(1000).delay(200)}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ zIndex: 8 }}
            className="  w-8 h-8 absolute flex items-center justify-center rounded-md top-10 overflow-hidden   left-5"
          >
            <Image
              className="w-[20px]  h-[18px]"
              source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
            />
          </TouchableOpacity>
          <View className=" flex relative mt-4 flex-row items-center p-5 self-center ">
            <Image
              className="w-7 h-7 -ml-2 absolute"
              source={require('../../../assets/Event/bottles.png')}
            />
            <Text className="text-2xl ml-2 text-white font-poppinsBold">Bebidas da Night</Text>
          </View>
          <View className="w-40 h-2 bg-white overflow-hidden -mt-2 self-center rounded-lg">
            <View className="h-full w-2/3 rounded-r-full bg-[#8F01FF]" />
          </View>
          <View className="p-4 w-[390px] self-center flex items-center ">
            <View className=" flex flex-row items-center rounded-md ">
              <TouchableOpacity
                onPress={() => handleSetType('combo')}
                className={` text-white w-full h-28  bg-white rounded-md overflow-hidden ${
                  type === 'combo' || type === null ? 'opacity-100' : 'opacity-70'
                } `}
              >
                <Image
                  className="absolute w-full h-full "
                  source={require('../../../assets/EventProducts/combos.png')}
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row h-44 pt-3 rounded-md w-full  ">
              <TouchableOpacity
                onPress={() => handleSetType('whiskey')}
                className={` h-full  mr-2 w-32 ${
                  type === 'whiskey' || type === null ? 'opacity-100' : 'opacity-70'
                }   bg-white rounded-md overflow-hidden `}
              >
                <Image
                  className="absolute w-full h-full "
                  source={require('../../../assets/EventProducts/whiskies.png')}
                />
              </TouchableOpacity>
              <View className=" flex flex-col w-[63%] gap-b-2 justify-between ">
                <TouchableOpacity
                  onPress={() => handleSetType('beer')}
                  className={` w-full h-20  ${
                    type === 'beer' || type === null ? 'opacity-100' : 'opacity-70'
                  }   bg-white rounded-md overflow-hidden`}
                >
                  <Image
                    className="absolute w-full h-full "
                    source={require('../../../assets/EventProducts/cerceja.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSetType('others')}
                  className={` w-full h-20  ${
                    type === 'others' || type === null ? 'opacity-100' : 'opacity-70'
                  }   bg-white rounded-md overflow-hidden `}
                >
                  <Image
                    className="absolute w-full h-full "
                    source={require('../../../assets/EventProducts/outros.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="w-full pr-4 mb-2 flex flex-row items-center justify-between">
            <Text className="text-white text-[18px] font-poppinsBold ml-4">
              {(() => {
                switch (type) {
                  case 'combo':
                    return 'Combos e Promoções';
                  case 'whiskey':
                    return 'Whiskies';
                  case 'beer':
                    return 'Cervejas';
                  case 'others':
                    return 'Outros Produtos';
                  default:
                    return 'Todos os Produtos';
                }
              })()}
            </Text>
            <TouchableOpacity
              className={`bg-white w-24 h-8 rounded-md flex items-center justify-center ${type === null && 'opacity-80'}`}
              onPress={() => setType(null)}
              disabled={type === null}
            >
              <View className=" flex flex-row items-center justify-center w-full">
                <Image
                  className="w-4 h-4 absolute left-1 "
                  source={require('../../../assets/Global/Icons/allButtonIcon.png')}
                />
                <Text className="text-[12px] ml-2  text-primary_100 font-poppinsBold">
                  Ver Todos
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {filteredProducts.length === 0 ? (
            <Text className=" text-primary_100 z-[1000] mt-10 p-5 self-center font-poppinsRegular text-lg">
              Produtos indisponíveis no momento.
            </Text>
          ) : (
            <Animated.View
              style={[animatedStyle]}
              className=" w-full gap-y-4 mb-5 px-4 flex flex-col items-center"
            >
              {filteredProducts.map((item: any) => (
                <Animated.View
                  entering={SlideInRight}
                  exiting={SlideOutRight}
                  layout={SequencedTransition.duration(500)} // Usando animações de layout com withSpring
                  key={item.id}
                  className="w-full rounded-xl  h-20 border-2 overflow-hidden flex flex-row items-center border-white"
                >
                  {productQuantity(item.id) !== 0 && <TicketGradient />}

                  <Image
                    className="w-20 rounded-r-2xl bg-white h-20 object-cover "
                    source={{ uri: item.image }}
                  />
                  <View className="flex flex-col justify-center ml-3">
                    <Text className="text-[12px] font-poppinsBold text-white w-[135px]">
                      {item.name}
                    </Text>
                    <Text className="text-[12px] self-start -mt-1  font-poppinsRegular text-white">
                      {formatPrice(item.price)}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <TouchableOpacity
                      disabled={isEditingCustomerCart}
                      onPress={() => handleChange('decrease', item)}
                    >
                      {productQuantity(item.id) !== 0 ? (
                        <Image
                          className="w-8 mr-1 h-8"
                          source={require('../../../assets/Global/rmvTicket.png')}
                        />
                      ) : (
                        <Image
                          className="w-8 mr-1 h-8"
                          source={require('../../../assets/Global/rmvTicketWhite.png')}
                        />
                      )}
                    </TouchableOpacity>
                    <View className="h-10 items-center justify-center w-12 bg-white border-2 rounded-lg border-[#8F00FF]">
                      {isEditingCustomerCart ? (
                        <ActivityIndicator color="#8F00FF" />
                      ) : (
                        <Text className="text-[21px] text-[#8F00FF] font-poppinsBold">
                          {productQuantity(item.id)}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleChange('increase', item)}
                      disabled={isEditingCustomerCart}
                    >
                      {productQuantity(item.id) !== 0 ? (
                        <Image
                          className="w-8 h-8 ml-1"
                          source={require('../../../assets/Global/addTicket.png')}
                        />
                      ) : (
                        <Image
                          className="w-8 h-8 ml-1"
                          source={require('../../../assets/Global/addTicketWhite.png')}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          )}
          <View className="h-20" />
        </Animated.View>
        <View className="h-20" />
      </ScrollView>
    </PurpleGradient>
  );
}
