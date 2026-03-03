import { Image, ScrollView, View } from 'react-native';
import { CircleCard } from '../../componets';
import SquareCard from '../../componets/elements/Card/SquareCard';
import AppText from '../../componets/elements/AppText/AppText';
import { CAMERA, READ_CV_LOGO } from '../../assets/svgs';
import { useAppContext } from '../../context/AppContext';
import GradientBg from '../../componets/backgrounds/GradientBg';
import { useEffect } from 'react';
import { navigate } from '../../utils/NavigationUtils';
import { requestMyAppPermission } from '../../utils/permission';

export default function HomeScreen() {
  const { colors, setTheme, lang, switchLang } = useAppContext();

  useEffect(() => {
    setTheme('default');
  }, [setTheme]);

  const { homaeContainer, nanaksarAmritGhar, gallery, hukamnama, gurmatVidyala, babaBhaagSingh, info } = lang;

  useEffect(() => {
    // resquest permission
    //requestMyAppPermission();
  }, []);

  return (
    // <>
    <GradientBg enableSafeAreaView={true} notchColor={colors.screenBgGr[1]}>
      <View className="flex-row justify-center items-center my-9 ">
        <AppText size={25} className="font-bold w-full text-center" style={{ color: colors.primary }}>{nanaksarAmritGhar}</AppText>
      </View>
      <View className="flex-wrap flex-row  justify-center" style={{ gap: 8 }} >
        {homaeContainer?.map((item: any, index: number) => (
          <View key={index} style={{ width: '44%', marginBottom: 12, }} >
            <CircleCard
              key={index}
              onPress={item.onPress}
              title={item.title}
              Icon={
                <item.Icon
                  color={colors.primary}
                  width={item.size}
                  height={item.size}
                />
              }
              size={item.size}
            />
          </View>
        ))}
      </View>
      <View className="mt-16">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          <SquareCard
            title={gallery}
            size={130}
            icon={<Image source={require('../../assets/images/gallery.png')} resizeMode='contain' style={{ width: 90, height: 90 }} />}
            onPress={() => navigate('GalleryScreen')}
          />
          <SquareCard
            title={gurmatVidyala}
            size={130}
            icon={<Image source={require('../../assets/images/vidyala.png')} resizeMode='contain' style={{ width: 90, height: 90 }} />}
            onPress={() => navigate('VidyalaScreen')}
          />
          <SquareCard
            title={info}
            size={130}
            icon={<Image source={require('../../assets/images/info.png')} resizeMode='contain' style={{ width: 70, height: 80 }} />}
            onPress={() => navigate('InformationListScreen')}
          />
          <SquareCard
            title={hukamnama}
            size={130}
            icon={<READ_CV_LOGO width={80} height={80} color={colors.white} />}
            onPress={() => navigate('HukamnamaScreen')}
          />
        </ScrollView>
      </View>
      {/* bottom var  */}
      <View className="flex-row justify-between items-center absolute bottom-10 px-5 w-full">
        <CircleCard
          Icon={<Image source={require('../../assets/images/translation.png')} resizeMode='contain'
            style={{ width: 50, height: 50 }} />}
          size={54}
          onPress={() => switchLang()}
        />
        <View className="flex-col justify-center items-center">
          <AppText size={14} className="font-bold" style={{ color: colors.primary }}>{babaBhaagSingh}</AppText>
        </View>
        <CircleCard Icon={<Image source={require('../../assets/images/search.png')} resizeMode='contain'
          style={{ width: 40, height: 40 }} />}
          size={54}
          onPress={() => navigate('GurBaniKhojSuwidhaScreen', { searchOn: true })}
        />
      </View>
    </GradientBg>
    // </>
  );
}
