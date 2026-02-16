import React, { useEffect, useRef } from "react";
import { View, Animated, Image, Alert } from "react-native";
import { resetAndNavigate } from "../../utils/NavigationUtils";
import GradientBg from "../../componets/backgrounds/GradientBg";
import { genrateOtpForMyApp } from "../../api/services/otpVerify.service";
import DeviceInfo from "react-native-device-info";
import { getAppToken } from "../../utils/storage/authStorage";

export default function SplashScreen({ navigation }: any) {

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const authenticateMyApp = async () => {
      try {
        const uuid = await DeviceInfo.getUniqueId();
        if (!uuid) return;
        const token = await getAppToken();
        if (token) return resetAndNavigate("Home");
        // first sent app id to backend so that its genrate random code for my app
        await genrateOtpForMyApp(uuid);
      } catch (e: any) {
        console.log(e);
        Alert.alert('Error', 'Failed to authenticate app');
      }
    };

    authenticateMyApp();
  }, []);

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loopAnimation.start();


    return () => {

      loopAnimation.stop();
    };
  }, [fadeAnim, navigation]);

  return (
    <GradientBg>
      <View
        className="flex-1 justify-center items-center relative">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={require("../../assets/images/logo.jpeg")}
            className="w-60"
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </GradientBg>
  );
}
