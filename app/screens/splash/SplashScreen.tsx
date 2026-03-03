import React, { useCallback, useRef, useState } from 'react';
import { View, Animated, Image, Alert, ActivityIndicator, Text } from 'react-native';
import { genrateOtpForMyApp, verifyCode } from '../../api/services/otpVerify.service';
import DeviceInfo from 'react-native-device-info';
import { getAppToken } from '../../utils/storage/authStorage';
import { Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { resetAndNavigate } from '../../utils/NavigationUtils';
import { Button } from '@ant-design/react-native';
import { usePusher } from '../../hooks/usePusher';

export default function SplashScreen() {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = useCallback(async (data: any) => {
    try {
      if (!data) return;

      const code = data?.code || '';
      const uuid = await DeviceInfo.getUniqueId();
      const res = await verifyCode(code, uuid);

      if (!res) {
        throw new Error('Failed to authenticate app');
      }

      setLoading(false); // OTP verified, stop animation and navigate to Home
      setError(null);
    } catch (e: any) {
      setLoading(false);
      setError(e.message || 'Failed to authenticate app! Please restart the app.');
      Alert.alert(
        'Error',
        e.message || 'Failed to authenticate app! Please restart the app.',
      );
    }
  }, []);

  usePusher('', verifyOtp);

  useFocusEffect(
    useCallback(() => {
      authenticateMyApp();

      return () => {
        // Optional cleanup if needed
        // stopAnimation();
      };
    }, []),
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

  const stopAnimation = () => {
    resetAndNavigate('Home');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Optional: Navigate to another screen after fade out
      // resetAndNavigate('Home');

    });
  };

  const authenticateMyApp = async () => {
    try {
      setLoading(true);
      setError(null);
      const uuid = await DeviceInfo.getUniqueId();
      if (!uuid) throw new Error('Failed to get device ID');
      const token = await getAppToken();
      if (!token) {
        setLoading(false);
        setError(null);
        return;
      }
      await genrateOtpForMyApp(uuid);
    } catch (e: any) {
      setError(e.message || 'Failed to authenticate app');
      setLoading(false);
      Alert.alert('Error', e.message || 'Failed to authenticate app');
    } finally {
      // setLoading(false);
    }
  };

  return (
    // <GradientBg enableSafeAreaView={false}>
    <View style={{ flex: 1, backgroundColor: '#BE8400' }}>
      <Image
        source={require('../../assets/images/splash.jpeg')}
        style={{ width: '100%', height: '80%' }}
        resizeMode="contain"
      />
      {/* Loader at bottom */}

      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {
          loading ?
            <ActivityIndicator size="large" color="#ffffff" />
            :
            error ?
              <Text style={{ color: 'red', fontSize: 18, marginBottom: 20, textAlign: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
                {error}
              </Text>
              :
              <Button
                style={{ backgroundColor: '#ffffff', paddingHorizontal: 30, borderRadius: 25 }}
                size="large"
                loading={loading}
                onPress={() => stopAnimation()}
              >
                Start App
              </Button>

        }
      </View>

    </View>
    // </GradientBg>
  );
}
