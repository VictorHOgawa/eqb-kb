import { useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  FadeOut,
} from "react-native-reanimated";
import { Logo } from "./styles";
import Theme from "../../../styles/themes";
import PurpleGradient from "../../Global/LinearGradientView/LinearGradient";
import { Image } from "react-native";
import { Platform } from "react-native";
import { View } from "react-native";
export function LoadingIn() {
  // const opacity = useRef(new Animated.Value(0.5));
  // const scale = useRef(new Animated.Value(1));

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(opacity.current, {
  //         toValue: 1,
  //         useNativeDriver: true,
  //         duration: 350,
  //       }),
  //       Animated.timing(scale.current, {
  //         toValue: 1.2,
  //         useNativeDriver: true,
  //         duration: 350,
  //       }),
  //       Animated.timing(opacity.current, {
  //         toValue: 0.5,
  //         useNativeDriver: true,
  //         duration: 350,
  //       }),
  //       Animated.timing(scale.current, {
  //         toValue: 1,
  //         useNativeDriver: true,
  //         duration: 350,
  //       }),
  //     ])
  //   ).start();
  // }, [opacity]);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSpring(1.1, {
        damping: 5,
        stiffness: 10,
        mass: 1,
      }),
      -1, // Repetir infinitamente
      true // Reverter para o estado inicial automaticamente
    );
    opacity.value = withRepeat(
      withSpring(1, {
        damping: 5,
        stiffness: 10,
        mass: 1,
      }),
      -1, // Repetir infinitamente
      true // Reverter para o estado inicial automaticamente
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  const delay = Platform.OS === "ios" ? 2000 : 100;
  return (
    <View className="z-50 w-screen h-[110vh]">
      <Animated.View
        exiting={FadeOut.duration(1000).delay(delay)}
        className="w-screen h-[110vh] absolute z-50"
      >
        <PurpleGradient>
          <Animated.View
            className="w-screen h-[110vh]   flex items-center justify-center"
            style={[animatedStyle]}
          >
            <Image
              className=" w-44 h-44  self-center"
              source={require("../../../../assets/Global/Logo2.png")}
            />
          </Animated.View>
        </PurpleGradient>
      </Animated.View>
    </View>
  );
}
