import { CommonActions, useNavigation } from '@react-navigation/native';

import { Installments } from './Installments';
import { NewCard } from './NewCard';

import { useEffect, useState } from 'react';
import { useCart } from '../../../../../context/cart';
import { AuthPostAPI, authGetAPI } from '../../../../../utils/api';
import { ActivityIndicator, Alert, ImageBackground, View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  CreditCardHolderValidation,
  CreditCardValidation,
} from '../../../../../utils/fieldValidation';

import { VerticalView } from '../../../../Global/View/VerticalView';

import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CardProps {
  coupon: string;
  setCoupon: any;
  setIsNewCard: (value: boolean) => void;
  AddCoupon: any;
  loadingCoupon: boolean;
  installment: any;
  setInstallment: any;
  isStepTwo: boolean;
  setIsStepTwo: any;
  installments: any;
  setInstallments: any;
  installmentCount: any;
  setCardsLength: (value: any) => void;
  setInstallmentCount: any;
  setIsStepTree: any;
}

export function CardMethod({
  coupon,
  setCoupon,
  setIsNewCard,
  AddCoupon,
  loadingCoupon,
  installment,
  setCardsLength,
  setInstallment,
  installments,
  setInstallments,
  isStepTwo,
  setIsStepTwo,
  setIsStepTree,
  installmentCount,
  setInstallmentCount,
}: CardProps) {
  const { cart, customerCartId, cleanCart } = useCart();
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState('');
  const [newCard, setNewCard] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepTree, setStepTree] = useState(false);
  const [installmentsBoolean, setInstallmentsBoolean] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const { control, handleSubmit } = useForm();
  const [existingCreditCards, setExistingCreditCards] = useState<any>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cards, setCards] = useState<any>([]);
  const [formData, setFormData] = useState({
    holderName: '',
    number: '',
    expiryDate: '',
    ccv: '',
    name: '',
    email: '',
    mobilePhone: '',
    cpfCnpj: '',
    postalCode: '',
    addressNumber: '',
  });
  function handleBack() {
    // Se estiver na terceira etapa, volta para a segunda.
    if (stepTree) {
      setStepTree(false);
      setStepTwo(true);
    }
    // Se estiver na segunda etapa e não for um novo cartão, volta para o início.
    else if (stepTwo && newCard) {
      setStepTwo(false);
    }
    // Se estiver na segunda etapa e for um novo cartão, volta para a primeira etapa.
    else if (stepTwo && !newCard) {
      setStepTwo(false);
      setNewCard(false);
    }
    // Se estiver na primeira etapa, apenas desativa newCard.
    else if (newCard) {
      setIsNewCard(false);
      setNewCard(false);
    }
  }
  useEffect(() => {
    if (newCard) {
      setIsNewCard(false);
    } else {
      setIsNewCard(true);
    }
  }, [newCard]);
  function handleNext() {
    // Trata os casos baseados na seleção do cartão.
    if (selected === 'new') {
      return alert('Selecione um Cartão');
    } else if (selected === 'New' && !newCard) {
      setNewCard(true);
    } else if (newCard && !stepTwo && CreditCardValidation(formData) === 'ok' && !stepTree) {
      setIsNewCard(false);
      setStepTwo(true);
    } else if (
      newCard &&
      stepTwo &&
      !stepTree
      // &&
      // CreditCardHolderValidation(formData) === "ok"
    ) {
      setStepTwo(false);
      setStepTree(true);
    } else if (newCard && stepTree) {
      setStepTree(true);
      sendNewCard(formData);
    } else {
      sendExistingCard();
    }
  }

  async function sendNewCard(formData: any) {
    const creditCard = {
      holderName: formData.holderName,
      number: formData.number,
      expiryMonth: formData.expiryDate.split('/')[0],
      expiryYear: formData.expiryDate.split('/')[1],
      ccv: formData.ccv,
    };

    const creditCardHolderInfo = {
      name: formData.name,
      email: formData.email,
      phone: formData.mobilePhone,
      cpfCnpj: formData.cpfCnpj,
      postalCode: formData.postalCode,
      addressNumber: formData.addressNumber,
    };
    setLoading(true);
    const connect = await AuthPostAPI(`/purchase/payment/creditCard/new/${customerCartId}`, {
      creditCard,
      creditCardHolderInfo,
      installmentCount,
    });
    if (connect.status !== 200) {
      Alert.alert('Erro', connect.body.message);
      return setLoading(false);
    }
    AsyncStorage.removeItem('cart');
    cleanCart();
    Alert.alert('Compra Efetuada com Sucesso!');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'AppRoutes',
            params: {
              screen: 'Purchased',
            },
          },
        ],
      })
    );
    return setLoading(false);
  }

  async function sendExistingCard() {
    setLoading(true);
    const connect = await AuthPostAPI(`/purchase/payment/creditCard/exists/${customerCartId}`, {
      creditCardId: selected,
      installmentCount,
    });
    setLoading(false);
    if (connect.status !== 200) {
      alert(connect.body.message);
      return setLoading(false);
    }
    AsyncStorage.removeItem('cart');
    cleanCart();
    Alert.alert('Compra Efetuada com Sucesso!');
    navigation.navigate('AppRoutes', {
      screen: 'Purchased',
      params: { screen: 'Purchased' },
    });
    return setLoading(false);
  }

  async function getCards() {
    setLoadingCards(true);
    const connect = await authGetAPI('/customer/creditCard');
    if (connect.status !== 200) {
      setCardsLength(connect.body.creditCard.length);
      return setLoadingCards(false);
    }

    if (connect.body.creditCard.length === 0) {
      setNewCard(true);
      return setLoadingCards(false);
    }
    setCards(connect.body.creditCard);
    setCardsLength(connect.body.creditCard.length);

    return setLoadingCards(false);
  }

  useEffect(() => {
    getCards();
  }, []);
  const width = useSharedValue(0); // Inicializa com 100 pixels.

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  // Atualiza a altura baseada na etapa.
  useEffect(() => {
    if (stepTree) {
      width.value = withSpring(140, { damping: 20, stiffness: 90 }); // Ajusta para 300 pixels suavemente.
    } else if (stepTwo) {
      width.value = withSpring(96, { damping: 20, stiffness: 90 }); // Ajusta para 200 pixels suavemente.
    } else {
      width.value = withSpring(33, { damping: 20, stiffness: 90 }); // Retorna para 100 pixels.
    }
  }, [stepTwo, stepTree]);
  const [validateCounter, setValidateCounter] = useState(0);

  const [allValid, setAllValid] = useState(true);
  const onValidationComplete = (isValid: boolean) => {
    if (isValid) {
      handleNext();
    } else {
    }
  };

  const validate = () => {
    setValidateCounter((prev) => prev + 1);
  };
  const useExistCard = (card: any) => {
    formData.number = card.creditCardNumber;
    formData.holderName = card.creditCardHolderName;
    formData.ccv = card.creditCardCvv;
    formData.expiryDate = card.creditCardExpirationDate;

    setSelected(card.id);
  };
  const handleUseCard = () => {
    if (selectedCard) {
      if (selectedCard === 'NewCard') {
        setFormData({
          ...formData,
          number: '',
          holderName: '',
          ccv: '',
          expiryDate: '',
        });
        setNewCard(true);
      } else {
        setFormData({
          ...formData,
          number: '**** **** **** ' + '' + selectedCard.creditCardNumber,
          holderName: '****** **** **** ****',
          ccv: '***',
          expiryDate: '**/**',
        });
        useExistCard(selectedCard);
      }
    }
  };
  return (
    <Animated.View
      className="flex-1"
      entering={FadeIn.duration(400).delay(200)}
      exiting={FadeOut.duration(200)}
    >
      <Text className="text-white text-lg font-poppinsRegularRegular mb-2 mt-5">
        {' '}
        2. Insira os dados do Cartão de Crédito{' '}
      </Text>
      {/* <View className=" overflow-hidden self-center w-40 h-2 bg-white rounded-full mb-2">
        <Animated.View
          style={[animatedStyles]}
          className="h-full  bg-[#8F01FF]"
        ></Animated.View>
      </View> */}
      <View className=" w-[295px] self-center itens-center justify-center  ">
        <ImageBackground
          className=" self-center items-center  justify-center w-[350px]  object-fill h-[168.5px] mb-4 rounded "
          source={require('../../../../../../assets/Checkout/card.png')}
        >
          <View className="w-full flex-row items-center justify-between pl-4 pr-6 mt-28 ">
            <VerticalView>
              <Text className=" z-[2] text-gray_10 font-poppinsRegular text-[10px]">
                Nome no Cartão
              </Text>
              <Text className=" z-[2] text-gray_10 w-[170px]  font-poppinsBold text-[14px] ">
                {formData.holderName}
              </Text>
            </VerticalView>
            <View className="flex flex-col -ml-4 ">
              <Text className=" z-[2] text-gray_10 text-[10px]   font-poppinsRegular">
                Validade
              </Text>
              <Text className=" z-[2] text-gray_10 text-[14px]  font-poppinsBold">
                {formData.expiryDate}
              </Text>
            </View>
            <VerticalView>
              <Text className=" z-[2] text-gray_10 text-[10px] font-poppinsRegular">CVV</Text>
              <Text className=" z-[2] text-gray_10 text-[14px]  font-poppinsBold">
                {formData.ccv}
              </Text>
            </VerticalView>
          </View>
        </ImageBackground>
      </View>
      {newCard ? (
        <>
          <NewCard
            stepTwo={stepTwo}
            stepTree={stepTree}
            validate={validateCounter}
            formData={formData}
            setFormData={setFormData}
            onValidationComplete={onValidationComplete}
            onUpdate={(updatedData: any) => setFormData(updatedData)}
          />
          {stepTree && (
            <Installments
              formData={formData}
              installmentCount={installmentCount}
              setInstallmentCount={setInstallmentCount}
              installment={installment}
              setInstallment={setInstallment}
              installments={installments}
              setInstallments={setInstallments}
              control={control}
            />
          )}
        </>
      ) : (
        <>
          {!cards ? (
            <View className="w-full flex items-center">
              <ActivityIndicator size="small" color="purple" />
            </View>
          ) : (
            <>
              {loadingCards ? (
                <>
                  {/* <NewCard
                    stepTwo={stepTwo}
                    formData={formData}
                    setFormData={setFormData}
                    onUpdate={(updatedData: any) => setFormData(updatedData)}
                  /> */}
                  <View className="w-full flex items-center">
                    <ActivityIndicator size="small" color="purple" />
                  </View>
                </>
              ) : selected === '' ? (
                <View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    className="w-full mt-4"
                    data={cards}
                    renderItem={({ item }: any) => (
                      <View className="rounded-lg w-[80%] mb-4 overflow-hidden self-center z-">
                        {selectedCard === item && (
                          <Animated.View
                            className="absolute w-full  h-full"
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
                        <TouchableOpacity
                          className={`${selectedCard === item ? 'bg-transparent' : 'bg-secondary_100'} rounded-lg w-[100%] flex flex-row border border-[#D356F3]  p-4 self-center justify-stat items-center`}
                          onPress={() => setSelectedCard(item)}
                        >
                          <>
                            {item.creditCardBrand === 'AMEX' ? (
                              <Image
                                className="h-5 w-5 rounded-md"
                                style={{ width: RFValue(35), marginLeft: '2%' }}
                                source={require('../../../../../../assets/Global/Icons/AECard.png')}
                              />
                            ) : item.creditCardBrand === 'MASTERCARD' ? (
                              <Image
                                className="h-5 w-5 rounded-md"
                                style={{ width: RFValue(35), marginLeft: '2%' }}
                                source={require('../../../../../../assets/Global/Icons/MasterCard.png')}
                              />
                            ) : item.creditCardBrand === 'VISA' ? (
                              <Image
                                className="h-5 w-5 rounded-md"
                                style={{ width: RFValue(35), marginLeft: '2%' }}
                                source={require('../../../../../../assets/Global/Icons/VisaCard.png')}
                              />
                            ) : (
                              <></>
                            )}
                            <Text className="text-white font-poppinsRegular ml-2">
                              {''} {item.creditCardBrand} **** - {item.creditCardNumber}
                            </Text>
                          </>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedCard('NewCard')}
                    className={`${selectedCard === 'NewCard' ? 'bg-transparent' : 'bg-secondary_100'}  rounded-lg   border border-[#D356F3] w-[80%] overflow-hidden self-center justify-stat  items-center`}
                  >
                    {selectedCard === 'NewCard' && (
                      <Animated.View
                        className="absolute w-full  h-full"
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
                    <View className="p-4">
                      <Text className="text-white font-poppinsRegular">Novo Cartão</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={!selectedCard}
                    onPress={handleUseCard}
                    className={` bg-[#75FB4C]/40 self-center ${!selectedCard ? 'opacity-40' : 'opacity-100'} mt-4 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row `}
                  >
                    {loading ? (
                      <ActivityIndicator size={'small'} color={'#C45EEB'} />
                    ) : (
                      <View className="flex w-full flex-row  items-center justify-center  ">
                        <Text className="text-white font-poppinsRegular mt-1">Continuar</Text>
                        <Image
                          className="w-7 h-7  -mr-4 ml-1 "
                          source={require('../../../../../../assets/Global/Icons/confirmBlack.png')}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <Animated.View entering={FadeIn.duration(600)} className="mt-5">
                  <Installments
                    formData={formData}
                    installmentCount={installmentCount}
                    setInstallmentCount={setInstallmentCount}
                    installment={installment}
                    setInstallment={setInstallment}
                    installments={installments}
                    setInstallments={setInstallments}
                    control={control}
                  />
                  <Animated.View
                    entering={FadeIn.duration(600).delay(100)}
                    exiting={FadeOut.duration(100)}
                    className="justify-between flex w-[90%] flex-row self-center mt-10"
                  >
                    <TouchableOpacity
                      className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                      onPress={() => setSelected('')}
                    >
                      <Image
                        source={require('../../../../../../assets/Global/blurBuyButton.png')}
                        className="-mt-2 -ml-2 absolute w-36 h-14"
                      />
                      <Image
                        className="h-5 w-3 absolute left-3 "
                        source={require('../../../../../../assets/Global/Icons/simpleBackArrow.png')}
                      />
                      <Text className="text-white text-[12px]   font-poppinsSemiBold ">Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={sendExistingCard}
                      disabled={loading}
                      className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                    >
                      {loading ? (
                        <ActivityIndicator size={'small'} color={'#C45EEB'} />
                      ) : (
                        <View className="flex w-full flex-row  items-center justify-center  ">
                          <Text className="text-white font-poppinsSemiBold">Finalizar</Text>
                          <Image
                            className="w-7 h-7  -mr-4 ml-1 "
                            source={require('../../../../../../assets/Global/Icons/confirmBlack.png')}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </Animated.View>
              )}
            </>
          )}
        </>
      )}
      {newCard && (
        <Animated.View
          entering={FadeIn.duration(600)}
          className="flex flex-row  self-center items-center justify-evenly mt-6 w-[100%]"
        >
          <TouchableOpacity
            className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
            onPress={() => handleBack()}
          >
            <Image
              source={require('../../../../../../assets/Global/blurBuyButton.png')}
              className="-mt-2 -ml-2 absolute w-36 h-14"
            />
            <Image
              className="h-5 w-3 absolute left-3 "
              source={require('../../../../../../assets/Global/Icons/simpleBackArrow.png')}
            />
            <Text className="text-white text-[12px]  font-bold ">Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
            onPress={validate}
            disabled={loading}
          >
            <Image
              source={require('../../../../../../assets/Global/seeTicketBlur.png')}
              className="-mt-2 -ml-2 absolute w-[144px] h-[52px] "
            />
            <View className="flex flex-row items-center justify-center w-full">
              <View className="flex flex-row w-full self-center items-center justify-center  ">
                <View>
                  {loading ? (
                    <ActivityIndicator color={'#290948'} />
                  ) : (
                    <View className="flex flex-row items-center  ">
                      <Text className="text-[#290948] text-[12px] font-bold">
                        {stepTree ? 'Finalizar' : selected === 'New' ? 'Continuar' : 'Continuar'}
                      </Text>
                      <Image
                        className="w-7 h-7  -mr-4 ml-1 "
                        source={require('../../../../../../assets/Global/Icons/confirmBlack.png')}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}
