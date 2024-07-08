import { BlurView } from 'expo-blur';
import { set } from 'react-hook-form';
import { ActivityIndicator, Alert, Image } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { TextInput } from 'react-native';
interface ReportMatchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  setReportMessage: (message: string) => void;
  report: () => void;
}
export function ReportMatchModal({
  open,
  setOpen,
  setReportMessage,
  loading,
  report,
}: ReportMatchModalProps) {
  const navigation = useNavigation<any>();

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
                source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
              />
            </TouchableOpacity>
            <Image
              source={require('../../../assets/Global/Logo2.png')}
              className="w-28 h-24 self-center"
            />
            <View className="flex flex-row justify-center mt-4 items-center">
              <Text className="text-white text-[15px] max-w-[90%] text-center font-poppinsSemiBold">
                Descreva o motivo da denuncia para que possamos analisar e tomar as devidas medidas
                de segurança.
              </Text>
            </View>
            <View className="flex mt-4 flex-row h-20 p-2 items-center bg-[#9C5EEB] rounded-lg w-[90%] self-center">
              <Image
                className="h-5 w-5 mr-2 selection:"
                source={require('../../../assets/Global/Icons/flag.png')}
              />
              <TextInput
                className=" rounded-lg h-full w-[88%] text-white text-lg"
                placeholder="Descreva o motivo da denuncia"
                multiline
                onChangeText={(text) => setReportMessage(text)}
              />
            </View>
            <View className="flex flex-row justify-evenly mt-10 mb-10">
              <TouchableOpacity
                className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-12 w-32 rounded-md items-center justify-center flex flex-row "
                onPress={() => setOpen(false)}
              >
                <Image
                  source={require('../../../assets/Global/blurBuyButton.png')}
                  className="-mt-2 -ml-2 absolute w-36 h-14"
                />
                <Image
                  className="h-5 w-5 mr-2  "
                  source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
                />
                <Text className="text-white text-[13px]  font-semibold">Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" bg-[#FFFFFF]/40 border h-12 w-36 border-white rounded-lg justify-center  flex flex-row overflow-hidden items-center "
                disabled={loading}
                onPress={() => report()}
              >
                {loading ? (
                  <ActivityIndicator size={'small'} color={'#290948'} />
                ) : (
                  <>
                    <View className="absolute w-full h-full bg-[#FFFFFF]/40" />
                    <View className="flex flex-row px-4 py-3 items-center ">
                      <Image
                        className="h-6 w-[22px] mr-2  "
                        source={require('../../../assets/Global/Icons/reportShield.png')}
                      />
                      <View>
                        <Text className="text-[#290948] text-sm font-poppinsBold">Confirmar</Text>
                        <Text className="text-[#290948] text-sm font-poppinsBold">Denuncia</Text>
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
