import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text } from 'react-native';
import Modal from 'react-native-modal';
import Theme from '../../../styles/themes';
import { AuthPostAPI, getAPI } from '../../../utils/api';
import { BackButton } from '../Back';
import { Button } from '../Button';
import { LineBreak } from '../LineBreak';
import { GlobalTitle } from '../Title';
import { HorizontalView } from '../View/HorizontalView';
import { Container, Display, Icon, Input, ModalBody, SmallIcon, Text1 } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { View, TouchableOpacity } from 'react-native';

import { BlurView } from 'expo-blur';
import { Image, TextInput } from 'react-native';

interface MoreProps extends React.ComponentProps<typeof Container> {
  type?: string;
  handleClick?: any;
  portariaCode?: any;
  setPortariaCode?: any;
}

export function More({ type, handleClick, portariaCode, setPortariaCode, ...rest }: MoreProps) {
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [step, setStep] = useState(1);
  const [promoter, setPromoter] = useState<any>();
  const [promoCode, setPromoCode] = useState('');
  const [code, setCode] = useState('');
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleOpen = () => {
    setSelected('1');
    setOpen1(true);
  };

  const handleOpen2 = () => {
    setSelected('2');
    setOpen2(true);
  };

  async function sendCode() {
    setLoading(true);
    const connect = await AuthPostAPI(`/customer/${type}/${code}/transfer`, {});
    if (connect.status !== 200) {
      alert(connect.body);
      return setLoading(false);
    }
    Alert.alert(`${type === 'ticket' ? 'Ingresso' : 'Produto'} Recebido com Sucesso!`);
    navigation.replace(type === 'ticket' ? 'Tickets' : type === 'product' ? 'Products' : 'Jobs');
    return setLoading(false);
  }

  async function handleCourtesy() {
    setLoading1(true);
    const connect = await AuthPostAPI(`/customer/courtesy/${code}`, {});
    if (connect.status !== 200) {
      Alert.alert(connect.body);
      return setLoading1(false);
    }
    Alert.alert(`${type === 'ticket' ? 'Ingresso' : 'Produto'} Recebido com Sucesso!`);
    navigation.replace(type === 'ticket' ? 'Tickets' : type === 'product' ? 'Products' : 'Jobs');
    return setLoading1(false);
  }

  async function handlePromoter() {
    setLoading2(true);
    const connect = await getAPI(`/promoter/${code}`);
    if (connect.status !== 200) {
      alert(connect.body);
      return setLoading2(false);
    }
    setPromoter(connect.body);
    setStep(2);
    return setLoading2(false);
  }

  async function handleSend() {
    setLoading3(true);
    const connect = await AuthPostAPI(`/user/promoter/${code}`, {
      code: promoCode,
    });
    if (connect.status !== 200) {
      alert(connect.body);
      return setLoading3(false);
    }
    navigation.replace('Promoter');
    return setLoading3(false);
  }

  return (
    <>
      {type === 'ticket' || type === 'product' ? (
        <>
          {/* <Container {...rest} onPress={() => setOpen(true)}>
            <Icon source={require("../../../../assets/Global/Plus.png")} />
          </Container> */}
          <TouchableOpacity
            className="bg-white w-[140px] h-[40px] rounded-md flex items-center justify-center"
            onPress={() => setOpen(true)}
          >
            <View className=" flex flex-row items-center justify-evenly w-full">
              <SmallIcon
                className="w-5 h-5"
                source={require('../../../../assets/Global/addIcon.png')}
              />
              <Text className="text-[11px] text-primary_100 font-poppinsBold mt-1">
                {type === 'ticket' ? 'Adicionar Ingresso' : 'Adicionar Produto'}
              </Text>
            </View>
          </TouchableOpacity>
          <Modal
            isVisible={open}
            onModalHide={() => setOpen(false)}
            onBackButtonPress={() => setOpen(false)}
            onBackdropPress={() => setOpen(false)}
          >
            <View className="rounded-2xl overflow-hidden border-[1px] border-primary_100">
              <BlurView tint="light" intensity={30} className="rounded-2xl">
                <View className="bg-[#450A88]/80 py-3 rounded-2xl relative">
                  <TouchableOpacity className=" ml-4 " onPress={() => setOpen(false)}>
                    <Image
                      className="h-5 w-3   "
                      source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                    />
                  </TouchableOpacity>
                  <Image
                    source={require('../../../../assets/Global/Logo2.png')}
                    className="w-28 h-24 self-center"
                  />
                  <View className="flex flex-row justify-center mt-4 items-center">
                    <Image
                      className="h-5 w-5 mr-2  "
                      source={require('../../../../assets/Global/Icons/confetti.png')}
                    />
                    <Text className="text-white text-[21px] font-poppinsSemiBold">
                      Qual o tipo de Resgate?
                    </Text>
                  </View>
                  <Text className="text-white text-[16px] max-w-[240px] text-center self-center font-poppinsRegular">
                    Selecione entre Cortesia e Transferência de QrCodes.
                  </Text>
                  <View className="flex flex-row justify-evenly mt-10 mb-10">
                    <TouchableOpacity
                      className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-12 w-32 rounded-md items-center justify-center flex flex-row "
                      onPress={handleOpen2}
                    >
                      <Image
                        source={require('../../../../assets/Global/blurBuyButton.png')}
                        className="-mt-2 -ml-2 absolute w-36 h-14"
                      />
                      <Image
                        className="h-5 w-5 mr-2  "
                        source={require('../../../../assets/Global/Icons/gift.png')}
                      />
                      <Text className="text-white text-[14px]  font-poppinsSemiBold mt-1 ">
                        Cortesia
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className=" bg-[#FFFFFF]/40 border h-12 border-white rounded-lg  flex flex-row overflow-hidden items-center "
                      onPress={handleOpen}
                    >
                      <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                      <View className="flex flex-row px-4 py-3 items-center ">
                        <Image
                          className="h-5 w-5 mr-2  "
                          source={require('../../../../assets/Global/Icons/transferArrows.png')}
                        />
                        <Text className="text-[#290948] font-poppinsBold ">Transferência</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>

            {selected === '1' ? (
              <>
                <Modal
                  isVisible={open1}
                  onModalHide={() => setOpen1(false)}
                  onBackButtonPress={() => setOpen1(false)}
                  onBackdropPress={() => setOpen1(false)}
                >
                  <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
                    <BlurView tint="light" intensity={30} className="rounded-2xl">
                      <View className="bg-[#450A88]/80 py-3 rounded-2xl relative">
                        <View className=" flex flex-row  z-90 items-center  justify-between">
                          <TouchableOpacity className=" ml-4 " onPress={() => setOpen1(false)}>
                            <Image
                              className="h-5 w-3   "
                              source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="w-7 h-7 bg-white rounded-full mr-2 flex items-center justify-center"
                            onPress={() => setOpen1(false)}
                          >
                            <Text className="font-poppinsSemiBold text-[20px]">i</Text>
                          </TouchableOpacity>
                        </View>
                        <Image
                          source={require('../../../../assets/Global/Logo2.png')}
                          className="w-28 h-24 self-center"
                        />
                        <View className="flex flex-row justify-center mt-4 items-center">
                          <Image
                            className="h-4 w-[18px] mr-2 "
                            source={require('../../../../assets/Event/backPack.png')}
                          />
                          <Text className="text-white text-[21px] font-poppinsSemiBold">
                            Receber {type === 'product' ? 'Produto' : 'Ingresso'}
                          </Text>
                        </View>
                        <Text className="text-white text-[16px] max-w-[210px] text-center self-center font-poppinsSemiBold">
                          Receba {type === 'product' ? 'Produto' : 'Ingresso'} Transferido via
                          Código
                          <Image
                            className="h-4 w-4 ml-2   "
                            source={require('../../../../assets/Global/Icons/key.png')}
                          />
                        </Text>
                        <View className="flex mt-4 flex-row p-2 items-center bg-[#9C5EEB] rounded-lg w-[70%] self-center">
                          <Image
                            className="h-6 w-6 mr-2 selection:"
                            source={require('../../../../assets/Global/Icons/padlock.png')}
                          />
                          <TextInput
                            className=" rounded-lg h-full w-[80%] text-white text-lg"
                            value={code}
                            onChangeText={(text) => setCode(text)}
                          />
                        </View>
                        <View className="flex flex-row justify-evenly mt-10 mb-10">
                          <TouchableOpacity
                            className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                            onPress={() => setOpen(false)}
                          >
                            <Image
                              source={require('../../../../assets/Global/blurBuyButton.png')}
                              className="-mt-2 -ml-2 absolute w-36 h-14"
                            />
                            <Image
                              className="h-5 w-3 absolute left-3 "
                              source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                            />
                            <Text className="text-white text-[12px]  font-poppinsBold mt-1 ">
                              Voltar
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                            onPress={sendCode}
                            disabled={loading}
                          >
                            <Image
                              source={require('../../../../assets/Global/seeTicketBlur.png')}
                              className="-mt-2 -ml-2 absolute w-[144px] h-[52px] "
                            />
                            <View className="flex flex-row items-center justify-center w-full">
                              <View className="flex flex-row w-full self-center items-center justify-center  ">
                                <Image
                                  className="w-7 h-7 absolute left-1"
                                  source={require('../../../../assets/Global/Icons/confirmBlack.png')}
                                />
                                <View>
                                  {loading ? (
                                    <ActivityIndicator color={'#290948'} />
                                  ) : (
                                    <Text className="text-[#290948] text-[12px] font-poppinsBold mt-1">
                                      Confirmar
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </BlurView>
                  </View>
                </Modal>
              </>
            ) : (
              <>
                <Modal
                  isVisible={open2}
                  onModalHide={() => setOpen2(false)}
                  onBackButtonPress={() => setOpen2(false)}
                  onBackdropPress={() => setOpen2(false)}
                >
                  <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
                    <BlurView tint="light" intensity={30} className="rounded-2xl">
                      <View className="bg-[#450A88]/80 py-3 rounded-2xlrelative">
                        <View className=" flex flex-row  z-90 items-center justify-between">
                          <TouchableOpacity className=" ml-4 " onPress={() => setOpen2(false)}>
                            <Image
                              className="h-5 w-3   "
                              source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="w-7 h-7 bg-white rounded-full mr-2 flex items-center justify-center"
                            onPress={() => setOpen2(false)}
                          >
                            <Text className="font-poppinsSemiBold text-[20px]">i</Text>
                          </TouchableOpacity>
                        </View>
                        <Image
                          source={require('../../../../assets/Global/Logo2.png')}
                          className="w-28 h-24 self-center"
                        />
                        <View className="flex flex-row justify-center mt-4 items-center">
                          <Image
                            className="h-4 w-[18px] mr-2 "
                            source={require('../../../../assets/Event/backPack.png')}
                          />
                          <Text className="text-white text-[21px] font-poppinsSemiBold">
                            Receber {type === 'product' ? 'Produto' : 'Ingresso'}
                          </Text>
                        </View>
                        <Text className="text-white text-[16px] max-w-[200px]  text-center self-center font-poppinsSemiBold">
                          Receba {type === 'product' ? 'Produto' : 'Ingresso'} Cortesia via Código{' '}
                          <Image
                            className="h-4 w-4 ml-2   "
                            source={require('../../../../assets/Global/Icons/key.png')}
                          />
                        </Text>
                        <View className="flex mt-4 flex-row p-2 items-center bg-[#9C5EEB] rounded-lg w-[70%] self-center">
                          <Image
                            className="h-6 w-6 mr-2 selection:"
                            source={require('../../../../assets/Global/Icons/padlock.png')}
                          />
                          <TextInput
                            className=" rounded-lg h-full w-[80%] text-white text-lg"
                            value={code}
                            onChangeText={(text) => setCode(text)}
                          />
                        </View>
                        <View className="flex flex-row justify-evenly mt-10 mb-10">
                          <TouchableOpacity
                            className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                            onPress={() => setOpen2(false)}
                          >
                            <Image
                              source={require('../../../../assets/Global/blurBuyButton.png')}
                              className="-mt-2 -ml-2 absolute w-36 h-14"
                            />
                            <Image
                              className="h-5 w-3 absolute left-3 "
                              source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                            />
                            <Text className="text-white text-[12px]  font-poppinsBold mt-1 ">
                              Voltar
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                            onPress={handleCourtesy}
                            disabled={loading1}
                          >
                            <Image
                              source={require('../../../../assets/Global/seeTicketBlur.png')}
                              className="-mt-2 -ml-2 absolute w-[144px] h-[52px] "
                            />
                            <View className="flex flex-row items-center justify-center w-full">
                              <View className="flex flex-row w-full self-center items-center justify-center  ">
                                <Image
                                  className="w-7 h-7 absolute left-1"
                                  source={require('../../../../assets/Global/Icons/confirmBlack.png')}
                                />
                                <View>
                                  {loading1 ? (
                                    <ActivityIndicator color={'#290948'} />
                                  ) : (
                                    <Text className="text-[#290948] text-[12px] font-poppinsBold mt-1">
                                      Confirmar
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </BlurView>
                  </View>
                </Modal>
              </>
            )}
          </Modal>
        </>
      ) : type === 'portaria' ? (
        <>
          <Container {...rest} onPress={() => setOpen3(true)}>
            <Icon source={require('../../../../assets/Global/Plus.png')} />
          </Container>
          <Modal
            isVisible={open3}
            onModalHide={() => setOpen3(false)}
            onBackButtonPress={() => setOpen3(false)}
            onBackdropPress={() => setOpen3(false)}
          >
            <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
              <BlurView tint="light" intensity={30} className="rounded-2xl">
                <View className="bg-[#450A88]/80 py-3 rounded-2xlrelative">
                  <View className=" flex flex-row  z-90 items-center justify-between">
                    <TouchableOpacity className=" ml-4 " onPress={() => setOpen3(false)}>
                      <Image
                        className="h-5 w-3   "
                        source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={require('../../../../assets/Global/Logo2.png')}
                    className="w-28 h-24 self-center"
                  />
                  <View className="flex flex-row justify-center mt-4 items-center">
                    <Image
                      className="h-4 w-[18px] mr-2 "
                      source={require('../../../../assets/Event/backPack.png')}
                    />
                    <Text className="text-white text-[21px] font-semibold">
                      Cadastrar para Portaria
                    </Text>
                  </View>
                  <Text className="text-white text-[16px] max-w-[200px] gap-1 text-center self-center font-semibold">
                    Insira o codigo do evento para cadastrar-se como portaria {''} {''}
                    <Image
                      className="h-4 w-4 ml-2   "
                      source={require('../../../../assets/Global/Icons/key.png')}
                    />
                  </Text>
                  <View className="flex mt-4 flex-row p-2 items-center bg-[#9C5EEB] rounded-lg w-[70%] self-center">
                    <Image
                      className="h-6 w-6 mr-2 selection:"
                      source={require('../../../../assets/Global/Icons/padlock.png')}
                    />
                    <TextInput
                      className=" rounded-lg h-full w-[80%] text-white text-lg"
                      autoCapitalize="none"
                      placeholder="EX: Carol23"
                      placeholderTextColor={Theme.color.gray_10}
                      value={portariaCode}
                      onChangeText={(text) => setPortariaCode(text)}
                    />
                  </View>
                  <View className="flex flex-row justify-evenly mt-10 mb-10">
                    <TouchableOpacity
                      className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                      onPress={() => setOpen3(false)}
                    >
                      <Image
                        source={require('../../../../assets/Global/blurBuyButton.png')}
                        className="-mt-2 -ml-2 absolute w-36 h-14"
                      />
                      <Image
                        className="h-5 w-3 absolute left-3 "
                        source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                      />
                      <Text className="text-white text-[12px]  font-bold ">Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                      onPress={handleClick}
                      disabled={loading1}
                    >
                      <Image
                        source={require('../../../../assets/Global/seeTicketBlur.png')}
                        className="-mt-2 -ml-2 absolute w-[144px] h-[52px] "
                      />
                      <View className="flex flex-row items-center justify-center w-full">
                        <View className="flex flex-row w-full self-center items-center justify-center  ">
                          <Image
                            className="w-7 h-7 absolute left-1"
                            source={require('../../../../assets/Global/Icons/confirmBlack.png')}
                          />
                          <View>
                            {loading1 ? (
                              <ActivityIndicator color={'#290948'} />
                            ) : (
                              <Text className="text-[#290948] text-[12px] font-bold">
                                Confirmar
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          </Modal>
        </>
      ) : type === 'promoter' ? (
        <>
          <Container {...rest} onPress={() => setOpen4(true)}>
            <Icon source={require('../../../../assets/Global/Plus.png')} />
          </Container>
          <Modal
            isVisible={open4}
            onModalHide={() => setOpen4(false)}
            onBackButtonPress={() => setOpen4(false)}
            onBackdropPress={() => setOpen4(false)}
          >
            <ModalBody style={{ padding: 10, borderRadius: 10 }}>
              {step === 1 ? (
                <>
                  <GlobalTitle title="Código de Registro" color={Theme.color.gray_10} />
                  <Input
                    placeholder="EX: Carol24"
                    placeholderTextColor={Theme.color.gray_10}
                    value={code}
                    onChangeText={(text) => setCode(text)}
                  />
                  <Button
                    title="Buscar"
                    background={`${Theme.color.confirmation}`}
                    color={`${Theme.color.secondary_100}`}
                    onPress={handlePromoter}
                    height={40}
                    loading={loading2}
                  />
                </>
              ) : (
                <>
                  <GlobalTitle
                    title="Benefício do Seu Cupom"
                    background={Theme.color.background}
                    color={Theme.color.gray_10}
                    fontSize={15}
                  />
                  <HorizontalView
                    style={{
                      justifyContent: 'space-between',
                      marginTop: '2%',
                      alignItems: 'center',
                    }}
                  >
                    <Text1>Quantidade Disponível: </Text1>
                    <Display>
                      <Text1 style={{ color: Theme.color.confirmation }}>
                        {promoter.promoter.coupon_quantity}
                      </Text1>
                    </Display>
                  </HorizontalView>
                  <HorizontalView
                    style={{
                      justifyContent: 'space-between',
                      marginTop: '2%',
                      alignItems: 'center',
                    }}
                  >
                    <Text1>Desconto Disponível: </Text1>
                    <Display>
                      <Text1 style={{ color: Theme.color.confirmation }}>
                        {promoter.promoter.discount}
                      </Text1>
                    </Display>
                  </HorizontalView>
                  <LineBreak />
                  <GlobalTitle
                    title="Insira o Código que Desejar"
                    background={Theme.color.background}
                    color={Theme.color.gray_10}
                    fontSize={15}
                  />
                  <Input
                    placeholder="EX: Carol25"
                    placeholderTextColor={Theme.color.gray_10}
                    value={promoCode}
                    onChangeText={(text) => setPromoCode(text)}
                  />
                  <Button
                    title="Salvar e Seguir"
                    background={`${Theme.color.confirmation}`}
                    color={`${Theme.color.secondary_100}`}
                    onPress={handleSend}
                    height={40}
                    loading={loading3}
                  />
                </>
              )}
              <Button
                title="Voltar"
                background={Theme.color.primary_80}
                color={Theme.color.gray_10}
                onPress={() => setOpen4(false)}
                height={40}
              />
            </ModalBody>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
