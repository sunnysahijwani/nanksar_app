import { Image } from "react-native";
import { navigate } from "../../utils/NavigationUtils";

export const lang = {
    nanaksarAmritGhar: 'ਨਾਨਕਸਰ ਅੰਮ੍ਰਿਤਘਰ',
    gallery: 'ਗੈਲੇਰੀ',
    hukamnama: 'ਹੁਕਮਨਾਮਾ',
    homaeContainer: [
        {
            title: 'ਗੁਰਬਾਣੀ ਖੋਜ',
            size: 130,
            onPress: () => navigate('GurBaniKhojSuwidhaScreen'),
            Icon: () => <Image source={require('../../assets/images/bookStack.png')} resizeMode='contain' className='w-24 h-24' />,
        },
        {
            title: 'ਸੁੰਦਰ ਗੁਟਕਾ',
            size: 130,
            onPress: () => navigate('SundarGutkaListingScreen'),
            Icon: () => <Image source={require('../../assets/images/book.png')} resizeMode='contain' className='w-24 h-24' />,
        },
        {
            title: 'ਸਿੱਖ  ਇਤਿਹਾਸ',
            size: 130,
            onPress: () => navigate('SikhHistoryListingScreen'),
            Icon: () => <Image source={require('../../assets/images/khanda.png')} resizeMode='contain' className='w-24 h-24' />,
        },
        {
            title: 'ਆਡੀਓ',
            size: 130,
            onPress: () => navigate('AudioListingScreen'),
            Icon: () => <Image source={require('../../assets/images/audio.png')} resizeMode='contain' className='w-24 h-24' />,
        },

    ],
}