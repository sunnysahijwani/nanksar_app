import { ScrollView, View } from 'react-native';
import { CircleCard } from '../../componets';
import SquareCard from '../../componets/elements/Card/SquareCard';
import AppText from '../../componets/elements/AppText/AppText';
import { BELL, CAMERA, Khanda } from '../../assets/svgs';
import MainHeader from '../../componets/headers/MainHeader';
import { useAppContext } from '../../context/AppContext';
import GradientBg from '../../componets/backgrounds/GradientBg';
import { lang } from './lang';
import { useEffect } from 'react';
import { navigate } from '../../utils/NavigationUtils';

export default function HomeScreen() {
  const { colors, setTheme } = useAppContext();
  useEffect(() => {
    setTheme('default');
  }, [setTheme]);
  const { containerItems } = lang;
  return (
    <>
      <GradientBg>
        <MainHeader />
        <View className="flex-wrap flex-row gap-14 justify-center mt-6">
          {containerItems?.map((item: any, index: number) => (
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
          ))}
        </View>
        <View className="mt-16">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            <SquareCard
              title="Gallery"
              icon={<CAMERA width={90} height={90} />}
              onPress={() => navigate('GalleryScreen')}
            />
          </ScrollView>
        </View>
        {/* bottom var  */}
        <View className="flex-row justify-between items-center absolute bottom-10 px-5 w-full">
          <CircleCard Icon={<Khanda width={20} height={20} />} size={50} />
          <View className="flex-col justify-center items-center">
            <AppText size={14}> ਸੰਤ ਬਾਬਾ ਭਗਤ ਸਿੰਘ ਜੀ</AppText>
            <AppText size={12}>(ਨਾਨਕਸਰ ਕਲੇਰਾਂ)</AppText>
          </View>
          <CircleCard Icon={<BELL width={50} height={50} />} size={50} />
        </View>
      </GradientBg>
    </>
  );
}
