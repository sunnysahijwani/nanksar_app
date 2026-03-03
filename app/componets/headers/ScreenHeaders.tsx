import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import AppText from "../elements/AppText/AppText";
import { useAppContext } from "../../context/AppContext";
import GoBack from "../smartComponents/GoBack";
import { App_Name_In_Punjabi } from "../../utils/constant";
import { resetAndNavigate } from "../../utils/NavigationUtils";

type ScreenHeadersProps = {
    title?: string;
    isShowBackArrow?: boolean;
    isShowFontSize?: boolean;
    isShowHomeButton?: boolean;
}
export default function ScreenHeaders(
    {
        title,
        isShowBackArrow = true,
        isShowFontSize = true,
        isShowHomeButton = true,
    }
        : ScreenHeadersProps
) {
    const { setAppTextScale, textScale, colors } = useAppContext();
    return (
        <>
            <View className="h-16 flex-row items-center justify-between p-3">
                <View>
                    {isShowBackArrow && <GoBack />}
                </View>
                <AppText size={17} style={{ color: colors.primary }}
                //  onPress={() => clearCache(STORAGE_KEYS?.GURU_GRANTH_SHIB_JI_BANI_DATA)}
                >{title || App_Name_In_Punjabi}
                </AppText>
                <View className="flex-row items-center" style={{ gap: 10 }}>
                    {
                        isShowFontSize && <>
                            <Pressable onPress={() => setAppTextScale(textScale - 0.1)}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    borderWidth: 1.5,
                                    borderColor: colors.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>ਅ</Text>
                            </Pressable>
                            <Pressable onPress={() => setAppTextScale(textScale + 0.1)}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    borderWidth: 1.5,
                                    borderColor: colors.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary }}>ਅ</Text>
                            </Pressable>
                        </>
                    }
                    {isShowHomeButton && (
                        <TouchableOpacity
                            onPress={() => resetAndNavigate('Home')}
                            activeOpacity={0.7}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            <Image
                                source={require('../../assets/images/nanaksar_logo.png')}
                                style={{ width: 30, height: 30, borderRadius: 15 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    )
}
