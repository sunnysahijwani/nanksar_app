import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  Share,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../elements/AppText/AppText';
import AppLoader from '../../Loader/AppLoader';
import BackArrow from '../../elements/BackArrow/BackArrow';
import { useHukamnama } from '../../../hooks/query/useHukamnama';
import { useAppContext } from '../../../context/AppContext';
import HukamnamaFab from './HukamnamaFab';
import { COLORS } from '../../../utils/theme';

const HEADER_BAR_HEIGHT = 56;

const HEADER_TEXT = '#fff8e1';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



const InnerHukamnama = () => {
  const { data, isLoading, isError } = useHukamnama();
  const { lang, setAppTextScale, textScale } = useAppContext();

  const [showTranslation, setShowTranslation] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);

  const insets = useSafeAreaInsets();
  const HEADER_TOTAL = insets.top + HEADER_BAR_HEIGHT;

  const previousScrollY = useSharedValue(0);
  const headerOffset = useSharedValue(0);

  // 1. Update the Scroll Handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      // Ignore small movements (jitters)
      const diff = currentY - previousScrollY.value;

      if (currentY <= 0) {
        // Always show at top
        headerOffset.value = withTiming(0, { duration: 200 });
      } else if (diff > 3) {
        // Scrolling Down - Hide
        headerOffset.value = withTiming(-HEADER_TOTAL, { duration: 250 });
      } else if (diff < -3) {
        // Scrolling Up - Show
        headerOffset.value = withTiming(0, { duration: 250 });
      }

      previousScrollY.value = currentY;
    },
  });

  // 2. ONLY animate the Header's Y position
  const headerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerOffset.value }],
  }));


  const contentAnimStyle = useAnimatedStyle(() => ({
    marginTop: HEADER_TOTAL + headerOffset.value,
  }));

  const handleShare = useCallback(async () => {
    if (!data?.result) return;
    const verseText = data.result.map((item: any) => item.text).join('\n');
    try {
      await Share.share({
        message: `${lang.hukamnama}\n\n${verseText}`,
      });
    } catch (_) { }
  }, [data, lang]);

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '________';
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    return `${day} ${lang.months[date.getMonth()]}`;
  }


  if (isLoading) return <AppLoader fullScreen />;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerSafeArea, headerAnimStyle]}>
        <View style={{ height: insets.top }} />
        <View style={styles.header}>
          <BackArrow color={HEADER_TEXT} style={{ backgroundColor: '#1a2260', borderRadius: 100 }} size={14} />
          {/* <AppText size={17} style={styles.headerTitle}>
            {lang.hukamnama}
          </AppText> */}
          {/* Spacer to keep title centered */}
          <View style={{ width: 40 }} />
        </View>
      </Animated.View>

      {isError && (
        <View style={styles.centerMessage}>
          <AppText size={16} style={{ color: '#666' }}>
            Could not load Hukamnama. Please try again later.
          </AppText>
        </View>
      )}

      {!isError && !data?.result && (
        <View style={styles.centerMessage}>
          <AppText size={16} style={{ color: '#666' }}>
            No Hukamnama available for today.
          </AppText>
        </View>
      )}

      {data?.result && (
        <Animated.View style={[styles.content,]}>
          {/* Content layer (behind the frame) */}
          <Animated.ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: SCREEN_HEIGHT * 0.17 + HEADER_BAR_HEIGHT }
            ]}
            showsVerticalScrollIndicator={false}
            onScrollEndDrag={scrollHandler}
            scrollEventThrottle={16}


          >
            <Text style={{ color: '#1a2260', textAlign: 'center', marginBottom: 12, fontSize: 40, fontWeight: '500' }}>
              {lang.hukamnama}
            </Text>
            {data.result.map((item: any, index: number) => (
              <View key={item.id || index} style={styles.verseBlock}>
                <AppText size={18} style={styles.verseText}>

                  {item.text}
                </AppText>

                {showTranslation &&
                  item.translations?.map((t: any) => (
                    <AppText
                      key={t.id}
                      size={14}
                      style={styles.translationText}
                    >

                      {t.text}
                    </AppText>
                  ))}

                {showTransliteration &&
                  item.transliterations?.map((t: any) => (
                    <AppText
                      key={t.id}
                      size={14}
                      style={styles.transliterationText}
                    >
                      {t.text}
                    </AppText>
                  ))}
              </View>
            ))}
          </Animated.ScrollView>

          {/* Dates panel (behind the frame) */}
          {data.hukamnama && (
            <View style={styles.datesContainer}>
              <View style={styles.dateRowCenter}>
                <Text  style={styles.dateLabel}>
                  {lang.Sangrand} — {formatDate(data.hukamnama.sangrandh)}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Text  style={styles.dateLabel}>
                  {lang.Puranmashi} — {formatDate(data.hukamnama.puranmashi)}
                </Text>
                <Text style={styles.dateLabel}>
                  {lang.Dashami} — {formatDate(data.hukamnama.dasmi)}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Text  style={styles.dateLabel}>
                  {lang.Massiya} — {formatDate(data.hukamnama.masya)}
                </Text>
                <Text  style={styles.dateLabel}>
                  {lang.Panchami} — {formatDate(data.hukamnama.punchmi)}
                </Text>
              </View>
            </View>
          )}

          {/* Frame image overlay (on top, passes touches through) */}
          <View style={styles.frameOverlay} pointerEvents="none">
            <Image
              source={require('../../../assets/images/hukamnama_screen_cleaned.png')}
              style={styles.frameImage}
              resizeMode="stretch"
            />
          </View>

          {/* FAB */}
          <HukamnamaFab
            onFontIncrease={() => setAppTextScale(textScale + 0.1)}
            onFontDecrease={() => setAppTextScale(textScale - 0.1)}
            onSharePress={handleShare}
            translationOn={showTranslation}
            onTranslationToggle={() => setShowTranslation(prev => !prev)}
            transliterationOn={showTransliteration}
            onTransliterationToggle={() =>
              setShowTransliteration(prev => !prev)
            }
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    // backgroundColor: GOLD,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: HEADER_TEXT,
    fontWeight: '700',
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
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  frameImage: {
    flex: 1,
    width: '100%',
  },
  scrollArea: {
    flex: 1,
    marginHorizontal: SCREEN_WIDTH * 0.08,
  },
  scrollContent: {
    paddingTop: SCREEN_HEIGHT * 0.27,
    paddingBottom: SCREEN_HEIGHT * 0.25,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  verseBlock: {
    marginBottom: 12,
  },
  verseText: {
    color: COLORS.primary.primary,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '500',
  },
  translationText: {
    color: '#444444',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
    fontStyle: 'italic',
  },
  transliterationText: {
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 2,
  },
  datesContainer: {
    backgroundColor: '#1a2260',
    marginHorizontal: SCREEN_WIDTH * 0.06,
    marginBottom: SCREEN_HEIGHT * 0.035,
    paddingVertical: 15,
    paddingHorizontal: 24,
    gap: 4,
  },
  dateRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingVertical: 3,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  dateLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default InnerHukamnama;
