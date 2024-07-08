import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { LocationName, NoMatches, NoMatchesText } from './styles';

interface MatchProps {
  matches: any;
  setMatches: any;
}

export function Chat({ matches, setMatches }: MatchProps) {
  const navigation = useNavigation<any>();

  return (
    <View className="mt-5">
      <View className="flex flex-col px-4 mb-2">
        <View className="flex flex-row mt-4 = items-center">
          <Image
            className="w-5 h-5 mr-2 "
            source={require('../../../../../assets/Global/Icons/messageIcon.png')}
          />
          <Text
            className="text-white  text-[13px] mt-1 "
            style={{ fontFamily: 'Poppins_500Medium_Italic' }}
          >
            Chat com a Galera da Night
          </Text>
        </View>
        <Text className="text-white font-semibold font-poppinsBold text-[20px]">Mensagens</Text>
      </View>
      {matches.length === 0 && (
        <NoMatches>
          <NoMatchesText>
            Você não iniciou seu “Chat” com a Galera, clique na foto acima e #BoaNight💜
          </NoMatchesText>
        </NoMatches>
      )}
      <View className="w-full h-full">
        {matches.map((item: any) => (
          <>
            <TouchableOpacity
              key={item.id}
              className="flex flex-row border-[1px] items-center h-20 w-[90%] self-center relative border-[#D356F3] bg-[#1E043E]/40 rounded-lg  mb-4 justify-between "
              onPress={() => navigation.navigate('Chat', { id: item.id })}
            >
              <Image
                source={require('../../../../../assets/MyMatches/blur.png')}
                className="w-[110%]  -mt-[8%] -ml-[5%] h-[130%] absolute"
              />

              <Image className="w-14 h-14 m-2 rounded-full" source={{ uri: item.photo }} />
              <View className="flex flex-col rounded- justify-center w-full h-full  ml-1 p-1">
                <Text className="font-poppinsBold text-[19px] text-[#D356F3]">{item.name}</Text>

                <LocationName>
                  {' '}
                  {''}
                  {item.localName}
                </LocationName>
              </View>
              <View className=" flex items-center absolute right-5 top-[35%]">
                {item.messages?.find((message: any) => message.read === false) ? (
                  <Image
                    className="w-8 h-8"
                    source={require('../../../../../assets/MyMatches/Chat1.png')}
                  />
                ) : (
                  <Image
                    className="w-7 h-7"
                    source={require('../../../../../assets/MyMatches/Chat2.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
          </>
        ))}
      </View>
      <View className=" h-28" />
    </View>
  );
}
