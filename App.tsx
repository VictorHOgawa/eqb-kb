import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  DancingScript_400Regular,
  DancingScript_500Medium,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import { LogBox, Platform, StatusBar, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import CartProvider from './src/context/cart';
import SocketProvider from './src/context/socket';
import { Routes } from './src/routes';
import { NativeBaseProvider } from 'native-base';
import { AuthProvider } from './src/context/autenticationContext';
import { CityProvider } from './src/context/selectedCityContext';
import { useFonts } from 'expo-font';
import { CategoryProvider } from './src/context/categoryContext';
import { CategoryTypeProvider } from './src/context/selectedCategoryTypeContext';
import { initialize } from 'react-native-clarity';
import { OneSignal } from 'react-native-onesignal';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

LogBox.ignoreAllLogs(); //Ignore all log notifications
console.error = () => {};
console.warn = () => {};
// const oneSignalAppId =
//   Platform.OS === 'ios'
//     ? '12d3af40-6c6e-414a-97b3-92eeff86371f'
// : '7703eb6d-2210-47c5-8b41-1500b42f96dc';
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  // OneSignal.initialize(oneSignalAppId);
  // OneSignal.Notifications.requestPermission(true);

  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          <NativeBaseProvider>
            <CityProvider>
              <CategoryProvider>
                <CategoryTypeProvider>
                  <Routes />
                </CategoryTypeProvider>
              </CategoryProvider>
            </CityProvider>
          </NativeBaseProvider>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
