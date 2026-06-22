import React, { useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../elements/AppText/AppText';
import { useAppContext } from '../../context/AppContext';
import { goBack, resetAndNavigate } from '../../utils/NavigationUtils';
import { withOpacity } from '../../utils/helper';
import { SIZES } from '../../utils/theme';
import { App_Max_Scale, App_Min_Scale } from '../../utils/constant';
import { ARROW_LEFT } from '../../assets/svgs';
import AFontPlus from '../../assets/images/AFontPlus.svg';
import FontPlus from '../../assets/images/fontplus.svg';
import FontMinus from '../../assets/images/fontminus.svg';


export interface AppHeaderProps {
  /** Screen title shown next to the back icon, on the right side of the header */
  title?: string;
  titleStyle?: StyleProp<TextStyle>;

  /** Right side: back icon + title */
  showBack?: boolean;
  onBackPress?: () => void;

  /** Icon group, in order: font-size icon, translate icon, app logo */
  showLogo?: boolean;
  showTranslate?: boolean;
  showFontSize?: boolean;

  /** Optional heart/favourite icon — caller controls press handling and filled state */
  showHeart?: boolean;
  onHeartPress?: () => void;
  isHeartActive?: boolean;
}

const ICON_BTN_SIZE = 40;
const SCALE_STEP = 0.1;

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  titleStyle,
  showBack = true,
  onBackPress,
  showLogo = true,
  showTranslate = true,
  showFontSize = true,
  showHeart = false,
  onHeartPress,
}) => {
  const { colors, switchLang, textScale, setAppTextScale } = useAppContext();
  const insets = useSafeAreaInsets();

  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const accent = colors.lightBlue || '#F7931E';

  /* ── Font-size slider drag handling ───────────────────────────────────── */
  const trackWidthRef = useRef(0);
  const dragStartXRef = useRef(0);

  const scaleToPercent = (scale: number) =>
    Math.max(
      0,
      Math.min(1, (scale - App_Min_Scale) / (App_Max_Scale - App_Min_Scale)),
    );

  const percentToScale = (percent: number) => {
    const clamped = Math.max(0, Math.min(1, percent));
    const raw = App_Min_Scale + clamped * (App_Max_Scale - App_Min_Scale);
    return Math.round(raw * 10) / 10;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        dragStartXRef.current = evt.nativeEvent.locationX;
        if (!trackWidthRef.current) return;
        const percent = evt.nativeEvent.locationX / trackWidthRef.current;
        setAppTextScale(percentToScale(percent));
      },
      onPanResponderMove: (_, gestureState) => {
        if (!trackWidthRef.current) return;
        const x = dragStartXRef.current + gestureState.dx;
        const percent = x / trackWidthRef.current;
        setAppTextScale(percentToScale(percent));
      },
    }),
  ).current;

  const thumbPercent = scaleToPercent(textScale);

  /* ── Icon group ───────────────────────────────────────────────────────── */
  const showLeftGroup = showLogo || showTranslate || showFontSize || showHeart;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#C7E4F3', '#D2EAF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerSafeArea, { paddingTop: insets.top }]}
      >
        {isSliderOpen ? (
          /* ── Font-size slider bar ───────────────────────────────────── */
          <View style={styles.sliderRow}>
            <TouchableOpacity
              onPress={() => setIsSliderOpen(false)}
              activeOpacity={0.7}
              style={[styles.circleBtn, { backgroundColor: accent }]}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>
                ✕
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setAppTextScale(+(textScale - SCALE_STEP).toFixed(1))
              }
              activeOpacity={0.7}
              style={[styles.circleBtn]}
              hitSlop={8}
            >
              <FontMinus width={42} height={42} />
            </TouchableOpacity>

            <View
              style={styles.trackHitbox}
              onLayout={e => {
                trackWidthRef.current = e.nativeEvent.layout.width;
              }}
              {...panResponder.panHandlers}
            >
              <View
                style={[styles.track, { backgroundColor: withOpacity(accent, 0.25) }]}
              >
                <View
                  style={[
                    styles.trackFill,
                    { width: `${thumbPercent * 100}%`, backgroundColor: accent },
                  ]}
                />
                <View
                  style={[
                    styles.trackThumb,
                    { left: `${thumbPercent * 100}%`, backgroundColor: accent },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                setAppTextScale(+(textScale + SCALE_STEP).toFixed(1))
              }
              activeOpacity={0.7}
              style={[styles.circleBtn,]}
              hitSlop={8}
            >
              <FontPlus width={42} height={42} />
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Default header row ─────────────────────────────────────── */
          <View style={styles.header}>
            {/* Back arrow + title — title flex-shrinks and ellipsizes so it
                never grows past the available space and overlaps the icon
                group on the other side, no matter how many icons are shown. */}
            <View style={styles.rightGroup}>
              {showBack && (
                <TouchableOpacity
                  onPress={() => (onBackPress ? onBackPress() : goBack())}
                  activeOpacity={0.7}
                  style={styles.backBtn}
                  hitSlop={8}
                >
                  <ARROW_LEFT color={colors.lightBlue} width={26} height={26} />
                </TouchableOpacity>
              )}
              {title ? (
                <AppText
                  size={15}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.titleText,
                    { fontWeight: '700', color: colors.primary },
                    titleStyle as any,
                  ]}
                >
                  {title}
                </AppText>
              ) : null}
            </View>
            {showLeftGroup && (
              <View style={styles.leftGroup}>
                {showHeart && (
                  <TouchableOpacity
                    onPress={onHeartPress}
                    activeOpacity={0.7}
                    style={[styles.iconBtn]}
                  >
                    <Image
                      source={require('../../assets/images/heart-svgrepo-com.png')}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

                {showFontSize && (
                  <TouchableOpacity
                    onPress={() => setIsSliderOpen(true)}
                    activeOpacity={0.7}
                    style={styles.iconBtn}
                  >
                    <AFontPlus width={42} height={42} color={colors.black} />
                  </TouchableOpacity>
                )}

                {showTranslate && (
                  <TouchableOpacity
                    onPress={() => switchLang()}
                    activeOpacity={0.7}
                    style={styles.iconBtn}
                  >
                    <Image
                      source={require('../../assets/images/translation.png')}
                      style={{ width: 45, height: 45 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

                {showLogo && (
                  <TouchableOpacity
                    onPress={() => resetAndNavigate('Home')}
                    activeOpacity={0.7}
                    style={styles.iconBtn}
                  >
                    <Image
                      source={require('../../assets/images/nanaksar_logo.png')}
                      style={{ width: 45, height: 45, borderRadius: 15 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const HEADER_BAR_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    zIndex: 20,
    elevation: 20,
  },
  headerSafeArea: {
    zIndex: 20,
    elevation: 20,
  },
  header: {
    height: HEADER_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenDefaultPadding,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    gap: 8,
  },
  backBtn: {
    flexShrink: 0,
  },
  titleText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  iconBtn: {
    width: ICON_BTN_SIZE,
    height: ICON_BTN_SIZE,
    borderRadius: ICON_BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Slider bar
  sliderRow: {
    height: HEADER_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenDefaultPadding,
    gap: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackHitbox: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  track: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    justifyContent: 'center',
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  trackThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    marginLeft: -10,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default AppHeader;
