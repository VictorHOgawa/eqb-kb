import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  View,
  Image,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LoginValidation } from '../../Components/Global/Login';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { Chat } from '../../Components/Pages/MyMatches/Chat';
import { Crew } from '../../Components/Pages/MyMatches/Crew';
import { Matched } from '../../Components/Pages/MyMatches/Matched';
import { authGetAPI, loginVerifyAPI } from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useSocket } from '../../context/socket';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { useAuth } from '../../context/autenticationContext';
import { StatusBar } from 'react-native';
import HeaderBar from '../../Components/Global/headerBar';
import Animated, { FadeIn } from 'react-native-reanimated';

export function MyMatches() {
  const { logged, setLogged } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const [setMatches] = useState<any[]>();
  const [matchWithMessages, setMatchWithMessages] = useState<any[]>([]);
  const [matchWithoutMessages, setMatchWithoutMessages] = useState<any[]>([]);
  // const [liked, setLiked] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { socket, socketId, setSocketIsActive, socketError, setSocketError } = useSocket();

  async function handleVerify() {
    const verify = await loginVerifyAPI();
    if (verify === 200) {
      setLogged(true);
      await getMatches();
    } else {
      setLogged(false);
    }
  }

  useEffect(() => {
    handleVerify();
    setReload(false);
  }, [reload, logged]);

  async function getMatches() {
    if (logged) {
      setLoading(true);
      const connect = await authGetAPI('/match/customer/matches');
      if (connect.status !== 200) {
        return Alert.alert('Erro');
      }

      const matchWithoutMessages: any[] = [];
      const matchWithMessages: any[] = [];

      connect.body.match.map((item: any) => {
        if (item.messages.length !== 0) {
          matchWithMessages.push({
            id: item.id,
            messages: item.messages,
            photo: item.customers[0].photos[0].imageLocation,
            name: item.customers[0].name,
            localName: item.localName,
          });
        } else {
          matchWithoutMessages.push({
            id: item.id,
            messages: item.messages,
            photo: item.customers[0].photos[0].imageLocation,
            name: item.customers[0].name,
            localName: item.localName,
          });
        }
      });

      setMatchWithMessages(matchWithMessages);
      setMatchWithoutMessages(matchWithoutMessages);
      setLoading(false);
    }
  }

  // const handlePress = (link: string) => {
  //   Linking.openURL(link);
  // };

  useEffect(() => {
    if (logged) {
      getMatches();
      setSocketIsActive(true);
      if (socket) {
        socket.on('updateScreen', (data: any) => {
          if (data === 'recebeu mensagem') {
          }
        });
      }
      getMatchProfileInfo();
    }
  }, [socket, logged]);

  // const isVisible = useIsFocused();

  // useEffect(() => {
  //   if (isVisible) {
  //     getMatches();
  //   }
  // }, [isVisible]);
  const [userMatchName, setUserMatchName] = useState('');
  async function getMatchProfileInfo() {
    const matchProfile = await authGetAPI(`match/profile`);
    if (logged) {
      if (matchProfile.status === 200) {
        setUserMatchName(matchProfile.body.profile.name);
      }
    }
  }
  return (
    <PurpleGradient>
      <View className="flex-1 ">
        {loading ? (
          <LoadingIn />
        ) : (
          <>
            {/* <Logo source={require("../../../assets/GaleraDaNightLogo.png")} /> */}
            {logged ? (
              <>
                {/* {liked.length > 0 && <Matched liked={liked} />} */}
                {matchWithMessages.length == 0 && matchWithoutMessages.length == 0 ? (
                  <View className="w-screen h-[120vh]  z-[9999]">
                    <PurpleGradient>
                      <Animated.View entering={FadeIn.duration(500)}>
                        <ImageBackground
                          source={require('../../../assets/MyMatches/MatchBg.png')}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <View className="w-[80%] -mt-20">
                            <Image
                              source={require('../../../assets/Global/galeraDaNight1.png')}
                              className="w-72 h-24 self-center "
                            />
                            <Text className="text-white text-xl mt-6 mb-10 text-center font-poppinsRegular">
                              Bora ver quem ta Curtindo a Night hoje?
                            </Text>
                            <Text className="text-white text-[16px] text-center font-poppinsRegular mt-1">
                              Mas antes de tudo você precisa fazer um cadastro para se apresentar
                              pra galera, bora começar com algumas pergunrinhas e vamos agilizar
                              isso pra sua night ser F*da!!
                            </Text>
                            <TouchableOpacity
                              onPress={() => navigation.navigate('MatchRegister')}
                              className="w-60 relative mt-5 bg-[#9D38CD]/60 border border-[#9D38CD] self-center mb-5 h-20 flex flex-row items-center justify-center rounded-lg"
                            >
                              <Text className="text-lg text-white z-20 font-poppinsRegular mt-1 mr-1">
                                {' '}
                                Bora pra #Night{' '}
                              </Text>
                              <Image
                                className="h-[27px] w-6 z-20 "
                                source={require('../../../assets/Global/Icons/styleArrowRight.png')}
                              />
                              <Image
                                className="w-[120%] h-[145%] absolute "
                                source={require('../../../assets/MyMatches/blurStrong.png')}
                              />
                            </TouchableOpacity>
                            {/* <TouchableOpacity className="w-[270px] mt-5 h-10 border-[0.3px] border-white self-center bg-black rounded-lg flex flex-row items-center justify-center">
                              <Image
                                className="w-[33px] absolute left-1 h-5 mr-2"
                                source={require('../../../assets/Global/Icons/youtubeIcon.png')}
                              />
                              <Text className="text-white mt-1 text-[11px] font-poppinsSemiBold">
                                {' '}
                                Dúvidas? Veja esse Rápido Video{' '}
                              </Text>
                            </TouchableOpacity> */}
                          </View>
                        </ImageBackground>
                      </Animated.View>
                    </PurpleGradient>
                  </View>
                ) : (
                  <SafeAreaView
                    style={{
                      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 0 : 0,
                      flex: 1,
                    }}
                  >
                    <ScrollView className="flex   " showsVerticalScrollIndicator={false}>
                      <HeaderBar title={userMatchName} />

                      <Crew matches={matchWithoutMessages} setMatches={setMatches} />
                      <Chat matches={matchWithMessages} setMatches={setMatches} />
                    </ScrollView>
                  </SafeAreaView>
                )}
              </>
            ) : (
              <LoginValidation reload={() => setReload(true)} />
            )}
          </>
        )}
      </View>
    </PurpleGradient>
  );
}

{
  /* <Image
        source={require("../../../assets/NightShop.png")}
        style={{ width: "100%", height: "100%" }}
      />
      <Button
        title="Instagram"
        background={Theme.color.secondary_100}
        color={Theme.color.gray_10}
        width={180}
        height={40}
        fontSize={18}
        onPress={() => handlePress("https://instagram.com/nightapp_")}
        style={{ zIndex: 20, position: "absolute", bottom: "12%" }}
      />
      <Button
        title="Voltar"
        background={Theme.color.confirmation}
        color={Theme.color.background}
        width={80}
        height={40}
        fontSize={18}
        onPress={() => navigation.goBack()}
        style={{ zIndex: 20, position: "absolute", bottom: 0 }}
      /> */
}
