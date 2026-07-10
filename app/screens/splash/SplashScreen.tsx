import React, { useCallback, useState } from 'react';
import { View, Image, Alert, ActivityIndicator, Text, Pressable, Modal } from 'react-native';
import { genrateOtpForMyApp, verifyCode } from '../../api/services/otpVerify.service';
import DeviceInfo from 'react-native-device-info';
import { getAppToken } from '../../utils/storage/authStorage';
import { useFocusEffect } from '@react-navigation/native';
import { resetAndNavigate } from '../../utils/NavigationUtils';
import { usePusher } from '../../hooks/usePusher';
import { useAppContext } from '../../context/AppContext';
import { shouldShowDisclaimer, markDisclaimerShown } from '../../storage/disclaimer';

export default function SplashScreen() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const { lang, colors } = useAppContext();


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

  const navigateToHome = () => {
    if (loading) {
      Alert.alert('', lang?.loadingText || 'Loading...');
      return;
    }
    if (error) {
      Alert.alert('', lang?.errorText || error || 'Failed to authenticate app');
      return;
    }
    if (!shouldShowDisclaimer()) {
      setShowDisclaimer(true);
      return;
    }
    resetAndNavigate('Home');
  }

  const onDisclaimerOk = () => {
    markDisclaimerShown();
    setShowDisclaimer(false);
    resetAndNavigate('Home');
  }

  return (
    // <GradientBg enableSafeAreaView={false}>
    <Pressable style={{ flex: 1 }} onPress={navigateToHome}>
      <Image
        source={require('../../assets/images/splash.jpeg')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      {/* Loader at bottom */}

      <View
        style={{
          position: 'absolute',
          bottom: 45,
          width: '100%',
          alignItems: 'flex-end',
          paddingHorizontal: 20,
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
              null

        }
      </View>

      <Modal
        visible={showDisclaimer}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: colors.white,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary, marginBottom: 12, textAlign: 'center' }}>
              {lang?.disclaimerTitle || 'Disclaimer'}
            </Text>
            <Text style={{ fontSize: 16, color: colors.black, lineHeight: 26, marginBottom: 20, textAlign: 'center' }}>
              {lang?.disclaimerText}
            </Text>
            <Pressable
              onPress={onDisclaimerOk}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>
                {lang?.ok || 'OK'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </Pressable>
    // </GradientBg>
  );
}
