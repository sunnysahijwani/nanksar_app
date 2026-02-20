import { Image } from "react-native";
import { navigate } from "../../utils/NavigationUtils";

export const lang = {
    nanaksarAmritGhar: 'Nanaksar Amritghar',
    gallery: 'Gallery',
    homaeContainer: [
        {
            title: 'GurBani Khoj',
            size: 130,
            onPress: () => navigate('GurBaniKhojSuwidhaScreen'),
            Icon: () => <Image source={require('../../assets/images/bookStack.png')} resizeMode='contain' className='w-24 h-24' />,
        },
        {
            title: 'Sunder Gutka',
            size: 130,
            onPress: () => navigate('SundarGutkaListingScreen'),
            Icon: () => <Image source={require('../../assets/images/book.png')} resizeMode='contain' className='w-24 h-24' />,
        },
        {
            title: 'Sikh History',
            size: 130,
            onPress: () => { },
            Icon: () => <Image source={require('../../assets/images/khanda.png')} resizeMode='contain' className='w-24 h-24' />,
        },
        {
            title: 'Audio',
            size: 130,
            onPress: () => navigate('AudioListingScreen'),
            Icon: () => <Image source={require('../../assets/images/audio.png')} resizeMode='contain' className='w-24 h-24' />,
        },
    ],
}