import { ScrollView, View } from 'react-native';
import { CircleCard } from '../../componets';
import SquareCard from '../../componets/elements/Card/SquareCard';
import AppText from '../../componets/elements/AppText/AppText';
import { BELL, CAMERA, Khanda } from '../../assets/svgs';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../componets/headers/MainHeader';
import { navigate } from '../../utils/NavigationUtils';
import { useAppContext } from '../../context/AppContext';
import GradientBg from '../../componets/backgrounds/GradientBg';

export default function HomeScreen() {
    const { colors, setTheme } = useAppContext();
    setTheme('default');
    return (
        <>
            <GradientBg>
                <MainHeader/>
                <View className='flex-wrap flex-row gap-14 justify-center mt-6'>
                    <CircleCard onPress={()=>navigate('AudioListingScreen')} title="Audio" Icon={<Khanda color={colors.primary} width={90} height={90} />} size={130} />
                    <CircleCard onPress={()=>navigate('SundarGutkaListingScreen')} title="Sundar Gutka" Icon={<Khanda color={colors.primary} width={90} height={90} />} size={130} />
                    <CircleCard onPress={()=>navigate('SikhHistoryListingScreen')} title="Sikh History" Icon={<Khanda color={colors.primary} width={90} height={90} />} size={130} />
                    <CircleCard onPress={()=>navigate('GurbaniKoshListingScreen')} title="Gurbani Kosh" Icon={<Khanda color={colors.primary} width={90} height={90} />} size={130} />
                </View>
                <View className='mt-16'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 16, }} >
                        <SquareCard title="Gallery" icon={<CAMERA width={90} height={90} />} />
                        <SquareCard title="Gallery" icon={<Khanda width={90} height={90} />} />
                        <SquareCard title="Gallery" icon={<Khanda width={90} height={90} />} />
                        <SquareCard title="Gallery" icon={<Khanda width={90} height={90} />} />
                        <SquareCard title="Gallery" icon={<Khanda width={90} height={90} />} />
                        <SquareCard title="Gallery" icon={<Khanda width={90} height={90} />} />
                        <SquareCard title="Gallery" icon={<Khanda width={90} height={90} />} />
                    </ScrollView>
                </View>
                {/* bottom var  */}
                <View className='flex-row justify-between items-center absolute bottom-10 px-5 w-full'>
                    <CircleCard Icon={<Khanda width={20} height={20} />} size={50} />
                    <View className='flex-col justify-center items-center'>
                        <AppText size={14}> ਸੰਤ ਬਾਬਾ ਭਗਤ ਸਿੰਘ ਜੀ</AppText>
                        <AppText size={12}>(ਨਾਨਕਸਰ ਕਲੇਰਾਂ)</AppText>
                    </View>
                    <CircleCard Icon={<BELL width={50} height={50} />} size={50} />
                </View>
            </GradientBg>   
        </>
    );
}
