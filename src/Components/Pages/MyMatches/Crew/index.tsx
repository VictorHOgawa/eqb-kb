import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';

import { Popover } from 'native-base';

interface MatchProps {
  matches: any;
  setMatches: any;
}

export function Crew({ matches, setMatches }: MatchProps) {
  const navigation = useNavigation<any>();
  // useEffect(() => {
  //   if (matches) {
  //     setMatches(matches);
  //   }
  // }, [matches]);

  return (
    <View className=" px-4 ">
      <View className="flex flex-col ">
        <View className="flex flex-row  items-center">
          <Image
            className="w-[30px] h-6 mr-2 "
            source={require('../../../../../assets/MyMatches/nightPeoples.png')}
          />
          <Text
            className="text-white  text-[13px] mt-1 "
            style={{ fontFamily: 'Poppins_500Medium_Italic' }}
          >
            Rolou Conexão com essa
          </Text>
        </View>
        <Text className="text-white font-semibold font-poppinsBold text-[20px]">
          Galera da Night
        </Text>
      </View>

      {matches.length === 0 && (
        <View className="items-center text-center justify-center p-2">
          <Text
            className="text-white text-lg self-center text-center "
            style={{ fontFamily: 'Poppins_700Bold' }}
          >
            Opss. Parece que você tem que ir pra #Night se Conectar, tá faltando Match 💜🍻💥
          </Text>
        </View>
      )}
      <FlatList
        className="w-full mt-2  flex flex-row "
        horizontal
        showsHorizontalScrollIndicator={false}
        data={matches}
        renderItem={({ item }) => (
          <View className="flex flex-col mt-4 items-center justify-center">
            <TouchableOpacity
              className="w-[90px] h-[90px] rounded-2xl items-center justify-center overflow-hidden mx-2"
              onPress={() => navigation.navigate('Chat', { id: item.id })}
            >
              <Image className="w-full h-full" source={{ uri: item.photo }} />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              className="mt-2 max-w-[100px] max-h-6  text-white font-poppinsSemiBold text-sm text-center"
            >
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
