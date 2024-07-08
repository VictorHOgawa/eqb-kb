import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import ActionSheetCity from '../../../Global/ActionSheetCity';
import { useCity } from '../../../../context/selectedCityContext';

interface Props {
  cityId: string;
  setCityId: (id: string) => void;
}
export default function ActionSheetCitySmall({ cityId, setCityId }: Props) {
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
      className="flex mt-2 flex-row justify-between  relative w-[140px]   border-[0.5px] border-white  bg-white  items-center h-10 rounded-lg self-center overflow-hidden mb-5"
    >
      <Image
        className="w-6 h-7     "
        source={require('../../../../../assets/Global/Icons/twoLocationPinPurple.png')}
      />
      <View className=" w-[80px]  flex items-center justify-center flex-row">
        {selectedCity.name === 'Todas as Cidades' ? (
          <Text className="text-[#450A88] text-[11px] text-center font-poppinsSemiBold  self-center ">
            Todas as Cidades
          </Text>
        ) : (
          <>
            <View className=" self-center  flex items-center px-2 justify-center   flex-row">
              <Text
                className="text-[#450A88] text-[11px] font-poppinsSemiBold text-center self-center  "
                numberOfLines={1}
              >
                {selectedCity.name}
              </Text>
            </View>
            <Text className="text-[#450A88] text-[10px] -ml-1 font-poppinsSemiBold  text-center self-center  ">
              - {selectedCity.state}
            </Text>
          </>
        )}
      </View>
      <View className="w-8 h-8 flex items-center justify-center">
        <Image
          className="w-5 h-[11px]     "
          source={require('../../../../../assets/Global/Icons/simplePurpleArrowDown.png')}
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
