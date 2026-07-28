import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, ToastAndroid, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppContext } from '../../../context/AppContext';

type Step = 'pun' | 'en';

// A message is a list of segments. A segment with `copy` is tappable and
// copies that value to the clipboard when pressed.
type Segment = { text: string; copy?: string };

const EMAIL = 'info@nanaksaramritghar.com';
const PHONE = '+919501004768';

const CONTENT: Record<Step, { title: string; ok: string; body: Segment[] }> = {
  pun: {
    title: 'ਬੇਦਾਅਵਾ',
    ok: 'ਠੀਕ ਹੈ',
    body: [
      { text: 'ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ।।\n\n' },
      {
        text:
          '"ਨਾਨਕਸਰ ਅੰਮ੍ਰਿਤਘਰ" ਐਪ ਅਜੇ ਵੀ ਵਿਕਾਸ ਅਧੀਨ ਹੈ, ਫਿਰ ਵੀ ਤੁਹਾਡੇ ਸਹਿਯੋਗ ਅਤੇ ਕੀਮਤੀ ਸੁਝਾਵਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੇ ਹੋਏ ਅਸੀਂ ਇਸਨੂੰ ਹੁਣ ਜਾਰੀ ਕਰਨ ਦੀ ਤਿਆਰੀ ਵਿਚ ਹਾਂ। ਅਸੀਂ ਪਹਿਲਾਂ ਹੀ ਤੁਹਾਡੇ ਕੋਲੋਂ ਦਿਲੋਂ ਖਿਮਾ ਯਾਚਨਾ ਕਰਦੇ ਹਾਂ ਕਿ ਐਪ ਵਿੱਚ ਕੁਝ ਤਕਨੀਕੀ ਗਲਤੀਆਂ, ਜਾਣਕਾਰੀ ਸੰਬੰਧੀ ਕਮੀਆਂ ਜਾਂ ਹੋਰ ਤਰੁੱਟੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਇਨ੍ਹਾਂ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਨ ਦੀ ਬਜਾਏ ਕੋਈ ਵੀ ਗਲਤੀ, ਕਮੀ, ਸੁਝਾਅ ਜਾਂ ਸੁਧਾਰ ਦੀ ਲੋੜ ਹੋਵੇ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸਾਨੂੰ ',
      },
      { text: EMAIL, copy: EMAIL },
      { text: ' (e-mail) ਰਾਹੀਂ ਜਾਂ ' },
      { text: PHONE, copy: PHONE },
      {
        text:
          ' (ਓਪਰੇਟਰ) ਤੇ ਸੰਪਰਕ ਕਰੋ। ਤੁਹਾਡੇ ਸਹਿਯੋਗ ਅਤੇ ਕੀਮਤੀ ਸੁਝਾਵਾਂ ਲਈ ਅਸੀਂ ਦਿਲੋਂ ਧੰਨਵਾਦੀ ਰਹਾਂਗੇ।\n\n',
      },
      { text: 'ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ।।' },
    ],
  },
  en: {
    title: 'Disclaimer',
    ok: 'OK',
    body: [
      { text: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.\n\n' },
      {
        text:
          'The Nanaksar Amritghar app is still under development. However, keeping your valuable suggestions and continued support in mind, we are now preparing to officially release it. We sincerely apologize in advance for any technical issues, informational inaccuracies, or other shortcomings that you may encounter while using the app. We kindly request that, instead of overlooking such issues, you bring them to our attention either at ',
      },
      { text: EMAIL, copy: EMAIL },
      { text: ' via email or on ' },
      { text: PHONE, copy: PHONE },
      { text: ' (operator). \nWe sincerely thank you for your continued support and encouragement.\n\n' },
      { text: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.' },
    ],
  },
};

type Props = {
  visible: boolean;
  /** Fires after the user confirms the final (English) step. */
  onDone: () => void;
};

/**
 * Two-step disclaimer: shows Punjabi first, then English on OK, then calls
 * onDone. Email and phone are tappable and copy to the clipboard.
 */
export default function DisclaimerModal({ visible, onDone }: Props) {
  const { colors } = useAppContext();
  const [step, setStep] = useState<Step>('pun');

  useEffect(() => {
    if (visible) setStep('pun');
  }, [visible]);

  const current = CONTENT[step];

  const handleOk = () => {
    if (step === 'pun') {
      setStep('en');
    } else {
      onDone();
    }
  };

  const copyToClipboard = (value: string) => {
    Clipboard.setString(value);
    const message = step === 'pun' ? 'ਕਾਪੀ ਹੋ ਗਿਆ' : 'Copied';
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
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
            maxHeight: '80%',
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: 20,
          }}
        >
          {/* <Text allowFontScaling={false}
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            {current.title}
          </Text> */}

          <ScrollView style={{ marginBottom: 20 }} showsVerticalScrollIndicator={false}>
            <Text allowFontScaling={false} style={{ fontSize: 16, color: colors.black, lineHeight: 28, textAlign: 'center' }}>
              {current.body.map((seg, i) =>
                seg.copy ? (
                  <Text allowFontScaling={false}
                    key={i}
                    onPress={() => copyToClipboard(seg.copy as string)}
                    suppressHighlighting
                    style={{ color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' }}
                  >
                    {seg.text}
                  </Text>
                ) : (
                  <Text allowFontScaling={false} key={i}>{seg.text}</Text>
                ),
              )}
            </Text>
          </ScrollView>

          <Pressable
            onPress={handleOk}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text allowFontScaling={false} style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>
              {current.ok}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
