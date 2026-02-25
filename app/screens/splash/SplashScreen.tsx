import React, { useCallback, useRef, useState } from "react";
import { View, Animated, Image, Alert, ActivityIndicator } from "react-native";
import GradientBg from "../../componets/backgrounds/GradientBg";
import { genrateOtpForMyApp } from "../../api/services/otpVerify.service";
import DeviceInfo from "react-native-device-info";
import { getAppToken } from "../../utils/storage/authStorage";
import { Easing } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      startAnimation();

      return () => {
        // Optional cleanup if needed
        // stopAnimation();
      };
    }, [])
  );

  const startAnimation = () => {
    // 1️⃣ Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(async () => {
      // 2️⃣ After fade in complete → start auth
      await authenticateMyApp();
    });
  };

  const authenticateMyApp = async () => {
    try {

      setLoading(true);

      const uuid = await DeviceInfo.getUniqueId();
      if (!uuid) return;

      const token = await getAppToken();

      if (token) {
        // 3️⃣ Fade Out after auth
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        });
      }
      await genrateOtpForMyApp(uuid);
    } catch (e: any) {
      console.log(e,'ee');
      
      Alert.alert("Error", "Failed to authenticate app");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <GradientBg>
      <View style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <Image
            source={require("../../assets/images/splash.jpeg")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Loader at bottom */}
          {loading && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                alignItems: "center",

              }}
            >
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
        </Animated.View>
      </View>
    </GradientBg>
  );
}
