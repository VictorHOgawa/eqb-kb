import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Platform, Keyboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const totalIcons = 5;
  const [loadedIcons, setLoadedIcons] = useState(0);

  const handleIconLoad = () => {
    setLoadedIcons((prev) => prev + 1);
  };

  const translateY = useSharedValue(60); // Inicia fora da tela
  const opacity = useSharedValue(0);
  useEffect(() => {
    if (loadedIcons === totalIcons) {
      translateY.value = withTiming(0, { duration: 1000 }); // Animação para surgir de baixo
      opacity.value = withTiming(1, { duration: 1000 }); // Animação de fade
    }
  }, [loadedIcons, totalIcons]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });
  const Delay = Platform.OS === 'ios' ? 0 : 1000;
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      translateY.value = withTiming(100, { duration: 300 }); // Subir a navbar
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      translateY.value = withTiming(0, { duration: 300 }); // Descer a navbar
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Animated.View
      className={`absolute left-2.5 right-2.5 ${
        Platform.OS === 'ios' ? 'bottom-10' : 'bottom-5'
      } border-2 border-[#630C93]   overflow-hidden bg-[#630C93]/90 rounded-xl h-[77px] flex-row items-center justify-around`}
      style={animatedStyle}
    >
      <BlurView tint="dark" intensity={40} className="w-full h-full flex flex-row">
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              className="flex-1 items-center justify-center"
            >
              <Image
                source={options.tabBarIcon(isFocused).source}
                onLoad={handleIconLoad}
                style={{
                  opacity: isFocused ? 1 : 0.5,
                  marginTop: options.tabBarIcon({ focused: isFocused }).style.marginTop || 0,
                  width: options.tabBarIcon({ focused: isFocused }).style.width || 30,
                  height: options.tabBarIcon({ focused: isFocused }).style.height || 30,
                }}
              />
              {options.tabBarLabel && typeof options.tabBarLabel === 'function'
                ? options.tabBarLabel({ focused: isFocused })
                : route.name !== 'MyMatches' && (
                    <Text
                      className={`text-white font-poppinsRegular mt-1 ${isFocused ? 'opacity-100' : 'opacity-50'}`}
                    >
                      {route.name}
                    </Text>
                  )}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </Animated.View>
  );
};
