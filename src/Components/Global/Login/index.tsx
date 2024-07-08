import { useNavigation } from '@react-navigation/native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useForm } from 'react-hook-form';

import { maskCpfCnpj } from '../../../utils/masks';
import { PostAPI } from '../../../utils/api';
import { storageToken } from '../../../utils/tokenManagement';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { BounceIn, FadeIn, FadeOut, StretchInX } from 'react-native-reanimated';

import { KeyboardAvoidingView } from 'react-native';
import { LoginInput } from './inputs';
import { StatusBar } from 'react-native';
import { maskCPF } from '../../../utils/mask';
import { validateCpf } from '../../../utils/CpfValidate';
import { validatePhone } from '../../../utils/NumberValidate';
import { validatePassword } from '../../../utils/validatePassWord';

interface Props {
  reload: () => void;
}

export function LoginValidation({ reload }: Props) {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const navigation = useNavigation<any>();

  const { control: loginControl, handleSubmit: handleLoginSubmit } = useForm();

  const { control: registerControl, handleSubmit: handleRegisterSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  async function handleLogin(formData: any) {
    setLoading(true);
    formData.cpfCnpj = maskCPF(formData.cpfCnpj);
    try {
      const connect = await PostAPI('/customer/authenticate', formData);
      connect.body;
      if (connect.status !== 200) {
        setErrorMessage(connect.body.message);
        // Alert.alert("Erro", connect.body);
        setLoading(false);
        if (connect.body.error.message === 'Email ou senha inválidos.') {
          setErrorMessage('Email ou senha inválidos.');
        }
      } else {
        await storageToken(connect.body);
        reload();
      }
    } catch (error: any) {
      Alert.alert('Erro ao conectar', error.message);
      setLoading(false);
    }
  }

  const [register, setRegister] = useState(false);
  const handleRegister = async (formData: any) => {
    setLoading1(true);
    const request = await requestTrackingPermissionsAsync();
    if (request.status !== 'granted' && !request.canAskAgain) {
      Alert.alert(
        'Rastreamento de dados',
        'Para criar conta é necessário permitir o rastreamento de dados',
        [{ text: 'Cancelar' }, { text: 'OK', onPress: () => Linking.openSettings() }]
      );
      return setLoading(false);
    }

    setLoading1(true);
    try {
      setLoading1(true);
      handlePostRegister(formData);
    } finally {
      setLoading1(false);
    }
  };

  function parseError(response: any, formData: any) {
    const essentialFields = ['name', 'mobilePhone', 'password', 'cpfCnpj'];
    const fieldNames: any = {
      name: 'Nome',
      mobilePhone: 'Telefone',
      password: 'Senha',
      cpfCnpj: 'CPF',
    };

    // Debug: Log para verificar quais campos estão sendo considerados vazios

    const blankFields: any = essentialFields.filter(
      (field: any) => !formData[field] || formData[field].trim() === ''
    );

    if (blankFields.length > 0) {
      const friendlyNames = blankFields.map((field: any) => fieldNames[field]);
      return `Você deixou campos em branco: ${friendlyNames.join(', ')}.`;
    }

    if (!formData.mobilePhone || !validatePhone(formData.mobilePhone)) {
      return 'Número de telefone inválido';
    }

    if (!formData.cpfCnpj || !validateCpf(formData.cpfCnpj)) {
      return 'CPF inválido.';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      return passwordError;
    }

    if (response && response.message === 'Validation failed' && response.errors.length > 0) {
      return response.errors[0].message;
    }
    if (response.message === 'Já existe uma conta com o telefone informado.') {
      return response.message;
    }
    if (response.error === 'Bad Request') return 'Cpf ou senha inválidos';
  }

  async function handlePostRegister(formData: any) {
    setLoading(true);
    const initialError = parseError({}, formData);
    // if (initialError) {
    //   setErrorMessage(initialError); // Define a mensagem de erro
    //   setLoading(false);
    //   return;
    // }

    try {
      const connect = await PostAPI('/customer/register', formData);
      if (connect.status !== 200) {
        const errorMessages = parseError(connect.body, formData);
        setErrorMessage(errorMessages); // Define a mensagem de erro
        setLoading(false);
        return;
      }
      await storageToken(connect.body);
      reload();
    } catch (error: any) {
      console.error('Erro ao registrar', error.message);
      setLoading(false);
    }
  }
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const inputRef: any = useRef(null);

  const SetStepTwo = () => {
    setErrorMessage('');
    setRegister(!register);
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'transparent',
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 0 : 0,
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        className="flex-1 "
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={-140}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex z-50"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View
            entering={FadeIn.delay(300)}
            className="pb-40"
            key={register ? 'firstStep' : 'secondStep'}
          >
            {!register ? (
              <View className="w-[80%]  rounded-lg self-center p-4 mt-0">
                <Image
                  className="self-center"
                  source={require('../../../../assets/Global/LogoWithBackground.png')}
                />
                <View className="flex flex-row mt-10 mb-2">
                  <Image
                    source={require('../../../../assets/Global/Icons/newUserIcon.png')}
                    className="w-[13px] h-4  mr-2 ml-2"
                  />
                  <Text className="text-white font-poppinsRegular">Insira seu CPF:</Text>
                </View>

                <LoginInput
                  control={loginControl}
                  name="cpfCnpj"
                  placeholder="CPF/CNPJ"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                />
                <View className="flex flex-row mt-5 mb-2">
                  <Image
                    source={require('../../../../assets/Global/Icons/newUserIcon.png')}
                    className="w-[13px] h-4  mr-2 ml-2"
                  />
                  <Text className="text-white font-poppinsRegular">Senha:</Text>
                </View>
                <LoginInput
                  control={loginControl}
                  name="password"
                  placeholder="Senha"
                  secureTextEntry={true} // Inicia com a senha ocultada
                  keyboardType="default"
                />
                {/* 
                <View className="w-full mt-1 flex flex-row items-center justify-end">
                  <Text className="text-white text-[11px] font-poppinsRegular">
                    Esqueci a minha Senha!
                  </Text>
                  <TouchableOpacity>
                    <Text className=" ml-1 text-[#C45EEB] text-[11px] font-poppinsRegular">
                      Clique Aqui{' '}
                    </Text>
                  </TouchableOpacity>
                </View> */}
                <View className="mt-4 h-5 self-center">
                  {errorMessage === 'Email ou senha inválidos.' && (
                    <Text className="text-red-500 text-[14px]">Cpf ou Senha inválidos</Text>
                  )}
                  {errorMessage === 'Validation failed' && (
                    <Text className="text-red-500 text-[14px]">Cpf ou Senha inválidos</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleLoginSubmit(handleLogin)}
                  disabled={loading}
                  className="self-center -mt-2  flex"
                >
                  <ImageBackground
                    source={require('../../../../assets/greenButtonBlur.png')}
                    className="w-[320px] flex flex-row items-center px-12 h-28  "
                    resizeMode="cover"
                    resizeMethod="scale"
                  >
                    <Image
                      source={require('../../../../assets/Global/Icons/enterButtonIcon.png')}
                      className="w-[29px] h-8"
                    />
                    {loading ? (
                      <ActivityIndicator
                        size={'small'}
                        className="ml-20 self-center"
                        color={'#290948'}
                      />
                    ) : (
                      <Text className="justify-self-center text-center text-xl ml-4 text-[#290948] font-poppinsBold mt-1">
                        Acessar Agora
                      </Text>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity className="self-center  flex" onPress={SetStepTwo}>
                  <ImageBackground
                    source={require('../../../../assets/purpleButtonBlur.png')}
                    className="w-[250px]  h-[90px] flex flex-row items-center px-10   "
                    resizeMode="cover"
                    resizeMethod="scale"
                  >
                    <Image
                      source={require('../../../../assets/Global/Icons/signUpButton.png')}
                      className="w-6 h-6"
                    />
                    <View className="flex ml-2 flex-col">
                      <Text className="text-[#290948] text-md"> Nao tem Cadastro? </Text>
                      <Text className="text-[#290948] text-center text-md font-poppinsBold mt-1">
                        Clique aqui
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-[80%]  rounded-lg self-center p-4 mt-0">
                <Image
                  className="self-center w-32 h-32"
                  source={require('../../../../assets/Global/LogoWithBackground.png')}
                />
                <View className="flex flex-row mt-5 mb-2">
                  <Image
                    source={require('../../../../assets/Global/Icons/newUserIcon.png')}
                    className="w-[13px] h-4  mr-2 ml-2"
                  />
                  <Text className="text-white font-poppinsRegular ">Insira seu Nome:</Text>
                </View>
                <LoginInput
                  control={registerControl}
                  name="name"
                  placeholder="Nome"
                  autoCapitalize="words"
                  autoCorrect={false}
                />

                <View className="flex flex-row mt-2 mb-2">
                  <Image
                    source={require('../../../../assets/Global/Icons/newUserIcon.png')}
                    className="w-[13px] h-4  mr-2 ml-2"
                  />
                  <Text className="text-white font-poppinsRegular">Insira seu Telefone:</Text>
                </View>
                <LoginInput
                  control={registerControl}
                  name="mobilePhone"
                  keyboardType="numeric"
                  placeholder="Telefone"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View className="flex flex-row mt-2 mb-2">
                  <Image
                    source={require('../../../../assets/Global/Icons/newUserIcon.png')}
                    className="w-[13px] h-4  mr-2 ml-2"
                  />
                  <Text className="text-white font-poppinsRegular">Insira seu CPF:</Text>
                </View>
                <LoginInput
                  control={registerControl}
                  name="cpfCnpj"
                  keyboardType="numeric"
                  placeholder="CPF/CNPJ"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View className="flex flex-row mt-2 mb-2">
                  <Image
                    source={require('../../../../assets/Global/Icons/newUserIcon.png')}
                    className="w-[13px] h-4  mr-2 ml-2"
                  />
                  <Text className="text-white font-poppinsRegular">Senha:</Text>
                </View>
                <LoginInput
                  control={registerControl}
                  name="password"
                  placeholder="Senha"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true} // Assumindo que LoginInput pode lidar com esta propriedade
                />
                <View className="mt-4 h-9 self-center">
                  {errorMessage && <Text className="text-red-500 text-[14px]">{errorMessage}</Text>}
                </View>

                <TouchableOpacity
                  onPress={handleRegisterSubmit(handleRegister)}
                  disabled={loading}
                  className="self-center  flex"
                >
                  <ImageBackground
                    source={require('../../../../assets/greenButtonBlur.png')}
                    className="w-[320px] flex flex-row  items-center px-12 h-28  "
                    resizeMode="cover"
                    resizeMethod="scale"
                  >
                    <Image
                      source={require('../../../../assets/Global/Icons/enterButtonIcon.png')}
                      className="w-[29px] h-8"
                    />
                    {loading1 ? (
                      <View className="flex  w-[160px] z-[9999] self-center ">
                        <ActivityIndicator
                          className="self-center z-[9999]"
                          size={'small'}
                          color={'#290948'}
                        />
                      </View>
                    ) : (
                      <Text className="justify-self-center  text-center text-2xl ml-8 text-[#290948] font-poppinsBold mt-1">
                        Cadastrar
                      </Text>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  className="self-center  flex"
                  onPress={() => setRegister(!register)}
                >
                  <ImageBackground
                    source={require('../../../../assets/purpleButtonBlur.png')}
                    className="w-[250px]  h-[90px] flex flex-row items-center px-10   "
                    resizeMode="cover"
                    resizeMethod="scale"
                  >
                    <Image
                      source={require('../../../../assets/Global/Icons/signUpButton.png')}
                      className="w-6 h-6"
                    />
                    <View className="flex ml-2 flex-col">
                      <Text className="text-[#290948] text-center text-md">Já tem cadastro?</Text>
                      <Text className="text-[#290948] text-center  text-md font-poppinsBold mt-1">
                        {' '}
                        Clique aqui
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
