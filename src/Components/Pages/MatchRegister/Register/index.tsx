import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Theme from '../../../../styles/themes';
import { BackButton } from '../../../Global/Back';
import { Button } from '../../../Global/Button';
import { LineBreak } from '../../../Global/LineBreak';
import { Tabs } from '../../../Global/Tabs';
import { HorizontalView } from '../../../Global/View/HorizontalView';
import { Form } from '../Form';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthPostAPI } from '../../../../utils/api';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { View } from 'native-base';

interface MatchRegisterProps {
  id: string;
  type: string;
}

export function Register({ id, type }: MatchRegisterProps) {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(1);
  const progress = useSharedValue(0);
  const [screenLoading, setScreenLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [descriptionType, setDescriptionType] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    instagram: '',
    photos: [],
    description: '',
  });
  const handleSteps = () => {
    if (step === 1 && Number(formData.age) < 18) {
      Alert.alert('A Galera da Night é restrita a usuários com 18 anos ou mais.');
      navigation.navigate('Home');
      return;
    }
    if (step === 1 && Number(formData.age) >= 18) {
      setStep(2);
      return;
    }
    if (
      step === 2 &&
      formData.name === '' &&
      formData.description === '' &&
      formData.age === '' &&
      formData.instagram === ''
    ) {
      Alert.alert('Preencha o formulário');
      return;
    }
    if (
      (step === 2 && formData.name === '') ||
      formData.instagram === '' ||
      formData.description === ''
    ) {
      Alert.alert('Finalize o preenchimento do Formulário');
      return;
    }
    if (
      step === 3 &&
      formData.name !== '' &&
      formData.age !== '' &&
      formData.instagram !== '' &&
      formData.photos.length === 0
    ) {
      Alert.alert('Adicione uma Foto');
      return;
    }
    if (
      step === 2 &&
      formData.name !== '' &&
      formData.age !== '' &&
      formData.instagram !== '' &&
      Number(formData.age) >= 18
    ) {
      setStep(3);
    }
    if (
      step === 3 &&
      formData.name !== '' &&
      formData.age !== '' &&
      formData.instagram !== '' &&
      formData.photos.length !== 0 &&
      formData.description === ''
    ) {
      Alert.alert('Adicione uma Descrição, ou selecione um Modelo já pronto');
    }
    if (
      step === 3 &&
      formData.name !== '' &&
      formData.age !== '' &&
      formData.instagram !== '' &&
      formData.photos.length !== 0 &&
      formData.description !== ''
    ) {
      handleMatchRegister();
    }
  };

  const handleBack = () => {
    step === 1
      ? navigation.replace('AppRoutes', { screen: 'Home' })
      : step !== 1 && step !== 3
        ? setStep(step - 1)
        : step === 3 && !open
          ? setStep(step - 1)
          : open
            ? setOpen(false)
            : null;
  };
  async function handleMatchRegister() {
    setLoading(true);
    const modifiedFormData = {
      ...formData,
      age: String(formData.age),
    };
    const connect = await AuthPostAPI('/match/profile', {
      ...modifiedFormData,
    });
    if (connect.status !== 200) {
      setOpen(false);
      return setLoading(false);
    }
    setOpen(false);
    navigation.dispatch(StackActions.replace('Match', { id: id, type: type }));
    return setLoading(false);
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    // Atualiza o valor de progresso quando a etapa mudar
    progress.value = withTiming(step / 4); // Supondo que são 3 etapas
  }, [step]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  useEffect(() => {
    setTimeout(() => {
      setScreenLoading(false);
    }, 1000);
  }, []);
  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View
        className="w-full items-center justify-center p-5 "
        style={{ marginTop: isKeyboardVisible ? '5%' : '10%' }}
      >
        <TouchableOpacity className="absolute top-1 left-2" onPress={handleBack}>
          <MaterialIcons name="chevron-left" size={40} color="#fff" />
        </TouchableOpacity>

        <View className="flex flex-row mt-10 w-full items-center justify-center relative self-center   ">
          <Image
            className="w-16 h-12 absolute left-0  "
            source={require('../../../../../assets/nightPeoples.png')}
          />
          <Animated.View
            entering={FadeIn.duration(600)}
            exiting={FadeOut.duration(200)}
            key={step}
            className={`flex flex-col ${step === 3 ? ' ml-[60px]' : ' ml-[36px]'} items-start `}
          >
            <Text className="text-xl text-white font-poppinsBold">
              {step === 1
                ? 'Qual sua idade?'
                : step === 3
                  ? 'Como você quer ser visto?'
                  : 'Conta mais sobre você!'}
            </Text>
            <Text className="text-sm text-white w-[250px] text-start font-poppinsRegular">
              {step === 1
                ? 'Confirme sua idade e bora pro próximo passo.'
                : step === 3
                  ? 'Escolha suas melhores fotos para arrasar no perfil'
                  : 'Aqui é o espaço para falar o que te faz único(a).'}
            </Text>
          </Animated.View>
        </View>
        <View className="w-[70%] mt-2 h-2 bg-white rounded-sm overflow-hidden ">
          <Animated.View style={[progressStyle]} className="h-2 bg-[#9D38CD] rounded-sm" />
        </View>
        <Form
          step={step}
          formData={formData}
          setFormData={setFormData}
          open={open}
          setOpen={setOpen}
          descriptionType={descriptionType}
          setDescriptionType={setDescriptionType}
          handleMatchRegister={handleMatchRegister}
          loading={loading}
          setLoading={setLoading}
        />
        <TouchableOpacity
          onPress={handleSteps}
          disabled={step === 3 && loading}
          className="w-96 h-36 scale-75 -mt-10 relative"
        >
          <ImageBackground
            className="w-full h-full  absolute"
            source={require('../../../../../assets/MyMatches/purpleMathButton.png')}
          >
            <View className="w-80 h-20 m-8 relative flex items-center justify-center flex-row">
              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <>
                  <Text className="text-white font-poppinsSemiBold mt-1 text-2xl">
                    {' '}
                    {step === 3 ? 'Finalizar' : 'Próximo'}{' '}
                  </Text>
                  {step !== 3 && (
                    <Image
                      source={require('../../../../../assets/Global/Icons/nextArrow.png')}
                      className="w-4 h-7  absolute right-8 "
                    />
                  )}
                </>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <LineBreak />
      </View>
    </TouchableWithoutFeedback>
  );
}
