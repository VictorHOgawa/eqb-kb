import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { Home } from '../pages/Home';
import { MyMatches } from '../pages/MyMatches';
import { Profile } from '../pages/Profile';
import { Purchased } from '../pages/PurchasedItems';
import { Search } from '../pages/Search';
import Theme from '../styles/themes';

import { BlurView } from 'expo-blur';
import { Image, Text } from 'react-native';
import { Platform } from 'react-native';

// import { Feed } from "../pages/Home/Feed";
// import { MoonButton } from "../Components/Pages/Home/MoonButton";
// import { Profile } from "../pages/Home/Profile/Profile";
// import { NightMatch } from "../pages/Home/Match";
// import { UserItensSelector } from "../pages/Home/UserItens/Home";
// import { Marketplace } from "../pages/Home/Marketplace";
const { Navigator, Screen } = createBottomTabNavigator();
const TabBarBackground = () => {
  return <BlurView style={{ flex: 1 }} intensity={30} tint="dark" />;
};
export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: Theme.color.primary_100,

        tabBarStyle: {
          overflow: 'hidden',
          position: 'absolute',
          left: 10,
          right: 10,
          bottom: Platform.OS === 'ios' ? 40 : 15,
          elevation: 0,
          paddingTop: 10,
          paddingBottom: 6,
          borderColor: '#630C93',
          borderWidth: 1,
          borderTopColor: '#630C93',
          backgroundColor: `rgba(99, 12, 147, 0.6)`, // Cor de fundo da NavBar
          borderRadius: 20,
          padding: 5,
          height: RFValue(65),
        },

        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className="text-white text-sm font-poppinsSemiBold mt-1"
              style={{ opacity: focused == true ? 1 : 0.5 }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              className=" h-8 w-8  "
              style={{ opacity: focused == true ? 1 : 0.5 }}
              source={require('../../assets/NavBar/Home.png')}
            />
          ),
        }}
      />
      <Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className="text-white text-sm font-poppinsSemiBold mt-1"
              style={{ opacity: focused == true ? 1 : 0.5 }}
            >
              Explorar
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              className=" h-8 w-8  "
              style={{ opacity: focused == true ? 1 : 0.5 }}
              source={require('../../assets/NavBar/Search.png')}
            />
          ),
        }}
      />
      <Screen
        name="MyMatches"
        component={MyMatches}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              className=" h-16 w-16 mt-2"
              style={{
                opacity: focused == true ? 1 : 0.5,
              }}
              source={require('../../assets/Global/Icons/moonIcon.png')}
            />
          ),
        }}
      />
      <Screen
        name="Purchased"
        component={Purchased}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className="text-white text-sm font-poppinsSemiBold mt-1"
              style={{ opacity: focused == true ? 1 : 0.5 }}
            >
              Carteira
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              className=" h-10 w-10 mt-2"
              style={{ opacity: focused == true ? 1 : 0.5 }}
              source={require('../../assets/NavBar/Wallet.png')}
            />
          ),
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className="text-white text-sm font-poppinsSemiBold mt-1"
              style={{ opacity: focused == true ? 1 : 0.5 }}
            >
              Perfil
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              className=" h-8 w-[26px] "
              style={{ opacity: focused == true ? 1 : 0.5 }}
              source={require('../../assets/NavBar/Profile.png')}
            />
          ),
        }}
      />
    </Navigator>
  );
}
