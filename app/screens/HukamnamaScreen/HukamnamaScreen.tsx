import React from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../componets/elements/AppText/AppText';
import AppLoader from '../../componets/Loader/AppLoader';
import ScreenHeaders from '../../componets/headers/ScreenHeaders';
import { useHukamnama } from '../../hooks/query/useHukamnama';
import { useAppContext } from '../../context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DATE_LABELS: Record<string, string> = {
  sangrandh: 'ਸੰਗਰਾਂਦ',
  puranmashi: 'ਪੂਰਨਮਾਸ਼ੀ',
  dasmi: 'ਦਸਮੀ',
  masya: 'ਮੱਸਿਆ',
  punchmi: 'ਪੰਚਮੀ',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '________';
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate();
  const months = [
    'ਜਨਵਰੀ', 'ਫਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ',
    'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ',
  ];
  return `${day} ${months[date.getMonth()]}`;
}

export default function HukamnamaScreen() {
  const { data, isLoading, isError } = useHukamnama();
  const { lang } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeaders title={lang.hukamnama} isShowFontSize={true} />

      {isLoading && <AppLoader />}

      {isError && (
        <View style={styles.centerMessage}>
          <AppText size={16} style={{ color: '#666' }}>
            Could not load Hukamnama. Please try again later.
          </AppText>
        </View>
      )}

      {!isLoading && !isError && !data?.result && (
        <View style={styles.centerMessage}>
          <AppText size={16} style={{ color: '#666' }}>
            No Hukamnama available for today.
          </AppText>
        </View>
      )}

      {!isLoading && data?.result && (
        <View style={styles.content}>
          <ImageBackground
            source={require('../../assets/images/hukamnama_screen_cleaned.png')}
            style={styles.frameImage}
            resizeMode="stretch"
          >
            {/* Scrollable verse text */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {data.result.map((item: any, index: number) => (
                <AppText
                  key={item.id || index}
                  size={18}
                  style={styles.verseText}
                >
                  {item.text}
                </AppText>
              ))}
            </ScrollView>

            {/* Dates panel inside the frame at the bottom */}
            {data.hukamnama && (
              <View style={styles.datesContainer}>
                {/* Row 1: ਸੰਗਰਾਂਦ centered */}
                <View style={styles.dateRowCenter}>
                  <AppText size={13} style={styles.dateLabel}>
                    ਸੰਗਰਾਂਦ — {formatDate(data.hukamnama.sangrandh)}
                  </AppText>
                </View>
                {/* Row 2: ਪੂਰਨਮਾਸ਼ੀ (left)  ਦਸਮੀ (right) */}
                <View style={styles.dateRow}>
                  <AppText size={13} style={styles.dateLabel}>
                    ਪੂਰਨਮਾਸ਼ੀ — {formatDate(data.hukamnama.puranmashi)}
                  </AppText>
                  <AppText size={13} style={styles.dateLabel}>
                    ਦਸਮੀ — {formatDate(data.hukamnama.dasmi)}
                  </AppText>
                </View>
                {/* Row 3: ਮੱਸਿਆ (left)  ਪੰਚਮੀ (right) */}
                <View style={styles.dateRow}>
                  <AppText size={13} style={styles.dateLabel}>
                    ਮੱਸਿਆ — {formatDate(data.hukamnama.masya)}
                  </AppText>
                  <AppText size={13} style={styles.dateLabel}>
                    ਪੰਚਮੀ — {formatDate(data.hukamnama.punchmi)}
                  </AppText>
                </View>
              </View>
            )}
          </ImageBackground>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  centerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  frameImage: {
    flex: 1,
    width: '100%',
  },
  scrollArea: {
    flex: 1,
    marginTop: SCREEN_HEIGHT * 0.12,
    marginHorizontal: SCREEN_WIDTH * 0.08,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  verseText: {
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
    fontWeight: '500',
  },
  datesContainer: {
    backgroundColor: '#1a2260',
    marginHorizontal: SCREEN_WIDTH * 0.06,
    marginBottom: SCREEN_HEIGHT * 0.035,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 4,
  },
  dateRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  dateLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
