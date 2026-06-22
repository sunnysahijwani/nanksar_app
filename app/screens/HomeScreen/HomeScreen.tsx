import { Image, ScrollView, View } from 'react-native';
import { CircleCard } from '../../componets';
import SquareCard from '../../componets/elements/Card/SquareCard';
import AppText from '../../componets/elements/AppText/AppText';
import { READ_CV_LOGO } from '../../assets/svgs';
import { useAppContext } from '../../context/AppContext';
import GradientBg from '../../componets/backgrounds/GradientBg';
import { useEffect } from 'react';
import { navigate } from '../../utils/NavigationUtils';
import { useHukamnama } from '../../hooks/query/useHukamnama';
import LinearGradient from "react-native-linear-gradient";


export default function HomeScreen() {
  const { colors, setTheme, lang, switchLang, textScale } = useAppContext();
  const { data: hukamnamaData } = useHukamnama();
  const hasHukamnama = !!(hukamnamaData?.result && hukamnamaData.result.length > 0);

  useEffect(() => {
    setTheme('default');
  }, [setTheme]);

  const { homaeContainer, nanaksarAmritGhar, gallery, hukamnama, gurmatVidyala, babaBhaagSingh, info } = lang;

  useEffect(() => {
    // resquest permission
    //requestMyAppPermission();
  }, []);

  const baseScale = 1.4;
  const dynamicScale = Math.min(baseScale / (textScale || baseScale), 1.2);

  return (
    <GradientBg enableSafeAreaView={true} notchColor={colors.screenBgGr[1]}>
      <View className="flex-row justify-center items-center my-4 ">
        <LinearGradient
          colors={["#C7E4F3", "#D2EAF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center justify-between"
        >
          <AppText size={18} className="font-bold w-full text-center" style={{ color: colors.primary }}>{nanaksarAmritGhar}</AppText>

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
        </View>
      </View>
      {/* bottom var  */}
      <View className="flex-row justify-between items-start absolute bottom-0 px-5 w-full" style={{ height: 100 }}>
        <View className="flex-row justify-between items-center w-full" style={{ paddingHorizontal: 16, gap: 12 * dynamicScale }} >

          <CircleCard
            Icon={<Image source={require('../../assets/images/translation.png')} resizeMode='contain'
              style={{ width: 50 * dynamicScale, height: 50 * dynamicScale }} />}
            size={54 * dynamicScale}
            onPress={() => switchLang()}
          />
          <AppText size={14} className="font-bold" style={{ color: colors.primary, width: '60%', textAlign: 'center' }}>{babaBhaagSingh}</AppText>
          <CircleCard Icon={<Image source={require('../../assets/images/search.png')} resizeMode='contain'
            style={{ width: 40 * dynamicScale, height: 40 * dynamicScale }} />}
            size={54 * dynamicScale}
            onPress={() => navigate('GurBaniKhojSuwidhaScreen', { searchOn: true })}
          />
        </View>
      </View>
    </GradientBg>
  );
}
