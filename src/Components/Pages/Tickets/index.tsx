import * as Clipboard from 'expo-clipboard';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import QRCodeStyled from 'react-native-qrcode-styled';
import Theme from '../../../styles/themes';
import { authDeleteAPI, authGetAPI } from '../../../utils/api';
import { More } from '../../Global/More';
import { HorizontalView } from '../../Global/View/HorizontalView';
import { VerticalView } from '../../Global/View/VerticalView';
import { Details, NoTickets, Text1 } from './styles';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { PendignQrCodeModal } from '../../Global/PendingQrCodeModal';

interface TicketProps {
  tickets: any;
  reload: any;
}

export function TicketCards({ tickets, reload }: TicketProps) {
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const [type, setType] = useState('');
  const [qrCode, setQrCode] = useState<any>({ id: '', type: '' });
  const [qrCodeImage, setQrCodeImage] = useState<any>();
  const [showQrCodeImage, setShowQrCodeImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const handlePay = async (item: any, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    if (item.status === 'active') {
      setLoading(true);
      setId(item.id);
      setType('ticket');
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
      const connect = await authGetAPI(`/customer/ticket/${item.id}/payment`);
      if (connect.status !== 200) {
        setLoading(false);
        return Alert.alert(connect.body);
      }
      setQrCodeImage(connect.body.payment);
      setShowQrCodeImage(true);
      return setLoading(false);
    }
  };

  const handleModify = async (item: any, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    if (item.status === 'active') {
      return setOpenTransfer(true);
    }
    if (item.status === 'inactive' || 'used') {
      setLoading1(true);
      Alert.alert('Cuidado!', 'Ao prosseguir, seu ingresso será permanentemente excluído!', [
        {
          text: 'Excluir',
          onPress: async () => {
            const connect = await authDeleteAPI(`/customer/ticket/${item.id}/`);
            if (connect.status !== 200) {
              Alert.alert(connect.body);
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

  const handleCopy = () => {
    Clipboard.setStringAsync(qrCodeImage.payload);
  };

  const handleCopy1 = () => {
    Clipboard.setStringAsync(tickets[currentIndex].transfer_code);
    return Alert.alert('Código Copiado!');
  };

  const handleCopy2 = () => {
    Clipboard.setStringAsync(tickets[currentIndex].transfer_code);
    return Alert.alert('Código Copiado!');
  };

  useEffect(() => {
    setQrCode({
      id: id,
      type: type,
    });
  }, [id, type]);

  const CheckMatchProfile = async (id: string) => {
    const connect = await authGetAPI(`/match/profile/${id}?type=event`);
    if (connect.status === 401 && connect.body === 'ticket') {
      return Alert.alert(
        'Ops!',
        'Para ver a Galera da Night desse Evento você precisa ter um Ingresso'
      );
    }
    if (connect.status === 401 && connect.body === 'profile') {
      return navigation.navigate('MatchRegister', {
        id: id,
        type: 'event',
      });
    }
    return navigation.navigate('Match', {
      id: id,
      type: 'event',
    });
  };
  return (
    <View className="flex-col w-[95%] self-center flex-1">
      <View className=" flex flex-row justify-between items-center mt-5">
        <View className=" flex flex-row pl-2  self-center items-center ">
          <Image
            className="w-7 h-7 mr-1 "
            source={require('../../../../assets/Home/ticketIconHome.png')}
          />
          <Text className="text-white text-[22px] font-poppinsSemiBold mt-1"> Meus Ingressos</Text>
        </View>
        <More type="ticket" />
      </View>

      {tickets.length === 0 ? (
        <View className="w-[100%] self-center h-[200px] mt-20 mb-20 flex items-center justify-center">
          <Text className=" text-primary_100 p-5 self-center font-poppinsRegular mt-1 text-lg">
            Nenhum Ingresso Encontrado
          </Text>
        </View>
      ) : (
        <>
          <View className=" flex flex-col flex-1 pb-20 mt-2 items-center ">
            <View className="w-full h-full">
              {tickets.map((item: any, index: any) => (
                <>
                  <View className="bg-[#450A88] border-[#D356F3] border-[1px] w-[99%] self-center mt-1 rounded-lg py-2 px-1 mb-5">
                    <Details>
                      <Image
                        className="w-[65px] h-[65px] rounded-md"
                        source={{ uri: item.eventFlyer }}
                      />
                      <View className=" flex flex-col w-[50%]  ml-2">
                        <Text className=" text-[13px] font-poppinsBold mt-1 text-white w-44 min-w-44 ">
                          {item.eventName}
                        </Text>
                        <Text1>
                          <Image
                            className=""
                            source={require('../../../../assets/Global/Icons/clockIcon.png')}
                          />
                          {''}
                          <Text1 style={{ fontWeight: 'bold' }}>
                            {''} {moment(item.eventDate).format('LL')} {''}
                          </Text1>
                          às {item.eventTime}
                        </Text1>
                        <Text1>
                          <Image
                            className=""
                            source={require('../../../../assets/Global/Icons/pinIcon.png')}
                          />
                          {''}
                          <Text1 style={{ fontWeight: 'bold' }}>
                            {''} {item.eventLocal}{' '}
                          </Text1>
                          {''}
                          {item.eventCity} / {item.eventState}
                        </Text1>
                      </View>
                      <View className="w-28  justify-end flex flex-row">
                        <View className="mr-1 justify-self-end border-[1px] border-primary_60 rounded-md max-w-20 h-8 p-1 items-center justify-center flex flex-row text-center ">
                          <Text1
                            style={{
                              textAlign: 'center',
                              fontSize: RFValue(8),
                            }}
                          >
                            Área: {''}
                            <Text className=" font-poppinsBold mt-1 text-[12px] text-primary_60">
                              {item.name}
                            </Text>
                          </Text1>
                        </View>
                      </View>
                    </Details>
                    <HorizontalView
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        marginTop: '2%',
                      }}
                    >
                      <TouchableOpacity
                        className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
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
                              <View className="flex flex-row  w-full self-center items-center justify-center  ">
                                <Image
                                  className="w-4 h-[18px] absolute left-2"
                                  source={require('../../../../assets/Global/Icons/transferArrowWhite.png')}
                                />
                                <Text className="text-white text-[11px] font-poppinsSemiBold mt-1">
                                  Transferir
                                </Text>
                              </View>
                            ) : (
                              <View className="flex flex-row px-2 self-center items-center justify-center  ">
                                <Image
                                  className="w-5 h-5 mr-2"
                                  source={require('../../../../assets/Global/Icons/TrashBinIcon.png')}
                                />
                                <Text className="text-white text-[10px] font-poppinsSemiBold mt-1">
                                  Excluir Ingresso
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
                          className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-40 rounded-md items-center justify-center flex flex-row "
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
                                    <Text className="text-[#150029] text-[11px] font-poppinsBold mt-1">
                                      Ver Ingresso
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
                                    <Text className="text-[#150029] text-[10px] font-poppinsBold mt-1">
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
                  <PendignQrCodeModal
                    showQrCodeImage={showQrCodeImage}
                    setShowQrCodeImage={setShowQrCodeImage}
                    qrCodeImage={qrCodeImage}
                    handleCopy={handleCopy}
                  />
                  {/* <Modal
                    isVisible={showQrCodeImage}
                    onModalHide={() => setShowQrCodeImage(false)}
                    onBackdropPress={() => setShowQrCodeImage(false)}
                    onBackButtonPress={() => setShowQrCodeImage(false)}
                  >
                    {qrCodeImage ? (
                      <ModalBody style={{ padding: 10, borderRadius: 10 }}>
                        <QrCodeImage
                          source={{
                            uri: `data:image/png;base64,${qrCodeImage.encodedImage}`,
                          }}
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            height: Dimensions.get("window").width * 0.8,
                          }}
                        />
                        <Button
                          title="Copiar Código"
                          background={Theme.color.pix}
                          color={Theme.color.gray_10}
                          width={225}
                          height={40}
                          onPress={handleCopy}
                        />
                        <Button
                          title="Voltar"
                          background={Theme.color.primary_80}
                          color={Theme.color.gray_10}
                          width={225}
                          height={40}
                          onPress={() => setShowQrCodeImage(false)}
                        />
                      </ModalBody>
                    ) : (
                      <></>
                    )}
                  </Modal> */}
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
                            <Text className="text-white text-[21px] font-poppinsSemiBold mt-1">
                              Deseja transferir?
                            </Text>
                          </View>
                          <Text className="text-white text-[16px] max-w-[240px] text-center self-center font-poppinsSemiBold mt-1">
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
                    <View className="rounded-2xl overflow-hidden  bg-[#450A88]/80 border-[1px]  w-full  border-primary_100">
                      <BlurView tint="light" intensity={30} className="rounded-2xl  w-full  ">
                        <View className="bg-[#450A88]/80  overflow-hidden w-full   py-3 r relative">
                          <View className="w-[306px] object-cover mt-10 h-[476px] rounded-b-3xl  flex items-center self-center">
                            <ImageBackground
                              source={require('../../../../assets/Purchased/qrCodeBackground.png')}
                              className="w-full h-full flex items-center self-center"
                            >
                              <View className="h-1/2 w-full ">
                                <View className="w-full -mt-10 h-[90%] overflow-hidden  rounded-b-3xl">
                                  <Image
                                    resizeMode="stretch"
                                    resizeMethod="resize"
                                    className="h-full w-[306px] flex items-center justify-center object-cover rounded-b-3xl"
                                    source={{ uri: currentItem?.eventFlyer }}
                                  />
                                </View>

                                <View className="flex mt-2 px-4 flex-row items-center ">
                                  <Text className="  text-[16px] font-poppinsBold mt-1 w-[78%] text-white  ">
                                    {currentItem?.name}
                                  </Text>
                                  <Text className=" ml-auto  text-[12px] text-white font-poppinsRegular text-center ">
                                    {moment(currentItem?.eventDate).format('DD/MM')}
                                  </Text>
                                </View>
                                <Text className=" ml-4 text-[12px] font-poppinsRegular text-white  ">
                                  {currentItem?.eventName}
                                </Text>
                              </View>
                              <View className="h-1/2  w-[80%] items-center  mt-[6px] self-center">
                                <View className="    flex items-center   justify-center">
                                  <View className="z-20  bg-transparent">
                                    <QRCodeStyled
                                      data={JSON.stringify(qrCode)}
                                      className=" bg-white rounded-lg overflow-hidden"
                                      padding={4}
                                      pieceSize={6.6}
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
                        </View>
                        <View className="mt-auto bg-[#450A88]/80 ">
                          <View className="flex flex-row  justify-evenly mt-10 mb-10">
                            <TouchableOpacity
                              className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-12 w-32 rounded-md items-center justify-center flex flex-row "
                              onPress={() => setShow(false)}
                            >
                              <Image
                                source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                                className="left-2 absolute w-5 h-5"
                              />

                              <Text className="text-white text-[12px]  font-poppinsBold mt-1 ">
                                Voltar
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className=" bg-[#FFFFFF]/40 border h-12 border-white rounded-lg  flex flex-row overflow-hidden items-center "
                              onPress={() => handleModify(currentItem, currentIndex)}
                            >
                              <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                              <View className="flex flex-row px-4 py-3 items-center ">
                                <Image
                                  className="h-5 w-5 mr-2  "
                                  source={require('../../../../assets/Global/Icons/infoButton.png')}
                                />
                                <Text className="text-[#290948] text-[12px] font-poppinsBold mt-1">
                                  Como Usar?
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </BlurView>
                    </View>
                  </Modal>
                </>
              ))}
            </View>
          </View>
        </>
      )}
      <TouchableOpacity className="flex-row bg-black text-white border-[0.5px] p-1.5 border-white rounded-lg self-center absolute bottom-4">
        <Image className="" source={require('../../../../assets/Global/Icons/youtubeIcon.png')} />
        <Text1> {''}Dúvidas? Veja esse Rápido Vídeo</Text1>
      </TouchableOpacity>
    </View>
  );
}
