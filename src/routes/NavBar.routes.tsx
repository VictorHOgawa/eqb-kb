import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text } from "react-native";

import { Home } from "../pages/Home";
import { MyMatches } from "../pages/MyMatches";
import { Profile } from "../pages/Profile";
import { Purchased } from "../pages/PurchasedItems";
import { Search } from "../pages/Search";
import { CustomTabBar } from "./CustomTabBar"; // Certifique-se de que o caminho está correto

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-white text-sm font-poppins -mt-[1px]  font-semibold" ${
                focused ? "opacity-100" : "opacity-50"
              }`}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => ({
            source: require("../../assets/NavBar/Home.png"),
            style: {
              opacity: focused ? 1 : 0.5,
              width: 32,
              height: 33,
            },
          }),
        }}
      />
      <Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-white text-sm font-poppins  font-semibold" ${
                focused ? "opacity-100" : "opacity-50"
              }`}
            >
              Explorar
            </Text>
          ),
          tabBarIcon: ({ focused }) => ({
            source: require("../../assets/NavBar/Search.png"),
            style: {
              opacity: focused ? 1 : 0.5,
              width: 32,
              height: 32,
            },
          }),
        }}
      />
      <Screen
        name="MyMatches"
        component={MyMatches}
        options={{
          tabBarIcon: ({ focused }) => ({
            source: require("../../assets/Global/Icons/moonIcon.png"),
            style: {
              opacity: focused ? 1 : 0.5,
              width: 64,
              height: 64,
            },
          }),
        }}
      />
      <Screen
        name="Purchased"
        component={Purchased}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-white text-sm font-poppins -mt-[3.47px]  font-semibold" ${
                focused ? "opacity-100" : "opacity-50"
              }`}
            >
              Carteira
            </Text>
          ),
          tabBarIcon: ({ focused }) => ({
            source: require("../../assets/NavBar/Wallet.png"),
            style: {
              opacity: focused ? 1 : 0.5,
              width: 32,

              height: 35.47,
            },
          }),
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`text-white text-sm font-poppins  font-semibold" ${
                focused ? "opacity-100" : "opacity-50"
              }`}
            >
              Perfil
            </Text>
          ),
          tabBarIcon: ({ focused }) => ({
            source: require("../../assets/NavBar/Profile.png"),
            style: {
              opacity: focused ? 1 : 0.5,
              width: 26,
              height: 32,
            },
          }),
        }}
      />
    </Navigator>
  );
}
