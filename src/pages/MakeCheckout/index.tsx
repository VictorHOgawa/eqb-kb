import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Image, ScrollView, View } from 'react-native';
import { LineBreak } from '../../Components/Global/LineBreak';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { IndividualMethod } from '../../Components/Pages/Checkout/IndividualMethod';
import { Method } from '../../Components/Pages/Checkout/Method';
import { Title } from '../../Components/Pages/Checkout/Title';
import { Total } from '../../Components/Pages/Checkout/Total';
import { useCart } from '../../context/cart';
import { AuthPostAPI, loginVerifyAPI } from '../../utils/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Theme from '../../styles/themes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { Text } from 'react-native';
import { useAuth } from '../../context/autenticationContext';
import { set } from 'react-hook-form';
import { LoginValidation } from '../../Components/Global/Login';

export function Checkout() {
  const { cart } = useCart();
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState('Pix');
  const { logged, setLogged } = useAuth();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<any>();
  const [coupon, setCoupon] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [QrCode, setQrCode] = useState(false);
  const [pix, setPix] = useState<any>();
  const [installment, setInstallment] = useState('');
  const [installments, setInstallments] = useState<any>(['']);
  const [installmentCount, setInstallmentCount] = useState(1);

  async function handleVerify() {
    setLoading(true);
    try {
      const verify = await loginVerifyAPI();

      if (verify !== 200) {
        Alert.alert('Realize o Login antes de Prosseguir');
        setLogged(false);
        setReload(false);
        setLoading(false);
        return; // Finaliza a função aqui
      }
      setLogged(true);

      setInstallment(
        `${cart.installments[0].installmentNumber} x RS ${cart.installments[0].value}`
      );
      setInstallments([
        'Voltar',
        ...cart.installments.map((item: any) => `${item.installmentNumber} x R$ ${item.value}`),
      ]);
      setLogged(true);
      setReload(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTotal(cart);
  }, []);

  useEffect(() => {
    handleVerify();
    setReload(false);
  }, [reload, logged]);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (QrCode) {
          // Exibir uma mensagem pode ajudar a confirmar que o bloqueio está funcionando
          Alert.alert('Retorno bloqueado', 'Você não pode voltar nesta etapa do processo.');
          return true; // Isso impede o comportamento padrão do botão de retorno
        }
        // Permitir o comportamento padrão de voltar quando QrCode não está ativo
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [QrCode]) // Dependências que, quando alteradas, reativam o efeito
  );
  return (
    <PurpleGradient>
      <View className=" flex-1 ">
        {loading ? (
          <View className="z-50 ">
            <LoadingIn />
          </View>
        ) : (
          <>
            <ScrollView className="flex-1 ">
              {logged ? (
                <View className={`flex-1 pt-10 px-4 relative pb-5`}>
                  <TouchableOpacity
                    className={`w-8 h-7 ml-4 flex items-center justify-center ${QrCode && 'opacity-0'}`}
                    disabled={QrCode}
                    onPress={() => navigation.goBack()}
                  >
                    <Image
                      className=" w-5 h-[18px] mt-2 "
                      source={require('../../../assets/Global/Icons/simpleBackArrow.png')}
                    />
                  </TouchableOpacity>

                  <View className=" flex flex-row relative -mt-6 items-center self-center -ml-2">
                    <Image
                      source={require('../../../assets/Checkout/paymentIcon.png')}
                      className="  h-5 w-[21px] mr-2 self-center "
                    />
                    <Text className="text-2xl font-poppinsBold text-white"> Pagamento</Text>
                  </View>
                  <Text className="text-white text-xl font-poppinsRegular mt-5">
                    {' '}
                    1. Escolha forma de Pagamento:
                  </Text>
                  <Method
                    isGeneratedQrCode={QrCode}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <IndividualMethod
                    selected={selected}
                    coupon={coupon}
                    setCoupon={setCoupon}
                    loadingCoupon={loadingCoupon}
                    QrCode={QrCode}
                    setQrCode={setQrCode}
                    pix={pix}
                    setPix={setPix}
                    installment={installment}
                    setInstallment={setInstallment}
                    installments={installments}
                    setInstallments={setInstallments}
                    installmentCount={installmentCount}
                    setInstallmentCount={setInstallmentCount}
                  />

                  <Total selected={selected} total={total} loading={loading} />
                  <Image
                    className="w-[60%] self-center  h-8"
                    source={require('../../../assets/Checkout/SafeCheckout.png')}
                  />
                </View>
              ) : (
                <View className="z-10 flex-1">
                  <LoginValidation reload={() => setReload(true)} />
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </PurpleGradient>
  );
}
