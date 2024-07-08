import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ad } from '../../../Components/Global/Ad';
import { Button } from '../../../Components/Global/Button';
import { Header } from '../../../Components/Global/Header';
import { More } from '../../../Components/Global/More';
import { Scanner } from '../../../Components/Global/Scanner';
import { GlobalTitle } from '../../../Components/Global/Title';
import { HorizontalView } from '../../../Components/Global/View/HorizontalView';
import { VerticalView } from '../../../Components/Global/View/VerticalView';
import { LoadingIn } from '../../../Components/Loading/LoadingIn';
import Theme from '../../../styles/themes';
import { AuthPostAPI, authGetAPI } from '../../../utils/api';
import PurpleGradient from '../../../Components/Global/LinearGradientView/LinearGradient';
import { ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'react-native';

export function Portaria() {
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [registerCode, setRegisterCode] = useState('');
  const [openScanner, setOpenScanner] = useState(false);
  const [qrCodeInfo, setQrCodeInfo] = useState<any>({ type: '', data: '' });
  const [verifyTicket, setVerifyTicket] = useState(false);
  const [receivedInfo, setReceivedInfo] = useState<any>();
  const [scanned, setScanned] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [loading1, setLoading1] = useState(false);

  async function getJobs() {
    setLoading(true);
    const connect = await authGetAPI('/customer/work');
    if (connect.status !== 200) {
      alert(connect.body.customerWork);
      return setLoading(false);
    }

    setJobs(connect.body.customerWork);
    return setLoading(false);
  }

  const handleClick = async () => {
    setLoading(true);
    const connect = await AuthPostAPI(`/customer/work/`, { registerCode });

    if (connect.status !== 200) {
      return setLoading(false);
    }

    navigation.replace('Jobs');
    return setLoading(false);
  };

  async function sendQrCode(qrCode: any) {
    const formattedQrCode = JSON.parse(qrCode);
    setScanLoading(true);
    const connect = await AuthPostAPI(`/customer/work/qrCode`, {
      type: formattedQrCode.type,
      qrCode: formattedQrCode.id,
    });
    if (connect.status !== 200) {
      setScanned(false);
      Alert.alert(
        'Erro na Leitura',
        connect.body.message,
        [
          {
            text: 'OK',
            onPress: () => setScanLoading(false),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    setScanLoading(false);

    setReceivedInfo(connect.body);
    return setVerifyTicket(true);
  }

  async function Approve() {
    setScanLoading(true);
    setLoading1(true);
    const formattedQrCode = JSON.parse(qrCodeInfo.data);
    const connect = await AuthPostAPI(`/customer/work/validate`, {
      type: formattedQrCode.type,
      qrCode: formattedQrCode.id,
    });
    if (connect.status !== 200) {
      Alert.alert(
        'Erro na Leitura',
        connect.body.message,
        [
          {
            text: 'OK',
            onPress: () => setScanLoading(false),
          },
        ],
        { cancelable: false }
      );
      setLoading1(false);
    }
    Alert.alert(receivedInfo.type === 'ticket' ? 'Ingresso Liberado' : 'Produto Liberado');
    setScanned(false);
    setScanLoading(false);
    setVerifyTicket(false);
    return setLoading1(false);
  }

  const handleBack = () => {
    setVerifyTicket(false);
    setScanned(false);
  };

  async function handleOpenScanner() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert(
        'Permissão Negada',
        'Ops! Nós precisamos do acesso a Câmera para ler o QRCode',
        [
          {
            text: 'Cancelar',
          },
          {
            text: 'Dar permissão',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }

    setOpenScanner(true);
  }

  useEffect(() => {
    getJobs();
  }, []);
  return (
    <>
      <View className="flex-1">
        <PurpleGradient>
          {loading ? (
            <LoadingIn />
          ) : (
            <>
              <View className="p-4">
                <Header />
              </View>
              <View className="flex">
                <Ad />
              </View>
              <View className="p-4">
                <Text className=" mt-40 text-2xl text-white font-poppinsRegular">
                  Jobs - Portaria
                </Text>
                {jobs.length === 0 ? (
                  <Text
                    className="font-poppinsRegular"
                    style={{
                      color: Theme.color.primary_100,
                      padding: 20,
                      alignSelf: 'center',
                      fontFamily: Theme.fonts.Poppins.Regular,
                      fontSize: RFValue(18),
                    }}
                  >
                    Nenhum Job encontrado
                  </Text>
                ) : (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={jobs}
                    renderItem={({ item }) => (
                      <View className="bg-secondary_100 rounded-[10px] py-2.5 px-1 mt-[2%] w-[95%] self-center">
                        <HorizontalView style={{ alignItems: 'center' }}>
                          <Image
                            className="w-[80px] h-[80px] rounded-md object-cover"
                            source={{ uri: item.image }}
                          />
                          <VerticalView style={{ marginLeft: '5%' }}>
                            <Text className="font-poppinsRegular text-white w-[70%] ">
                              {item.name}
                            </Text>
                            <Text className="text-white font-poppinsRegular">
                              <Image
                                className="w-3 h-3"
                                source={require('../../../../assets/Global/Icons/clockIcon.png')}
                              />
                              <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                                {''} {moment(item.date).format('DD/MM/YYYY')}
                              </Text>{' '}
                              às {item.time}
                            </Text>
                            <Text className="text-white font-poppinsRegular">
                              <Image
                                className="w-3 h-3"
                                source={require('../../../../assets/Global/Icons/pinIcon.png')}
                              />
                              <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                                {''} {item.local}
                              </Text>
                            </Text>
                          </VerticalView>
                        </HorizontalView>
                        <TouchableOpacity
                          className=" bg-[#75FB4C]/40 border-[1px] self-center mt-5 scale-[110%] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                          onPress={handleOpenScanner}
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
                                  <Text className="text-[#290948] text-[12px] font-poppinsBold">
                                    Ler QrCode
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <Modal
                          isVisible={openScanner}
                          coverScreen={true}
                          style={{ overflow: 'hidden', margin: 0 }}
                          onModalHide={() => setOpenScanner(false)}
                          onBackdropPress={() => setOpenScanner(false)}
                          onBackButtonPress={() => setOpenScanner(false)}
                        >
                          <Scanner
                            setScanLoading={setScanLoading}
                            handleScan={(item: any) => sendQrCode(item)}
                            openScanner={openScanner}
                            setOpenScanner={setOpenScanner}
                            qrCodeInfo={qrCodeInfo}
                            scanLoading={scanLoading}
                            setQrCodeInfo={setQrCodeInfo}
                            scanned={scanned}
                            setScanned={setScanned}
                          />
                          <Modal
                            isVisible={verifyTicket}
                            style={{ padding: 1 }}
                            onModalHide={() => setVerifyTicket(false)}
                            onBackButtonPress={handleBack}
                            onBackdropPress={handleBack}
                          >
                            <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
                              <BlurView tint="light" intensity={30} className="rounded-2xl">
                                <View className="bg-[#450A88]/80 py-3 rounded-2xl items-center p-4 relative">
                                  {receivedInfo ? (
                                    <>
                                      {receivedInfo.type === 'ticket' ? (
                                        <>
                                          <Image
                                            className="w-[100px] h-[100px] rounded-[10px]"
                                            source={{
                                              uri: receivedInfo.customerItem.eventFlyer,
                                            }}
                                          />
                                          <Text className="text-2xl font-poppinsRegular mt-4 text-white">
                                            {receivedInfo.customerItem.eventName}
                                          </Text>
                                          {/* <Names style={{ marginTop: "2%" }}>
                                    {receivedInfo.item.user.name}
                                  </Names> */}
                                          <View className="flex mt-4 mb-4 flex-row w-full">
                                            <Image
                                              className="w-[30px] h-[30px]"
                                              source={require('../../../../assets/Global/Icons/ticketIcon.png')}
                                            />
                                            <Text className="text-xl self-start text-white font-poppinsRegular">
                                              {''} {receivedInfo.customerItem.name}
                                            </Text>
                                          </View>
                                        </>
                                      ) : (
                                        <></>
                                        // <>
                                        //   <HorizontalView
                                        //     style={{
                                        //       justifyContent: "space-evenly",
                                        //       width: "100%",
                                        //     }}
                                        //   >
                                        //     <EventPhoto
                                        //       source={{
                                        //         uri: receivedInfo.item.event
                                        //           .photo_location,
                                        //       }}
                                        //     />
                                        //     <EventPhoto
                                        //       source={{
                                        //         uri: receivedInfo.item.product
                                        //           .photo_location,
                                        //       }}
                                        //     />
                                        //   </HorizontalView>
                                        //   <Names
                                        //     style={{
                                        //       fontSize: RFValue(18),
                                        //       color: Theme.color.primary_80,
                                        //     }}
                                        //   >
                                        //     {receivedInfo.item.event.name}
                                        //   </Names>
                                        //   <HorizontalView>
                                        //     <Names
                                        //       style={{
                                        //         fontSize: RFValue(18),
                                        //         color: Theme.color.primary_80,
                                        //       }}
                                        //     >
                                        //       Produto: {""}
                                        //     </Names>
                                        //     <Names>
                                        //       {receivedInfo.item.product.name}
                                        //     </Names>
                                        //   </HorizontalView>
                                        //   <Names style={{ marginTop: "2%" }}>
                                        //     {receivedInfo.item.user.name}
                                        //   </Names>
                                        // </>
                                      )}
                                      <VerticalView
                                        style={{
                                          alignItems: 'start',
                                          width: '100%',
                                          marginTop: '5%',
                                        }}
                                      >
                                        <HorizontalView
                                          style={{
                                            alignItems: 'center',
                                            width: '100%',
                                          }}
                                        >
                                          <Image
                                            className="w-3 h-3"
                                            source={require('../../../../assets/Global/Icons/clockIcon.png')}
                                          />
                                          <Text className="text-white font-poppinsRegular">
                                            {''}{' '}
                                            {moment(receivedInfo.customerItem.date).format(
                                              'DD/MM/YYYY'
                                            )}{' '}
                                            às {receivedInfo.customerItem.time}
                                          </Text>
                                        </HorizontalView>
                                        <HorizontalView
                                          style={{
                                            alignItems: 'center',
                                            width: '100%',
                                          }}
                                        >
                                          <Image
                                            className="w-3 h-3"
                                            source={require('../../../../assets/Global/Icons/pinIcon.png')}
                                          />
                                          <Text className="text-white font-poppinsRegular">
                                            {''} {receivedInfo.customerItem.eventLocal}{' '}
                                            {receivedInfo.customerItem.eventCity} /{' '}
                                            {receivedInfo.customerItem.eventState}
                                          </Text>
                                        </HorizontalView>
                                      </VerticalView>
                                      <HorizontalView
                                        style={{
                                          justifyContent: 'space-evenly',
                                          width: '100%',
                                        }}
                                      >
                                        <View className="flex w-full flex-row justify-between mt-10 mb-10">
                                          <TouchableOpacity
                                            className=" bg-[#C45EEB]/40 border-[1px] scale-[110%] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                                            onPress={handleBack}
                                          >
                                            <Image
                                              source={require('../../../../assets/Global/blurBuyButton.png')}
                                              className="-mt-2 -ml-2 absolute w-36 h-14"
                                            />
                                            <Image
                                              className="h-5 w-3 absolute left-3 "
                                              source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                                            />
                                            <Text className="text-white text-[12px] font-poppinsBold">
                                              Voltar
                                            </Text>
                                          </TouchableOpacity>

                                          <TouchableOpacity
                                            className=" bg-[#75FB4C]/40 border-[1px] scale-[110%] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                                            onPress={Approve}
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
                                                    <Text className="text-[#290948] text-[12px] font-poppinsBold">
                                                      Aprovar
                                                    </Text>
                                                  )}
                                                </View>
                                              </View>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      </HorizontalView>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </View>
                              </BlurView>
                            </View>
                          </Modal>
                        </Modal>
                      </View>
                    )}
                  />
                )}
              </View>
              <TouchableOpacity className=" flex-row bg-black text-white border border-white rounded-[10px] py-1 px-2.5 self-center absolute bottom-5 items-center justify-center">
                <Image
                  className="w-3 h-3 "
                  source={require('../../../../assets/Global/Icons/youtubeIcon.png')}
                />
                <Text className="text-white font-poppinsRegular">
                  {' '}
                  {''}Dúvidas? Veja esse Rápido Vídeo
                </Text>
              </TouchableOpacity>

              <More
                style={{ bottom: '2%' }}
                type={'portaria'}
                handleClick={handleClick}
                portariaCode={registerCode}
                setPortariaCode={setRegisterCode}
              />
            </>
          )}
        </PurpleGradient>
      </View>
    </>
  );
}
