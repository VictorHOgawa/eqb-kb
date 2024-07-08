import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Dialog from 'react-native-dialog';
import { RFValue } from 'react-native-responsive-fontsize';
import { BackButton } from '../../Components/Global/Back';
import { Button } from '../../Components/Global/Button';
import { HorizontalView } from '../../Components/Global/View/HorizontalView';
import { VerticalView } from '../../Components/Global/View/VerticalView';
import { useSocket } from '../../context/socket';
import Theme from '../../styles/themes';
import { ActionSheetRef } from 'react-native-actions-sheet';
import Modal from 'react-native-modal';
import { Map, Message, MessageBubble, OpenProfile } from './styles';
import { AuthPostAPI, authDeleteAPI } from '../../utils/api';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import SecuritySheet from '../../Components/Global/ActionSheet';
import { set } from 'react-hook-form';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { ReportMatchModal } from '../../Components/Chat/ReportMatchModal';

export function Chat() {
  const navigation = useNavigation<any>();
  const { socket, socketId, setSocketIsActive, socketError, setSocketError } = useSocket();
  const { id } = useRoute().params as any;
  const [chatData, setChatData] = useState<any>();
  const [currentMessage, setCurrentMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [openUnMatch, setOpenUnMatch] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const handleSendMessage = () => {
    if (socket) {
      if (currentMessage === '') {
        return;
      }
      socket.emit('message', {
        message: currentMessage,
        roomId: id,
        socketId: socketId,
      });
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    setSocketIsActive(true);
    setLoading(true);
    if (socket) {
      socket.on('messageResponse', (data: any) => {
        setChatData(data.match);
      });
      socket.on('findRoom', (data: any) => {
        setChatData(data.match);
      });
      setLoading(false);
    }
  }, [socket]);

  useEffect(() => {
    setLoading(true);
    if (socketError !== '') {
      // navigation.goBack();
    }
    if (socket) {
      socket.emit('connectRoom', {
        id,
      });
      setLoading(false);
    }
  }, [socketId, socketError]);

  const UnMatch = () => {
    Alert.alert(
      'Remover Match',
      'Você tem certeza que deseja remover o Match com essa pessoa?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        { text: 'Sim', onPress: () => confirmUnMatch() },
      ],
      { cancelable: false }
    );
  };

  async function confirmUnMatch() {
    const connect = await authDeleteAPI(`/match/${id}`);
    if (connect.status !== 200) {
      return Alert.alert(connect.body);
    }
    Alert.alert('Match desfeito!');
    return navigation.dispatch(StackActions.replace('MyMatches'));
  }

  async function confirmReport() {
    setReportLoading(true);
    const profileId = chatData?.customers.find((item: any) => item.socketId !== socketId).profileId;
    if (reportReason === '') {
      return Alert.alert('Informe o motivo da denúncia');
    }
    const connect = await AuthPostAPI(`/match/${id}/report`, {
      reason: reportReason,
      profileId: profileId,
    });
    if (connect.status !== 200) {
      setReportLoading(false);
      return Alert.alert(connect.body);
    }
    setReportLoading(false);
    setIsOpenReportModal(false);
    Alert.alert('Denúncia enviada com sucesso!');
    return navigation.dispatch(StackActions.replace('MyMatches'));
  }
  const Report = () => {
    setIsOpenReportModal(true);
  };
  const ReportMessage = (message: string) => {
    setReportReason(message);
  };
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {chatData === undefined && <LoadingIn />}
      <PurpleGradient>
        <View className="flex flex-row w-full items-center  h-28 pt-5  border-[1px]  border-b-white border-r-white border-l-white rounded-b-3xl overflow-hidden ">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ zIndex: 8 }}
            className="  w-8 h-8 z-10 flex ml-4 items-center justify-center rounded-md  overflow-hidden   "
          >
            <Image
              source={require('../../../assets/Match/backgroundBLur.png')}
              className="w-8 h-8 absolute"
            />
            <Image
              className="w-[20px]  h-[18px]"
              source={require('../../../assets/Match/backArrowPurple.png')}
            />
          </TouchableOpacity>

          <Animated.View entering={FadeIn} className="w-[70%] pt-5 h-full flex flex-row">
            <Image
              className="w-12 h-12 mr-2 rounded-full ml-5 "
              source={{
                uri: chatData?.customers.find((item: any) => item.socketId !== socketId).photos[0]
                  .imageLocation,
              }}
            />
            <View className="flex flex-col  w-full">
              <Text className=" text-white text-lg font-poppinsBold">
                {chatData?.customers.find((item: any) => item.socketId !== socketId).name}
              </Text>
              <Text className="text-white text-sm font-poppinsRegular">
                {chatData?.localName && chatData?.localName !== null && chatData?.localName}
              </Text>
            </View>
          </Animated.View>
          <VerticalView
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <OpenProfile
              // onPress={() => setOpen(true)}
              onPress={() => actionSheetRef.current?.show()}
              className=" w-12 h-12 items-center justify-center flex  "
            >
              <Image
                source={require('../../../assets/Global/Icons/shield.png')}
                className="w-[32px] h-9 "
              />
            </OpenProfile>
          </VerticalView>
        </View>

        <Animated.View entering={FadeIn} className="flex-1">
          <View className="flex-1">
            <View className="flex-1 m-b-[20%] px-[10px] overflow-auto ">
              {chatData && chatData.messages && (
                <Map
                  // inverted={true}
                  data={chatData.messages}
                  renderItem={({ item }) => (
                    <MessageBubble status={item.senderSocketId === socketId ? true : false}>
                      <Message status={item.senderSocketId === socketId ? true : false}>
                        {item.content}
                      </Message>
                    </MessageBubble>
                  )}
                />
              )}
            </View>
            <View className=" flex flex-row w-[90%] self-center mb-6 mt-4 h-12 items-center justify-between bg-[#70008D] border-[0.5px] border-white rounded-xl">
              <TextInput
                className="w-[80%] h-full px-4 bg-transparent text-white font-poppinsSemiBold mt-1"
                multiline
                editable
                numberOfLines={3}
                placeholder="Digite uma mensagem..."
                placeholderTextColor={'white'}
                value={currentMessage}
                onChangeText={setCurrentMessage}
              />
              <TouchableOpacity
                className="w-[20%] flex items-center justify-center h-full "
                onPress={handleSendMessage}
              >
                <Text className="text-white font-poppinsSemiBold text-md">Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </PurpleGradient>
      <SecuritySheet ref={actionSheetRef} unMatch={UnMatch} report={Report} />
      <ReportMatchModal
        open={isOpenReportModal}
        setOpen={setIsOpenReportModal}
        setReportMessage={setReportReason}
        report={confirmReport}
        loading={reportLoading}
      />
    </KeyboardAvoidingView>
  );
}
