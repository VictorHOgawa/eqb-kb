import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Theme from '../../../../styles/themes';
import { Button } from '../../../Global/Button';
import { GlobalTitle } from '../../../Global/Title';

import { ModalBody } from '../../Products/styles';
import Modal from 'react-native-modal';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Text,
  TextInput,
  View,
} from 'react-native';
import { VerticalView } from '../../../Global/View/VerticalView';
import { InputForm } from '../../../Global/Forms/FormInput';
import { useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import GradientViewMatch from '../../../Global/LinearGradientView/LinearGradientMatch';
import TicketGradient from '../../../Global/LinearGradientView/LinearGradientTicket';
import { BlurView } from 'expo-blur';
import { AuthPutAPI } from '../../../../utils/api';
import { Alert } from 'react-native';

interface NightPeopleChangeDataModalProps {
  isVisible: boolean;
  closeModal: () => void;
  matchName: string;
  matchInstagram: string;
  matchBio: string;
  matchAge: any;
  matchPhotos: any;
  matchId: string;
}

export function NightPeopleChangeDataModal({
  isVisible,
  closeModal,
  matchName,
  matchInstagram,
  matchBio,
  matchAge,
  matchPhotos,
  matchId,
}: NightPeopleChangeDataModalProps) {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();
  const [name, setName] = useState(matchName);
  const [instagram, setInstagram] = useState(matchInstagram);
  const [bio, setBio] = useState(matchBio);
  const [age, setAge] = useState(matchAge);
  useEffect(() => {
    if (
      matchName !== name ||
      matchInstagram !== instagram ||
      matchBio !== bio ||
      matchAge !== age
    ) {
      setName(matchName);
      setInstagram(matchInstagram);
      setBio(matchBio);
      setAge(matchAge);
    }
  }, [matchName, matchInstagram, matchBio, matchAge]);
  async function handleChangeMatchProfile() {
    setLoading(true);
    const profile = await AuthPutAPI(`match/profile/${matchId}`, {
      name: name,
      instagram: instagram,
      description: bio,
      age: age,
    });

    if (profile?.status !== 200) {
      Alert.alert('Erro ao atualizar perfil');
      return setLoading(false);
    } else {
      Alert.alert('Perfil atualizado com sucesso!');
      setLoading(false);
      closeModal();
    }
  }
  return (
    <Modal
      isVisible={isVisible}
      onModalHide={closeModal}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
    >
      <View className="rounded-2xl overflow-hidden border-[1px] z-90 border-primary_100">
        <BlurView tint="light" intensity={30} className="rounded-2xl">
          <View className="bg-[#450A88]/80 py-3 rounded-2xlrelative px-4">
            <View className=" flex flex-row self-center items-center ">
              <Image
                className=" w-10 h-8 mr-1 mt-2"
                source={require('../../../../../assets/Global/galeraDaNightNoText.png')}
              />
              <Text className="font-poppinsSemiBold text-white text-xl mt-5 mb-5">
                Alterar Galera da Night
              </Text>
            </View>
            <View className="flex flex-row items-center mt-4 mb-2 ">
              <Image
                className="w-4 h-5 mr-1"
                source={require('../../../../../assets/Global/Icons/profile1.png')}
              />
              <Text className="text-white font-poppinsSemiBold">Alterar seu Nome</Text>
            </View>

            <View className=" flex flex-row border-[0.4px] bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
              <TextInput
                className="  p-2 text-lg text-white font-poppinsRegular w-full "
                placeholder="Nome"
                value={name}
                onChangeText={(e: any) => setName(e)}
                placeholderTextColor={Theme.color.gray_30}
              />
              <View className=" items-center justify-center w-6 h-6  ml-auto rounded-lg bg-[#450A88]">
                <Image
                  className="w-[17px] h-3 "
                  source={require('../../../../../assets/Global/Icons/verifiedWhite.png')}
                />
              </View>
            </View>
            <View className=" flex flex-row justify-between">
              <View className="flex flex-col w-[55%]">
                <View className="flex flex-row items-center mt-4 mb-2 ">
                  <Image
                    className="w-5 h-5 mr-1"
                    source={require('../../../../../assets/Global/Icons/instagramWhite.png')}
                  />
                  <Text className="text-white text-[13px] font-poppinsSemiBold">
                    Alterar seu Instagram
                  </Text>
                </View>
                <View className=" flex flex-row border-[0.4px] h-14  bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
                  <TextInput
                    className="  p-2 text-lg font-poppinsRegular text-white w-[90%] "
                    placeholderTextColor={Theme.color.gray_30}
                    value={instagram}
                    onChangeText={(e: any) => setInstagram(e)}
                    placeholder="@SeuInsta"
                  />
                  <Image
                    className="w-5 h-5 ml-auto"
                    source={require('../../../../../assets/Global/Icons/pencilAndPaper.png')}
                  />
                </View>
              </View>
              <View className="flex flex-col w-[42%]">
                <View className="flex flex-row items-center mt-4 mb-2 ">
                  <Image
                    className="w-5 h-5 mr-1"
                    source={require('../../../../../assets/Global/Icons/circleWithFlagInside.png')}
                  />
                  <Text className="text-white font-poppinsSemiBold">Alterar Idade</Text>
                </View>
                <View className=" flex flex-row border-[0.4px] h-14  bg-[#D356F3] border-white p-2 text-lg text-white rounded-md items-center ">
                  <TextInput
                    className=" font-poppinsRegular p-2 text-lg text-white w-[90%] "
                    placeholderTextColor={Theme.color.gray_30}
                    placeholder="18"
                    onChangeText={(e: any) => setAge(e)}
                    value={age}
                  />
                  <Image
                    className="w-5 h-5 ml-auto"
                    source={require('../../../../../assets/Global/Icons/pencilAndPaper.png')}
                  />
                </View>
              </View>
            </View>
            <View className="flex flex-row items-center mt-4 mb-2 ">
              <Image
                className="w-5 h-5 mr-1 "
                source={require('../../../../../assets/Global/Icons/nightBio.png')}
              />
              <Text className="text-white font-poppinsSemiBold">
                Alterar Bio do Galera da Night
              </Text>
            </View>
            <View className="flex border-[0.4px] h-24 bg-[#D356F3] border-white p-2 text-lg text-white rounded-md">
              <TextInput
                className="p-2 text-lg font-poppinsRegular text-white w-[90%]"
                placeholderTextColor={Theme.color.gray_30}
                placeholder="Descreva um pouco sobre você"
                value={bio}
                onChangeText={(e: any) => setBio(e)}
                multiline={true}
                numberOfLines={3} // Ajuste conforme necessário
                textAlign="left"
              />
              <Image
                className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2" // Posiciona a imagem à direita com centralização vertical
                source={require('../../../../../assets/Global/Icons/pencilAndPaper.png')}
              />
            </View>
            <View className="flex flex-row justify-evenly mt-10 mb-10">
              <TouchableOpacity
                className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                onPress={closeModal}
              >
                <Image
                  source={require('../../../../../assets/Global/blurBuyButton.png')}
                  className="-mt-2 -ml-2 absolute w-36 h-14"
                />
                <Image
                  className="h-5 w-3 absolute left-3 "
                  source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
                />
                <Text className="text-white text-[12px]  font-poppinsBold mt-1 ">Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                onPress={() => handleChangeMatchProfile()}
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
  );
}
