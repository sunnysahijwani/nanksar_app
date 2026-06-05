import { Image } from "react-native";
import { navigate } from "../../utils/NavigationUtils";

export const lang = {
    nanaksarAmritGhar: 'ਨਾਨਕਸਰ ਅੰਮ੍ਰਿਤਘਰ',
    gallery: 'ਗੈਲੇਰੀ',
    hukamnama: 'ਹੁਕਮਨਾਮਾ',
    gurmatVidyala: 'ਗੁਰਮਤਿ ਵਿਦਿਆਲਾ',
    info: 'ਜਾਣਕਾਰੀ',
    sundarGutka: 'ਸੁੰਦਰ ਗੁਟਕਾ',
    Sangrand: 'ਸੰਗਰਾਂਦ',
    Puranmashi: 'ਪੂਰਨਮਾਸ਼ੀ',
    Dashami: 'ਦਸਮੀ',
    Massiya: 'ਮੱਸਿਆ',
    Panchami: 'ਪੰਚਮੀ',
    babaBhaagSingh: 'ਸੰਤ ਬਾਬਾ ਭਾਗ ਸਿੰਘ ਜੀ',
    GurBaniKhoj: 'ਗੁਰਬਾਣੀ ਖੋਜ',
    A: 'ਅ',
    jumpToDashboard: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਜਾਓ",
    translateEnPun: "ਅਨੁਵਾਦ (Eng/Pun)",
    bookmarksIndex: "ਬੁੱਕਮਾਰਕ / ਤਤਕਰਾ",
    fontSize: "ਅੱਖਰਾਂ ਦਾ ਆਕਾਰ",
    homaeContainer: [
        {
            title: 'ਗੁਰਬਾਣੀ ਖੋਜ',
            size: 150,
            onPress: () => navigate('GurBaniKhojSuwidhaScreen'),
            Icon: () => <Image source={require('../../assets/images/gurnbani_khoj_2.png')} resizeMode='contain' style={{ width: 150, height: 150 }} />,
        },
        {
            title: 'ਸੁੰਦਰ ਗੁਟਕਾ',
            size: 150,
            onPress: () => navigate('SundarGutkaListingScreen'),
            Icon: () => <Image source={require('../../assets/images/sundar_gutka.png')} resizeMode='contain' style={{ width: 150, height: 150 }} />,
        },
        {
            title: 'ਸਿੱਖ  ਇਤਿਹਾਸ',
            size: 150,
            onPress: () => navigate('SikhHistoryListingScreen'),
            Icon: () => <Image source={require('../../assets/images/sikh_history.png')} resizeMode='contain' style={{ width: 120, height: 120, }} />,
        },
        {
            title: 'ਆਡੀਓ ਪਾਠ',
            size: 150,
            onPress: () => navigate('AudioListingScreen'),
            Icon: () => <Image source={require('../../assets/images/audio_path.png')} resizeMode='contain' style={{ width: 120, height: 120 }} />,
        },

    ],
    months: [
        'ਜਨਵਰੀ',
        'ਫਰਵਰੀ',
        'ਮਾਰਚ',
        'ਅਪ੍ਰੈਲ',
        'ਮਈ',
        'ਜੂਨ',
        'ਜੁਲਾਈ',
        'ਅਗਸਤ',
        'ਸਤੰਬਰ',
        'ਅਕਤੂਬਰ',
        'ਨਵੰਬਰ',
        'ਦਸੰਬਰ',
    ],
}