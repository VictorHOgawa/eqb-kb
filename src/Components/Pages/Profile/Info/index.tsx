import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Theme from '../../../../styles/themes';
import { Button } from '../../../Global/Button';
import { GlobalTitle } from '../../../Global/Title';
import { Container, Label, NightPremium, NightPremiumImage } from './styles';
import { ModalBody } from '../../Products/styles';
import Modal from 'react-native-modal';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  Text,
  View,
} from 'react-native';
import { VerticalView } from '../../../Global/View/VerticalView';
import { InputForm } from '../../../Global/Forms/FormInput';
import { set, useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import GradientViewMatch from '../../../Global/LinearGradientView/LinearGradientMatch';
import TicketGradient from '../../../Global/LinearGradientView/LinearGradientTicket';
import { NightPeopleChangeDataModal } from '../nightPeopleChangeDataModal';
import { BlurView } from 'expo-blur';
import { TextInput } from 'react-native';
import { useAuth } from '../../../../context/autenticationContext';
import { AuthPutAPI, authGetAPI, getAPI } from '../../../../utils/api';

export function Info() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userMatchFirstPhotoLocation, setUserMatchFirstPhotoLocation] = useState('');
  const [userMatchAge, setUserMatchAge] = useState(null);
  const [userMatchInstagram, setUserMatchInstagram] = useState('');
  const [userMatchBio, setUserMatchBio] = useState('');
  const [userMatchPhotos, setUserMatchPhotos] = useState([]);
  const [userMatchName, setUserMatchName] = useState('');
  const [userMatchId, setUserMatchId] = useState('');
  const { setLogged } = useAuth();
  const { control, handleSubmit } = useForm();
  const navigation = useNavigation<any>();
  const [openNightPeopleChangeModal, setOpenNightPeopleChangeModal] = useState(false);

  async function logOut() {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('@nightapp:userToken');
      await AsyncStorage.removeItem('@nightapp:userRefreshToken');
      setLogged(false);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePress = (link: string) => {
    Linking.openURL(link);
  };
  async function getProfileInfo() {
    const profile = await authGetAPI(`customer/profile`);
    if (profile.status === 200) {
      setUserName(profile.body.customer.name);
      setUserPhone(profile.body.customer.mobilePhone);
      return setLoading(false);
    } else {
    }
  }
  async function getMatchProfileInfo() {
    const matchProfile = await authGetAPI(`match/profile`);
    if (matchProfile.status === 200) {
      setUserMatchAge(matchProfile.body.profile.age);
      const instagramURL = matchProfile.body.profile.instagram;
      if (instagramURL.includes('@')) {
        const instagramUsername = instagramURL.split('@')[1].trim();
        setUserMatchInstagram(instagramUsername);
      } else {
        setUserMatchInstagram(instagramURL);
      }
      setUserMatchFirstPhotoLocation(matchProfile.body.profile.photos[0].imageLocation);
      setUserMatchBio(matchProfile.body.profile.description);
      setUserMatchPhotos(matchProfile.body.profile.photos);
      setUserMatchName(matchProfile.body.profile.name);
      setUserMatchId(matchProfile.body.profile.id);
      return setLoading(false);
    } else {
    }
  }
  useEffect(() => {
    getProfileInfo();
    getMatchProfileInfo();
  }, []);
  async function handleChangeProfile() {
    setLoading(true);
    const profile = await AuthPutAPI(`customer/profile`, {
      name: userName,
      mobilePhone: userPhone,
    });

    if (profile?.status !== 200) {
      Alert.alert('Erro ao atualizar perfil');
      return setLoading(false);
    } else {
      Alert.alert('Perfil atualizado com sucesso!');
      setLoading(false);
      setOpenUpdate(false);
    }
  }
  return (
    <View className="flex items-center w-full">
      <ImageBackground
        className=" w-auto  h-[210px] -mt-2 pt-0 self-center "
        source={require('../../../../../assets/Profile/profileHeader.png')}
      >
        <View className="flex flex-col h-[80%]   self-center w-screen  pt-16 ">
          <View className="w-[90vw] self-center px-4 flex flex-col">
            <View className="flex flex-row  self-center">
              <View className=" flex flex-row w-full ">
                {userMatchFirstPhotoLocation ? (
                  <Image
                    className="w-14 h-14 rounded-full"
                    source={{ uri: userMatchFirstPhotoLocation }}
                  />
                ) : (
                  <Image
                    className="w-14 h-14 rounded-full"
                    source={require('../../../../../assets/Profile/defaultUserImg.png')}
                  />
                )}
                <View className=" flex flex-col self-center ml-2 ">
                  <Text className="text-white font-poppinsSemiBold text-[18px]">{userName}</Text>
                  {userMatchAge && (
                    <Text className="text-white font-poppinsRegular text-[15px]">
                      {userMatchAge}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={logOut} disabled={loading}>
                <Image
                  className="w-6 h-[26px] "
                  source={require('../../../../../assets/Global/Icons/exitIcon.png')}
                />
              </TouchableOpacity>
            </View>
            {userMatchInstagram && (
              <View className="self-end -mr-6 flex flex-row items-center">
                <Text className="text-white font-poppinsRegular">@{userMatchInstagram}</Text>
                <Image
                  className="w-4 ml-1 h-4"
                  source={require('../../../../../assets/Global/instaIcon.png')}
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
      <Image
        className=" w-[81%] -mt-20 self-center h-auto mb-5"
        source={require('../../../../../assets/vipCard.png')}
      />
      <View className=" flex flex-col w-[90%] self-center">
        <TouchableOpacity
          onPress={() => setOpenNightPeopleChangeModal(true)}
          className="  w-[100%] flex flex-row items-center  overflow-hidden  h-16 rounded-md mb-3"
        >
          <TicketGradient />
          <Image
            source={require('../../../../../assets/Global/galeraDaNightNoText.png')}
            className="  ml-1 mr-1 h-8 w-10"
          />
          <Text className="text-white text-[15px] font-poppinsSemiBold">
            Alterar Galera da Night{' '}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="overflow-hidden flex flex-row items-center w-[100%]  h-16 rounded-md mb-3"
          onPress={() => setOpenUpdate(true)}
        >
          <TicketGradient />
          <Image
            source={require('../../../../../assets/Global/profileIcon.png')}
            className="  ml-2 mr-2 h-8 w-8"
          />
          <Text className="text-white text-[15px] font-poppinsSemiBold">
            Meus dados de Cadastro
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="overflow-hidden flex flex-row items-center w-[100%]  h-16 rounded-md mb-3"
          onPress={() => Linking.openURL('https://nightapppoliticasetermos.framer.website/')}
        >
          <TicketGradient />
          <Image
            source={require('../../../../../assets/Global/useTermsIcon.png')}
            className="  ml-2 mr-2 h-8 w-8"
          />
          <Text className="text-white text-[14px] font-poppinsSemiBold">
            Termos de Uso / Política de Privacidade
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="overflow-hidden w-[100%]  h-32 rounded-md mb-3"
          onPress={() => navigation.navigate('Jobs')}
        >
          <TicketGradient />
          <Image
            className="w-full h-full "
            source={require('../../../../../assets/Global/jobsImg.png')}
          />
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={openModal}
        onModalHide={() => setOpenModal(false)}
        onBackButtonPress={() => setOpenModal(false)}
        onBackdropPress={() => setOpenModal(false)}
      >
        <ModalBody style={{ padding: 10, borderRadius: 10 }}>
          <Image
            source={require('../../../../../assets/NightShopCropped.png')}
            style={{ width: '100%', height: 300, borderRadius: 10 }}
            width={310}
            height={300}
          />
          <Button
            title="Instagram"
            background={Theme.color.secondary_100}
            color={Theme.color.gray_10}
            width={180}
            height={40}
            fontSize={18}
            onPress={() => handlePress('https://instagram.com/nightapp_')}
            style={{ zIndex: 20 }}
          />
          <Button
            title="Voltar"
            background={Theme.color.confirmation}
            color={Theme.color.background}
            width={80}
            height={40}
            fontSize={18}
            onPress={() => setOpenModal(false)}
            style={{ zIndex: 20 }}
          />
        </ModalBody>
      </Modal>
      <Modal
        isVisible={openUpdate}
        onModalHide={() => setOpenUpdate(false)}
        onBackButtonPress={() => setOpenUpdate(false)}
        onBackdropPress={() => setOpenUpdate(false)}
      >
        <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
          <BlurView tint="light" intensity={30} className="rounded-2xl">
            <View className="bg-[#450A88]/80 py-3 rounded-2xlrelative px-4">
              <View className=" flex flex-row self-center items-center ">
                <Image
                  className=" w-8 h-8 mr-1"
                  source={require('../../../../../assets/Global/Icons/profileMyData.png')}
                />
                <Text className="font-poppinsSemiBold text-white text-xl mt-5 mb-5">
                  Meus dados de cadastro
                </Text>
              </View>
              <Label>Nome</Label>
              <View className=" flex flex-row border-[0.4px] bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
                <TextInput
                  className=" w-[90%] p-2 text-lg text-white  "
                  value={userName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChange={(e) => {
                    setUserName(e.nativeEvent.text);
                  }}
                />
                <View className=" items-center justify-center w-6 h-6  ml-auto rounded-lg bg-[#450A88]">
                  <Image
                    className="w-[17px] h-3 "
                    source={require('../../../../../assets/Global/Icons/verifiedWhite.png')}
                  />
                </View>
              </View>

              <Label>Número Aqui</Label>
              <View className=" flex flex-row border-[0.4px] bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
                <TextInput
                  className=" w-[90%] p-2 text-lg text-white  "
                  value={userPhone}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChange={(e) => {
                    setUserPhone(e.nativeEvent.text);
                  }}
                />
                <View className=" items-center justify-center w-6 h-6  ml-auto rounded-lg ">
                  <Image
                    className="w-[20px] h-5 "
                    source={require('../../../../../assets/Global/Icons/pencilAndPaper.png')}
                  />
                </View>
              </View>

              <View className="flex flex-row justify-evenly mt-10 mb-10">
                <TouchableOpacity
                  className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                  onPress={() => setOpenUpdate(false)}
                >
                  <Image
                    source={require('../../../../../assets/Global/blurBuyButton.png')}
                    className="-mt-2 -ml-2 absolute w-36 h-14"
                  />
                  <Image
                    className="h-5 w-3 absolute left-3 "
                    source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
                  />
                  <Text className="text-white text-[12px]  font-poppinsBold  mt-1">Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                  onPress={handleChangeProfile}
                  disabled={loading}
                >
                  <Image
                    source={require('../../../../../assets/Global/seeTicketBlur.png')}
                    className="-mt-2 -ml-2 absolute w-[144px] h-[52px] "
                  />
                  <View className="flex flex-row items-center justify-center w-full">
                    <View className="flex flex-row w-full self-center items-center justify-center  ">
                      <Image
                        className="w-7 h-7 absolute left-1"
                        source={require('../../../../../assets/Global/Icons/confirmBlack.png')}
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
      <NightPeopleChangeDataModal
        isVisible={openNightPeopleChangeModal}
        closeModal={() => setOpenNightPeopleChangeModal(false)}
        matchAge={userMatchAge}
        matchInstagram={userMatchInstagram}
        matchBio={userMatchBio}
        matchName={userMatchName}
        matchPhotos={userMatchPhotos}
        matchId={userMatchId}
      />
    </View>
  );
}
