import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import ActionSheetCity from '../ActionSheetCity';
import { getAPI } from '../../../utils/api';
import { useCity } from '../../../context/selectedCityContext';

interface Props {
  cityId: string;
  setCityId: (id: string) => void;
}
export default function ActionSheetCityButton({ cityId, setCityId }: Props) {
  const { selectedCity, setSelectedCity } = useCity();
  const actionSheetCity = useRef<any>();
  async function showActionSheetCity() {
    actionSheetCity.current.show();
  }
  useEffect(() => {
    setCityId(selectedCity.id);
  }, [selectedCity]);

  return (
    <TouchableOpacity
      onPress={() => showActionSheetCity()}
      className="flex mt-4 flex-row justify-between  relative w-[205px]  border-[0.5px] border-white  bg-[#1E043E]  items-center h-8 rounded-xl self-center overflow-hidden mb-5"
    >
      <Image
        className="w-8 h-8  rounded-xl   "
        source={require('../../../../assets/MyMatches/myMatchNameLogo1.png')}
      />
      <View className=" w-[128px]  flex items-center justify-center flex-row">
        {selectedCity.name === 'Todas as Cidades' ? (
          <Text className="text-white text-[14px] text-center font-poppinsSemiBold mt-1  self-center ">
            Todas as Cidades
          </Text>
        ) : (
          <>
            <View className=" self-center  flex items-center px-2 justify-center   flex-row">
              <Text
                className="text-white text-[14px]  font-poppinsSemiBold mt-1 text-center self-center  "
                numberOfLines={1}
              >
                {selectedCity.name}
              </Text>
            </View>
            <Text className="text-white text-[12px] -ml-1 font-poppinsSemiBold mt-1  text-center self-center  ">
              - {selectedCity.state}
            </Text>
          </>
        )}
      </View>
      <View className="w-8 h-8 flex items-center justify-center">
        <Image
          className="w-[14px] h-5    rounded-xl "
          source={require('../../../../assets/Global/Icons/locationPinHD.png')}
        />
      </View>
      <ActionSheetCity
        ref={actionSheetCity}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
    </TouchableOpacity>
  );
}
