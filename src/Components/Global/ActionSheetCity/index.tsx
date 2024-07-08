import React, { forwardRef, useEffect, useState } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { ActivityIndicator, TouchableOpacity, View, Image, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAPI } from '../../../utils/api';
import PurpleGradient from '../LinearGradientView/LinearGradient';
import { FlatList } from 'react-native-gesture-handler';

interface CityProps {
  selectedCity: { name: string; state: string; id: string };
  setSelectedCity: (city: { name: string; state: string; id: string }) => void;
}

export const ActionSheetCity = forwardRef<ActionSheetRef, CityProps>((props, ref: any) => {
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([{ name: 'Todas as Cidades', state: '' }]);
  const [preSelectedCity, setPreSelectedCity] = useState(props.selectedCity);
  const [searchValue, setSearchValue] = useState('');

  async function getCities() {
    const connect = await getAPI(`/city?query=${searchValue}&page=1`);
    if (connect.status === 200 && connect.body.cities) {
      setCities([{ name: 'Todas as Cidades', state: '', id: '' }, ...connect.body.cities]);
      setLoading(false);
    }
  }

  useEffect(() => {
    getCities();
  }, [searchValue]);

  const ConfirmSelectCity = () => {
    props.setSelectedCity(preSelectedCity);
    ref.current?.hide();
  };
  return (
    <ActionSheet
      ref={ref}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'transparent',
        //   backgroundColor: "#230743",
      }}
      indicatorStyle={{
        width: 100,
      }}
      gestureEnabled={true}
    >
      <View className="w-full  -mt-3 rounded-3xl">
        <Image
          source={require('../../../../assets/Match/teste4.png')}
          className=" absolute -z-[1] self-center  w-screen h-12   rounded-xl -mt-[17px] "
        />
        <View className="w-full overflow-hidden z-[2000] h-[700px] -mt-3 rounded-t-[32px]">
          <PurpleGradient>
            <View className="p-4">
              <View className=" self-center w-20 h-[6px] bg-[#9493A3] mt-2 rounded-full" />
              <TouchableOpacity onPress={() => ref.current?.hide()}>
                <Image
                  className=" h-6 w-6 -mt-2 "
                  source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                />
              </TouchableOpacity>
              <View className=" flex flex-row gap-2 items-center justify-center max-w-[65%] self-center ">
                <Image
                  className=" h-7 w-6 "
                  source={require('../../../../assets/Global/Icons/twoLocationPin.png')}
                />
                {props.selectedCity.name === 'Todas as Cidades' ? (
                  <Text className="text-white text-lg text-center font-poppinsRegular self-center ">
                    Todas as Cidades
                  </Text>
                ) : (
                  <View className="gap-1 self-center  flex items-center mr-1 flex-row">
                    <Text
                      className="text-white text-lg font-poppinsSemiBold text-center self-center max-w-[85%] "
                      numberOfLines={1}
                    >
                      {props.selectedCity.name}
                    </Text>
                    <Text className="text-white text-lg font-poppinsSemiBold  text-center self-center  ">
                      {' '}
                      - {props.selectedCity.state}
                    </Text>
                  </View>
                )}
                <Image
                  className=" h-[19px] w-7 "
                  source={require('../../../../assets/Global/Icons/twoTriangleDown1.png')}
                />
              </View>
              <View className="flex flex-col px-4">
                <View className="flex flex-row mt-4 items-center">
                  <Image
                    className="w-6 h-6 mr-2 "
                    source={require('../../../../assets/Home/partyIcon.png')}
                  />
                  {preSelectedCity.name === 'Todas as Cidades' ? (
                    <Text
                      style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                      className="text-white  text-[14px]"
                    >
                      Bora sair
                    </Text>
                  ) : (
                    <Text
                      style={{ fontFamily: 'Poppins_400Regular_Italic' }}
                      className="text-white  text-[14px]"
                    >
                      Bora sair em {preSelectedCity.name}
                    </Text>
                  )}
                </View>
                <Text className="text-white font-poppinsSemiBold text-[19px]">
                  Conhecendo novas Nights?
                </Text>
              </View>
              <View className="w-[90%] h-12 flex rounded-md overflow-hidden self-center flex-row   mt-5 mb-5 items-center ">
                <LinearGradient
                  colors={['#9E00F5', '#6325CB']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  className="w-full h-full absolute "
                />
                <TextInput
                  value={searchValue}
                  onChangeText={(text) => setSearchValue(text)}
                  placeholder="Buscar"
                  placeholderTextColor={'white'}
                  className=" w-[90%] self-center font-poppinsRegular rounded-lg px-4 text-lg mt-1.5  text-white "
                />
                <Image
                  className="ml-auto mr-2 w-5 h-5 "
                  source={require('../../../../assets/Global/Icons/lupa.png')}
                />
              </View>
              <View className=" h-[350px] ">
                <FlatList
                  data={cities}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      onPress={() => setPreSelectedCity(item)}
                      className=" w-full m-1 self-center h-12 px-2 rounded-lg bg-[#420A89] flex overflow-hidden items-center justify-center  flex flex-row border-white "
                    >
                      <Text className="text-white text-lg font-poppinsRegular mt-1.5 text-center self-center w-[85%]">
                        {item.name === 'Todas as Cidades'
                          ? 'Todas as Cidades'
                          : `${item.name} - ${item.state}`}
                      </Text>

                      {item.name === preSelectedCity.name && (
                        <Image
                          className="h-3 w-[18px] absolute right-3"
                          source={require('../../../../assets/Global/Icons/verifiedWhite.png')}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View className="flex flex-row justify-evenly mt-10 mb-10">
                <TouchableOpacity
                  onPress={() => ref.current?.hide()}
                  className=" bg-[#C45EEB]/40 border-[1px] relative border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                >
                  <Image
                    source={require('../../../../assets/Global/blurBuyButton.png')}
                    className="-mt-2 -ml-2 absolute w-36 h-14"
                  />
                  <Image
                    className="h-5 w-3 absolute left-3 "
                    source={require('../../../../assets/Global/Icons/simpleBackArrow.png')}
                  />
                  <Text className="text-white text-[12px] mt-1 font-poppinsSemiBold ">Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className=" bg-[#75FB4C]/40 border-[1px] relative border-[#75FB4C] text-white  h-10 w-36 rounded-md items-center justify-center flex flex-row "
                  disabled={loading}
                  onPress={() => ConfirmSelectCity()}
                >
                  <Image
                    source={require('../../../../assets/Global/seeTicketBlur.png')}
                    className="-mt-2 -ml-2 absolute w-[160px] h-[58px] "
                  />
                  <View className="flex flex-row items-center justify-center w-full">
                    <View className="flex flex-row w-full self-center items-center justify-center  ">
                      <Image
                        className="w-7 h-7 "
                        source={require('../../../../assets/Global/Icons/confirmBlack.png')}
                      />
                      <View>
                        {loading ? (
                          <ActivityIndicator color={'#290948'} />
                        ) : (
                          <Text className="text-[#290948] text-[14px] mt-1 font-poppinsSemiBold">
                            Alterar Cidade
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </PurpleGradient>
        </View>
      </View>
    </ActionSheet>
  );
});

export default ActionSheetCity;
