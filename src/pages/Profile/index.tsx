import { useEffect, useState } from 'react';
import { LoginValidation } from '../../Components/Global/Login';
import { LoadingIn } from '../../Components/Loading/LoadingIn';
import { Info } from '../../Components/Pages/Profile/Info';
import { loginVerifyAPI } from '../../utils/api';
import PurpleGradient from '../../Components/Global/LinearGradientView/LinearGradient';
import { View } from 'react-native';
import { useAuth } from '../../context/autenticationContext';
export function Profile() {
  const { logged, setLogged } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  async function handleVerify() {
    setLoading(true);
    const verify = await loginVerifyAPI();
    if (verify === 200) {
      setLogged(true);
    } else {
      setLogged(false);
    }
    return setLoading(false);
  }
  useEffect(() => {
    handleVerify();
    setReload(false);
  }, [reload, logged]);

  return (
    <PurpleGradient>
      <View className=" flex-1 ">
        {loading ? (
          <View className="z-50 ">
            <LoadingIn />
          </View>
        ) : (
          <View className="flex-1 ">
            {logged ? (
              <>
                <Info />
              </>
            ) : (
              <View className="z-10 flex-1">
                <LoginValidation reload={() => setReload(true)} />
              </View>
            )}
          </View>
        )}
      </View>
    </PurpleGradient>
  );
}
