import { Animated, Image, ScrollView, Text, View } from 'react-native';
import { CircleCard } from '../../componets';
import SquareCard from '../../componets/elements/Card/SquareCard';
import { READ_CV_LOGO } from '../../assets/svgs';
import { useAppContext } from '../../context/AppContext';
import GradientBg from '../../componets/backgrounds/GradientBg';
import { useEffect, useRef, useState } from 'react';
import { navigate } from '../../utils/NavigationUtils';
import { useHukamnama } from '../../hooks/query/useHukamnama';
import LinearGradient from "react-native-linear-gradient";
import DisclaimerModal from '../../componets/blocks/Disclaimer/DisclaimerModal';
import { shouldShowDisclaimer, markDisclaimerShown } from '../../storage/disclaimer';

export default function HomeScreen() {
  const { colors, setTheme, lang, switchLang, textScale } = useAppContext();
  const { data: hukamnamaData } = useHukamnama();
  const hasHukamnama = !!(hukamnamaData?.result && hukamnamaData.result.length > 0);

  useEffect(() => {
    setTheme('default');
  }, [setTheme]);

  // Show the two-step (Punjabi → English) disclaimer on Home, then hide for 3 days.
  
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (shouldShowDisclaimer()) {
      setShowDisclaimer(true);
    }
  }, []);

  const onDisclaimerDone = () => {
    markDisclaimerShown();
    setShowDisclaimer(false);
  };

  const { homaeContainer, nanaksarAmritGhar, gallery, hukamnama, gurmatVidyala, babaBhaagSingh, info } = lang;

  useEffect(() => {
    // resquest permission
    //requestMyAppPermission();
  }, []);

  const baseScale = 1.4;
  const dynamicScale = Math.min(baseScale / (textScale || baseScale), 1.2);

  // --- Horizontal scroll indicator state ---
  const scrollX = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);   // visible width of the ScrollView
  const [contentWidth, setContentWidth] = useState(0); // total width of the cards row

  const isScrollable = contentWidth > trackWidth + 1;
  // Thumb width proportional to how much of the content is visible (min 24px).
  const thumbWidth = isScrollable
    ? Math.max((trackWidth / contentWidth) * trackWidth, 24)
    : 0;
  const maxScroll = Math.max(contentWidth - trackWidth, 1);
  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, maxScroll],
    outputRange: [0, Math.max(trackWidth - thumbWidth, 0)],
    extrapolate: 'clamp',
  });

  return (
    <GradientBg enableSafeAreaView={true} notchColor={colors.screenBgGr[1]}>
      <DisclaimerModal visible={showDisclaimer} onDone={onDisclaimerDone} />
      <View className="flex-row justify-center items-center my-4 ">
        <LinearGradient
          colors={["#C7E4F3", "#D2EAF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center justify-between px-4 py-2"
          style={{ borderRadius: 50, borderWidth: 1, borderColor: colors.primary }}
        >
          <Text className="font-bold text-center" style={{ color: colors.primary, fontSize: 23 }}>
            {nanaksarAmritGhar}
          </Text>
        </LinearGradient>
      </View>
      <View style={{ flex: 1, paddingBottom: 100 * dynamicScale, justifyContent: 'center' }}>
        <View className="flex-wrap flex-row justify-center" style={{ gap: 8 * dynamicScale }} >
          {homaeContainer?.map((item: any, index: number) => (
            <View key={index} style={{ width: '44%', marginBottom: 12 * dynamicScale, alignItems: 'center' }} >
              <CircleCard
                key={index}
                onPress={item.onPress}
                title={item.title}
                Icon={
                  <View style={{ width: item.size * dynamicScale, height: item.size * dynamicScale, alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{ transform: [{ scale: dynamicScale * 0.85 }] }}>
                      <item.Icon
                        color={colors.primary}
                      />
                    </View>
                  </View>
                }
                size={item.size * 1}
              />
            </View>
          ))}
        </View>
        <View className="mt-8">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
            onContentSizeChange={w => setContentWidth(w)}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 * dynamicScale }}
          >
            <SquareCard
              title={gallery}
              size={145}
              icon={<Image source={require('../../assets/images/gallery.png')} resizeMode='contain' style={{ width: 80, height: 80 }} />}
              onPress={() => navigate('GalleryScreen')}
            />
            <SquareCard
              title={gurmatVidyala}
              size={145}
              icon={<Image source={require('../../assets/images/vidyala.png')} resizeMode='contain' style={{ width: 80, height: 80 }} />}
              onPress={() => navigate('VidyalaScreen')}
            />
            <SquareCard
              title={info}
              size={145}
              icon={<Image source={require('../../assets/images/info.png')} resizeMode='contain' style={{ width: 60, height: 60 }} />}
              onPress={() => navigate('InformationListScreen')}
            />
            {hasHukamnama && (
              <SquareCard
                title={hukamnama}
                size={145}
                icon={<READ_CV_LOGO width={55} height={55} color={colors.white} />}
                onPress={() => navigate('HukamnamaScreen')}
              />
            )}
          </ScrollView>

          {/* Always-visible custom scroll indicator */}
          {isScrollable && (
            <View
              style={{
                height: 3,
                borderRadius: 3,
                marginTop: 12,
                marginHorizontal: 16,
                width: trackWidth - 32,
                backgroundColor: colors.primary + '26', // ~15% opacity track
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={{
                  height: 3,
                  borderRadius: 3,
                  width: Math.max(thumbWidth - 32 * (thumbWidth / (trackWidth || 1)), 24),
                  backgroundColor: colors.primary,
                  transform: [{ translateX: thumbTranslateX }],
                }}
              />
            </View>
          )}
        </View>
      </View>
      {/* bottom var  */}
      <View className="flex-row justify-between items-start absolute bottom-0 px-5 w-full" style={{ height: 100 }}>

        <View className="flex-row justify-between items-center w-full" style={{ paddingHorizontal: 16, gap: 12 * dynamicScale }} >

          <CircleCard
            Icon={
              <Image source={require('../../assets/images/translation.png')}
                resizeMode='contain'
                style={{ width: 45, height: 45 }} />
            }
            size={55}
            onPress={() => switchLang()}
          />

          <Text className="font-bold" style={{ color: colors.primary, width: '60%', textAlign: 'center', fontSize: 19 }}>{babaBhaagSingh}</Text>

          <CircleCard
            Icon={
              <Image
                source={require('../../assets/images/search.png')}
                resizeMode='contain'
                style={{ width: 40, height: 40 }} />
            }
            size={50}
            onPress={() => navigate('GurBaniKhojSuwidhaScreen', { searchOn: true })}
          />
        </View>
      </View>
    </GradientBg>
  );
}
