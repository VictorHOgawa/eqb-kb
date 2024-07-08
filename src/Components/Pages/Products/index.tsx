import * as Clipboard from 'expo-clipboard';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import QRCode from 'react-qr-code';
import QRCodeStyled from 'react-native-qrcode-styled';
import Theme from '../../../styles/themes';
import { authDeleteAPI, authGetAPI } from '../../../utils/api';
import { BackButton } from '../../Global/Back';
import { Button } from '../../Global/Button';
import { AltContainer, AltLogo } from '../../Global/Header/styles';
import { More } from '../../Global/More';
import { GlobalTitle } from '../../Global/Title';
import { HorizontalView } from '../../Global/View/HorizontalView';
import { VerticalView } from '../../Global/View/VerticalView';

import 'moment/locale/pt-br';
import {
  Card,
  Container,
  Details,
  Help,
  Icon,
  Icons,
  MainModalBody,
  Map,
  Match,
  ModalBody,
  NoProducts,
  QrCodeImage,
  Text1,
  TicketImage,
} from './styles';
import { TouchableOpacityBase } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { PendignQrCodeModal } from '../../Global/PendingQrCodeModal';

interface ProductProps {
  events: any;
  reload: any;
}

export function ProductCards({ events, reload }: ProductProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const [type, setType] = useState('');
  const [qrCode, setQrCode] = useState<any>({ id: '', type: '' });
  const [qrCodeImage, setQrCodeImage] = useState<any>();
  const [showQrCodeImage, setShowQrCodeImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [eventCurrentIndex, setEventCurrentIndex] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>();
  const placeProducts = events.placeProducts;
  const eventProducts = events.eventProducts;
  const [currentEventTransferCode, setCurrentEventTransferCode] = useState('');
  const [currentItem, setCurrentItem] = useState<any>(events[0]);
  const [transferCode, setTransferCode] = useState('');
  const handleOpen = (item: any) => {
    setSelectedEvent(item);
    setEventCurrentIndex(item.id);
    setOpen(true);
  };
  const handlePay = async (item: any, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    if (item.status === 'active') {
      setCurrentItem(item);
      setLoading(true);
      setTransferCode(item.transferCode);
      setId(item.id);
      setType('product');
      Alert.alert('Cuidado!', 'Esse QrCode é de uso Único, não Compartilhe com Ninguém!', [
        {
          text: 'Ver qrCode',
          onPress: () => {
            setShow(true);
            return setLoading(false);
          },
        },
        {
          text: 'Voltar',
          onPress: () => {
            return setLoading(false);
          },
        },
      ]);
    }
    if (item.status === 'inactive') {
      setLoading(true);
      const connect = await authGetAPI(`/customer/product/${item.id}/payment`);
      if (connect.status !== 200) {
        setLoading(false);
        return Alert.alert(connect.body);
      }
      setQrCodeImage(connect.body.payment);
      setShowQrCodeImage(true);
      return setLoading(false);
    }
  };
  const handleCopy1 = () => {
    Clipboard.setStringAsync(currentEventTransferCode);
    setOpenTransfer(false);
    return Alert.alert('Código Copiado!');
  };
  const handleCopy = () => {
    Clipboard.setStringAsync(qrCodeImage.payload);
  };
  const handleModify = async (item: any, index: number) => {
    setCurrentIndex(index);
    setCurrentItem(item);
    setTransferCode(item.transferCode);
    if (item.status === 'active') {
      setCurrentEventTransferCode(item.transferCode);
      return setOpenTransfer(true);
    }
    if (item.status === 'inactive' || 'used') {
      setLoading1(true);
      Alert.alert('Cuidado!', 'Ao prosseguir, seu produto será permanentemente excluído!', [
        {
          text: 'Excluir',
          onPress: async () => {
            const connect = await authDeleteAPI(`/customer/product/${item.id}`);
            if (connect.status === 200) {
              reload();
              return setLoading1(false);
            }
            reload();
            return setLoading1(false);
          },
        },
        {
          text: 'Voltar',
          onPress: () => {
            return setLoading1(false);
          },
        },
      ]);
    }
  };

  useEffect(() => {
    setQrCode({
      id: id,
      type: type,
    });
  }, [id, type]);

  const groupedEvents = eventProducts.reduce(
    (acc: { [x: string]: { products: any[] } }, event: { eventId: any }) => {
      const eventId = event.eventId;
      if (!acc[eventId]) {
        acc[eventId] = {
          ...event,
          products: [],
        };
      }
      acc[eventId].products.push(event);
      return acc;
    },
    {}
  );

  const groupedPlaces = placeProducts.reduce(
    (acc: { [x: string]: { products: any[] } }, place: { placeId: any }) => {
      const placeId = place.placeId;
      if (!acc[placeId]) {
        acc[placeId] = {
          ...place,
          products: [],
        };
      }
      acc[placeId].products.push(place);
      return acc;
    },
    {}
  );
  function formatDate(dateString: moment.MomentInput) {
    moment.locale('pt-br'); // Define o locale para português do Brasil
    return moment(dateString).format('DD [de] MMMM [de] YYYY');
  }
  return (
    <View>
      <View className=" flex flex-row w-[95%] self-center justify-between items-center mt-5">
        <View className=" flex flex-row pl-2  self-center items-center ">
          <Image
            className="w-[23px] h-5 mr-2 "
            source={require('../../../../assets/Event/backPack.png')}
          />
          <Text className="text-white text-[22px] font-poppinsSemiBold mt-1">Meus Produtos</Text>
        </View>
        <More type="product" />
      </View>

      {events.eventProducts.length === 0 && events.placeProducts.length === 0 ? (
        <View className="w-[80%] self-center h-[200px] mt-20 mb-20 flex items-center justify-center">
          <Text className=" text-primary_100 p-5 self-center font-poppinsRegular mt-1 text-lg">
            Nenhum Produto Encontrado
          </Text>
        </View>
      ) : (
        <>
          <View className=" flex flex-col flex-1 pb-20 mt-2 items-center ">
            <View className="w-full h-full">
              {Object.values(groupedEvents).map((item: any) => (
                <View
                  key={item.id}
                  className="bg-[#450A88] border-[#D356F3] border-[1px] w-[95%] self-center mt-1 rounded-lg py-2 px-1 mb-5"
                >
                  <Details>
                    <TicketImage source={{ uri: item.eventFlyer }} />
                    <View className="flex flex-col w-full gap-x-1 ml-2">
                      <Text className="text-[15px] font-poppinsBold mt-1 text-white w-44 min-w-44">
                        {item.eventName}
                      </Text>
                      <View className="flex flex-row items-center">
                        <Image
                          className="mr-1"
                          source={require('../../../../assets/Global/Icons/clockIcon.png')}
                        />
                        <Text className="text-white font-poppinsBold mt-1 text-[10px]">
                          {moment(item.eventDate).format('LL')} às{' '}
                          {moment(item.eventDate).format('LT')}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <Image
                          className="mr-1"
                          source={require('../../../../assets/Global/Icons/pinIcon.png')}
                        />
                        <Text className="text-white font-poppinsBold mt-1 text-[10px]">
                          {item.eventLocal} - {item.eventCity} / {item.eventState}
                        </Text>
                      </View>
                    </View>
                  </Details>
                  <View className="w-28 absolute top-2 right-2  justify-end flex flex-row">
                    <View className="mr-1 justify-self-end border-[1px] border-primary_60 rounded-md max-w-20 h-8 p-1 items-center justify-center flex flex-row text-center ">
                      <Text className="text-white text-[12px]">
                        Produtos: {''}
                        <Text className=" font-poppinsBold mt-1 text-[14px] text-primary_60">
                          {item.products.length}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <HorizontalView
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      marginTop: '2%',
                    }}
                  >
                    <TouchableOpacity
                      className="bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white h-10 w-32 rounded-md items-center justify-center flex flex-row"
                      onPress={() => handleOpen(item)}
                    >
                      <Image
                        source={require('../../../../assets/Global/blurBuyButton.png')}
                        className="-mt-2 -ml-2 absolute w-36 h-14"
                      />
                      <Text className="text-white text-[14px] font-poppinsBold mt-1">Produtos</Text>
                    </TouchableOpacity>
                  </HorizontalView>
                </View>
              ))}

              {Object.values(groupedPlaces).map((item: any) => (
                <View
                  key={item.id}
                  className="bg-[#450A88] border-[#D356F3] border-[1px] w-[95%] self-center mt-1 rounded-lg py-2 px-1 mb-5"
                >
                  <Details>
                    <TicketImage source={{ uri: item.placeFlyer }} />
                    <View className="flex flex-col w-full gap-x-1 ml-2">
                      <Text className="text-[15px] font-poppinsBold mt-1 text-white w-44 min-w-44">
                        {item.placeName}
                      </Text>
                      <View className="flex items-center flex-row">
                        <Image
                          className="mr-1"
                          source={require('../../../../assets/Global/Icons/pinIcon.png')}
                        />
                        <Text className="text-white font-poppinsBold mt-1 text-[10px]">
                          {item.placeCity} / {item.placeState}
                        </Text>
                      </View>
                    </View>
                  </Details>
                  <View className="w-28 absolute top-2 right-2  justify-end flex flex-row">
                    <View className="mr-1 justify-self-end border-[1px] border-primary_60 rounded-md max-w-20 h-8 p-1 items-center justify-center flex flex-row text-center ">
                      <Text className="text-white text-[12px]">
                        Produtos: {''}
                        <Text className=" font-poppinsBold mt-1 text-[14px] text-primary_60">
                          {item.products.length}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <HorizontalView
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      marginTop: '2%',
                    }}
                  >
                    <TouchableOpacity
                      className="bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white h-10 w-32 rounded-md items-center justify-center flex flex-row"
                      onPress={() => handleOpen(item)}
                    >
                      <Image
                        source={require('../../../../assets/Global/blurBuyButton.png')}
                        className="-mt-2 -ml-2 absolute w-36 h-14"
                      />
                      <Text className="text-white text-[13px] font-poppinsBold mt-1">Produtos</Text>
                    </TouchableOpacity>
                  </HorizontalView>
                </View>
              ))}

              {!selectedEvent ? (
                <></>
              ) : (
                <>
                  <Modal
                    isVisible={open}
                    onModalHide={handleClose}
                    onBackButtonPress={handleClose}
                    onBackdropPress={handleClose}
                    className="rounded-2xl overflow-hidden max-h-[90%] self-center bg-[#450A88]/80 border-[1px] border-primary_100"
                  >
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      className="rounded-2xl  overflow-hidden "
                    >
                      <BlurView tint="light" intensity={10} className="rounded-2xl">
                        <View className=" py-10 px-5 rounded-2xl ">
                          <TouchableOpacity className=" ml-0 -mt-4 " onPress={() => setOpen(false)}>
                            <Image
                              className="h-5 w-3   "
                              source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                            />
                          </TouchableOpacity>

                          <Image
                            className=" h-24 w-24 self-center"
                            source={require('../../../../assets/Global/Logo2.png')}
                          />

                          <View className=" flex flex-row pl-2   items-center ">
                            <Image
                              className="w-[23px] h-5 mr-2 "
                              source={require('../../../../assets/Event/backPack.png')}
                            />
                            <Text className="text-white w-[90%]  text-[22px] font-semibold">
                              {selectedEvent.eventName
                                ? selectedEvent.eventName
                                : selectedEvent.placeName}
                            </Text>
                          </View>

                          <View className=" mt-10  w-full flex flex-col">
                            {selectedEvent.products.map((item, index) => (
                              <View
                                key={index}
                                className="p-1 w-full bg-[#450A88] border border-[#D356F3] rounded-lg mb-3"
                              >
                                <View className=" flex p-1 flex-row w-full ">
                                  <Image
                                    className=" rounded-md w-16 h-16 "
                                    source={{
                                      uri: item.image,
                                    }}
                                  />

                                  <Text className=" text-white ml-2 w-[65%]  text-md font-poppinsBold mt-1">
                                    {item.name}
                                  </Text>
                                  <Image
                                    className="w-[27px] ml-auto  h-6"
                                    source={require('../../../../assets/Global/Icons/bottles1.png')}
                                  />
                                </View>
                                <HorizontalView
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    marginTop: '2%',
                                  }}
                                >
                                  <TouchableOpacity
                                    className=" bg-[#C45EEB]/40 scale-90 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                                    onPress={() => handleModify(item, index)}
                                  >
                                    <Image
                                      source={require('../../../../assets/Global/blurBuyButton.png')}
                                      className="-mt-2 -ml-2 absolute w-36 h-14"
                                    />
                                    {loading1 && currentIndex === index ? (
                                      <ActivityIndicator color={`${Theme.color.background}`} />
                                    ) : (
                                      <View className="flex flex-row items-center justify-center w-full">
                                        {item.status === 'active' ? (
                                          <View className="flex flex-row self-center items-center justify-center  ">
                                            <Image
                                              className="w-5 h-5 mr-2"
                                              source={require('../../../../assets/Global/Icons/AddTicketsWhite.png')}
                                            />
                                            <Text className="text-white text-[12px] font-semibold">
                                              Transferir
                                            </Text>
                                          </View>
                                        ) : (
                                          <View className="flex flex-row px-1r self-center items-center justify-center  ">
                                            <Image
                                              className="w-5 h-5 mr-2"
                                              source={require('../../../../assets/Global/Icons/TrashBinIcon.png')}
                                            />
                                            <Text className="text-white text-[12px] font-semibold">
                                              Excluir Produto
                                            </Text>
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </TouchableOpacity>
                                  {item.status === 'used' ? (
                                    <></>
                                  ) : (
                                    <TouchableOpacity
                                      className=" bg-[#75FB4C]/40 border-[1px] scale-90 relative border-[#75FB4C] text-white  h-10 w-40 rounded-md items-center justify-center flex flex-row "
                                      onPress={() => handlePay(item, index)}
                                    >
                                      <Image
                                        source={require('../../../../assets/Global/seeTicketBlur.png')}
                                        className="-mt-2 -ml-2 absolute w-[180px] h-[42px] rounded-3xl"
                                      />
                                      {loading && currentIndex === index ? (
                                        <ActivityIndicator color={`${Theme.color.background}`} />
                                      ) : (
                                        <View className="flex flex-row items-center justify-center w-full">
                                          {item.status === 'active' ? (
                                            <View className="flex flex-row self-center items-center justify-center  ">
                                              <Image
                                                className="w-7 h-7 mr-2"
                                                source={require('../../../../assets/Global/Icons/QrCodeIcon.png')}
                                              />
                                              <VerticalView>
                                                <Text className="text-[#150029] text-[12px] font-poppinsBold mt-1">
                                                  Ver Produto
                                                </Text>
                                              </VerticalView>
                                            </View>
                                          ) : (
                                            <View className="flex flex-row self-center items-center justify-center  ">
                                              <Image
                                                className="w-5 h-5 mr-2"
                                                source={require('../../../../assets/Global/Icons/PaymentIcon.png')}
                                              />
                                              <VerticalView>
                                                <Text className="text-[#150029] text-[12px] font-poppinsBold mt-1">
                                                  Pagamento Pendente
                                                </Text>
                                              </VerticalView>
                                            </View>
                                          )}
                                        </View>
                                      )}
                                    </TouchableOpacity>
                                  )}
                                </HorizontalView>
                              </View>
                            ))}
                          </View>
                          <View className="flex flex-row mt-10 justify-evenly items-center">
                            <TouchableOpacity
                              className=" bg-[#C45EEB]/40 self-center x border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                              onPress={handleClose}
                            >
                              <Image
                                source={require('../../../../assets/Global/blurBuyButton.png')}
                                className="-mt-2 -ml-2 absolute w-36 h-14"
                              />
                              <Text className="text-white text-[14px]  font-poppinsBold mt-1 ">
                                Voltar
                              </Text>
                              <Image
                                className="h-5 w-5  left-3 absolute"
                                source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity className=" bg-[#FFFFFF]/40 border h-10 border-white rounded-lg  flex flex-row overflow-hidden items-center ">
                              <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                              <View className="flex flex-row px-4 py-2 items-center ">
                                <Image
                                  className="h-5 w-5 mr-2  "
                                  source={require('../../../../assets/Global/Icons/infoButton.png')}
                                />
                                <Text className="text-[#450A88] font-poppinsBold mt-1">
                                  Como usar?
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </BlurView>
                    </ScrollView>
                    <Modal
                      isVisible={openTransfer}
                      onModalHide={() => setOpenTransfer(false)}
                      onBackButtonPress={() => setOpenTransfer(false)}
                      onBackdropPress={() => setOpenTransfer(false)}
                    >
                      <View className="rounded-2xl overflow-hidden border-[1px] border-primary_100">
                        <BlurView tint="light" intensity={30} className="rounded-2xl">
                          <View className="bg-[#450A88]/80 py-3 rounded-2xl relative">
                            <TouchableOpacity
                              className=" ml-4 "
                              onPress={() => setOpenTransfer(false)}
                            >
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
                                source={require('../../../../assets/Global/Icons/transferArrowWhite.png')}
                              />
                              <Text className="text-white text-[21px] font-semibold">
                                Deseja transferir?
                              </Text>
                            </View>
                            <Text className="text-white text-[16px] max-w-[240px] text-center self-center font-semibold">
                              Ao Clicar em Transferir você receberá o código Criptografado para
                              Transferir seu Ingresso!
                            </Text>
                            <View className="flex flex-row justify-evenly mt-10 mb-10">
                              <TouchableOpacity
                                className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-12 w-32 rounded-md items-center justify-center flex flex-row "
                                onPress={handleCopy1}
                              >
                                <Image
                                  source={require('../../../../assets/Global/blurBuyButton.png')}
                                  className="-mt-2 -ml-2 absolute w-36 h-14"
                                />
                                <Image
                                  className="h-5 w-5 mr-2  "
                                  source={require('../../../../assets/Global/Icons/copyCode.png')}
                                />
                                <Text className="text-white text-[14px]  font-poppinsBold mt-1 ">
                                  Copiar Código
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                className=" bg-[#FFFFFF]/40 border h-12 border-white rounded-lg  flex flex-row overflow-hidden items-center "
                                onPress={() => setOpenTransfer(false)}
                              >
                                <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                                <View className="flex flex-row px-4 py-3 items-center ">
                                  <Image
                                    className="h-5 w-5 mr-2  "
                                    source={require('../../../../assets/Global/Icons/infoButton.png')}
                                  />
                                  <Text className="text-[#290948] font-poppinsBold mt-1">
                                    Como funciona?
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </BlurView>
                      </View>
                    </Modal>
                    <Modal
                      isVisible={show}
                      animationIn={'fadeIn'}
                      onModalHide={() => setShow(false)}
                      onBackButtonPress={() => setShow(false)}
                      onBackdropPress={() => setShow(false)}
                    >
                      <View className="rounded-2xl overflow-hidden  bg-[#450A88]/80 border-[1px] h-full w-full  border-primary_100">
                        <BlurView
                          tint="light"
                          intensity={30}
                          className="rounded-2xl h-full w-full  "
                        >
                          <View className="bg-[#450A88]/80 h-full w-full   py-3 rounded-2xl relative">
                            <ImageBackground
                              source={require('../../../../assets/Purchased/qrCodeBackground.png')}
                              className="w-[306px] object-cover mt-10 h-[478px] flex items-center self-center"
                            >
                              <View className="h-1/2 w-full ">
                                <View className="w-full h-[90%] -mt-10 overflow-hidden  flex flex-row rounded-b-3xl">
                                  <Image
                                    resizeMode="stretch"
                                    className="h-full w-full  z-10  flex"
                                    source={
                                      currentItem?.eventFlyer
                                        ? { uri: currentItem?.eventFlyer }
                                        : { uri: currentItem?.placeFlyer }
                                    }
                                  />
                                </View>

                                <View className="flex pl-2  pr-4 flex-row items-center ">
                                  <Text className=" ml-4 mt-1 text-[12px] w-[75%] font-poppins  text-white  ">
                                    {currentItem?.placeName
                                      ? currentItem?.placeName
                                      : currentItem?.eventName}
                                  </Text>
                                  <Text className=" ml-auto  text-[18px] text-white text-center ">
                                    {currentItem?.placeCity
                                      ? currentItem?.placeCity
                                      : moment(currentItem?.eventDate).format('DD/MM')}
                                  </Text>
                                </View>
                              </View>
                              <View className="h-1/2  w-[80%] items-center  mt-5 self-center">
                                <View className="    flex items-center   justify-center">
                                  <View className="z-20  bg-transparent">
                                    <QRCodeStyled
                                      data={JSON.stringify(qrCode)}
                                      className=" bg-white rounded-lg overflow-hidden"
                                      padding={4}
                                      pieceSize={6}
                                      pieceBorderRadius={[0, 6, 0, 6]}
                                      isPiecesGlued
                                      gradient={{
                                        type: 'radial',
                                        options: {
                                          start: [0, 0],
                                          end: [1, 1],
                                          colors: ['#da0c8b', '#00bfff'],
                                          locations: [0, 1],
                                        },
                                      }}
                                      innerEyesOptions={{
                                        borderRadius: 12,
                                        scale: 0.85,
                                      }}
                                      logo={{
                                        href: require('../../../../assets/Global/LogoWithBackground.png'),
                                        padding: 0,
                                        scale: 1.2,
                                      }}
                                    />
                                  </View>
                                </View>
                              </View>
                            </ImageBackground>
                          </View>
                          {currentItem && currentItem?.name && currentItem?.image && (
                            <View className="p-1 w-[80%] self-center bg-[#450A88] border -mt-[200px] border-[#D356F3] rounded-lg mb-3">
                              <View className=" flex p-1 flex-row w-full ">
                                <Image
                                  className=" rounded-md w-16 h-16 "
                                  source={{
                                    uri: currentItem.image,
                                  }}
                                />

                                <Text className=" text-white ml-2 w-[65%]  text-md font-poppinsBold mt-1">
                                  {currentItem.name}
                                </Text>
                                <Image
                                  className="w-[27px] ml-auto  h-6"
                                  source={require('../../../../assets/Global/Icons/bottles1.png')}
                                />
                              </View>
                            </View>
                          )}

                          <View className="mt-auto">
                            <View className="flex flex-row justify-evenly mt-10 mb-10">
                              <TouchableOpacity
                                className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-12 w-32 rounded-md items-center justify-center flex flex-row "
                                onPress={() => setShow(false)}
                              >
                                <Image
                                  source={require('../../../../assets/Global/blurBuyButton.png')}
                                  className="-mt-2 -ml-2 absolute w-36 h-14"
                                />
                                <Image
                                  className="h-5 w-5 absolute left-3  "
                                  source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                                />
                                <Text className="text-white text-[14px]  font-poppinsBold mt-1 ">
                                  Voltar
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity className=" bg-[#FFFFFF]/40 border h-12 border-white rounded-lg  flex flex-row overflow-hidden items-center ">
                                <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                                <View className="flex flex-row px-4 py-3 items-center ">
                                  <Image
                                    className="h-5 w-5 mr-2  "
                                    source={require('../../../../assets/Global/Icons/infoButton.png')}
                                  />
                                  <Text className="text-[#290948] font-poppinsBold mt-1">
                                    Como usar?
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </BlurView>
                      </View>
                    </Modal>
                  </Modal>
                </>
              )}
            </View>
          </View>
        </>
      )}
      <Help>
        <Icons source={require('../../../../assets/Global/Icons/youtubeIcon.png')} />
        <Text1> {''}Dúvidas? Veja esse Rápido Vídeo</Text1>
      </Help>
      <PendignQrCodeModal
        setShowQrCodeImage={setShowQrCodeImage}
        handleCopy={handleCopy}
        qrCodeImage={qrCodeImage}
        showQrCodeImage={showQrCodeImage}
      />
    </View>
  );
}
