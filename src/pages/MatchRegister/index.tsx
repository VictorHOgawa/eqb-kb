import { Alert, View } from 'react-native';
import { Register } from '../../Components/Pages/MatchRegister/Register';
import { loginVerifyAPI } from '../../utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { useAuth } from '../../context/autenticationContext';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { LoginValidation } from '../../Components/Global/Login';

export function MatchRegister() {
  const { logged, setLogged } = useAuth();
  const navigation = useNavigation<any>();
  const [reload, setReload] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const { id, type } = useRoute().params as any;

  useEffect(() => {
    setTimeout(() => {
      setScreenLoading(false);
    }, 1000);
  }, []);
  async function handleVerify() {
    const verify = await loginVerifyAPI();
    if (verify === 200) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }
  useEffect(() => {
    handleVerify();
    setReload(false);
  }, [reload, logged]);
  return (
    <View className="w-screen h-[120vh]">
      {screenLoading ? (
        <View className="w-screen h-[120vh] ">
          <LoadingIn />
        </View>
      ) : (
        <PurpleGradient>
          {logged ? (
            <Register id={id} type={type} />
          ) : (
            <View className="z-10 flex-1">
              <LoginValidation reload={() => setReload(true)} />
            </View>
          )}
        </PurpleGradient>
      )}
    </View>
  );
}
