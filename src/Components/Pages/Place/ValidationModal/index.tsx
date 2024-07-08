import { BlurView } from 'expo-blur';
import { set } from 'react-hook-form';
import { ActivityIndicator, Alert, Image } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { AuthPostAPI, authGetAPI } from '../../../../utils/api';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
interface ValidationModalProps {
  open: boolean;
  id: string;
  setOpen: (open: boolean) => void;
}
export function ValidationModal({ open, setOpen, id }: ValidationModalProps) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  async function getLocalization() {
    setLoading(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      Alert.alert(
        'Permissão negada',
        'Precisamos de permissão para acessar sua localização para verificar se você está no estabelecimento.'
      );
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      // Construir o payload com as coordenadas
      const locationPayload = {
        latitude: latitude,
        longitude: longitude,
      };

      const connectValidation = await AuthPostAPI(`match/place/presence/${id}`, {
        latitude: locationPayload.latitude,
        longitude: locationPayload.longitude,
      });

      if (connectValidation.status === 200) {
        setLoading(false);
        navigation.navigate('Match', { id: id, type: 'place' });
      } else {
        setLoading(false);
        Alert.alert('Erro de Localização', 'Parece que você não está no estabelecimento.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro de Localização', 'Não foi possível obter a localização.');
    }
  }

  return (
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
                source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
              />
            </TouchableOpacity>
            <Image
              source={require('../../../../../assets/Global/Logo2.png')}
              className="w-28 h-24 self-center"
            />
            <View className="flex flex-row justify-center mt-4 items-center">
              <Text className="text-white text-[15px] max-w-[90%] text-center font-poppinsSemiBold">
                Ops! Par ver a Galera da Night nesse estabelecimento preciso confirmar que você está
                no local.
              </Text>
            </View>

            <View className="flex flex-row justify-evenly mt-10 mb-10">
              <TouchableOpacity
                className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-12 w-32 rounded-md items-center justify-center flex flex-row "
                onPress={() => setOpen(false)}
              >
                <Image
                  source={require('../../../../../assets/Global/blurBuyButton.png')}
                  className="-mt-2 -ml-2 absolute w-36 h-14"
                />
                <Image
                  className="h-5 w-5 mr-2  "
                  source={require('../../../../../assets/Global/Icons/simpleBackArrow.png')}
                />
                <Text className="text-white text-[13px]  font-semibold">Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" bg-[#FFFFFF]/40 border h-12 w-36 border-white rounded-lg justify-center  flex flex-row overflow-hidden items-center "
                disabled={loading}
                onPress={() => getLocalization()}
              >
                {loading ? (
                  <ActivityIndicator size={'small'} color={'#290948'} />
                ) : (
                  <>
                    <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                    <View className="flex flex-row px-4 py-3 items-center ">
                      <Image
                        className="h-6 w-5 mr-2  "
                        source={require('../../../../../assets/Global/Icons/twoLocationPinPurple.png')}
                      />
                      <View>
                        <Text className="text-[#290948] text-sm font-poppinsBold">Confirmar</Text>
                        <Text className="text-[#290948] text-sm font-poppinsBold">Localização</Text>
                      </View>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
