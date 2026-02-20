import { Pressable, Text, View } from "react-native";
import AppText from "../elements/AppText/AppText";
import { useAppContext } from "../../context/AppContext";
import BackArrow from "../elements/BackArrow/BackArrow";
import { App_Name_In_Punjabi } from "../../utils/constant";

type ScreenHeadersProps = {
    title?: string;
    isShowBackArrow?: boolean;
    isShowFontSize?: boolean
}
export default function ScreenHeaders(
    {
        title,
        isShowBackArrow = true,
        isShowFontSize = true
    }
        : ScreenHeadersProps
) {
    const { setAppTextScale, textScale, colors } = useAppContext();
    return (
        <>
            <View className="h-16 flex-row items-center justify-between p-3">
                <View>
                    {isShowBackArrow && <BackArrow />}
                </View>
                <AppText size={17} style={{ color: colors.primary }}
                //  onPress={() => clearCache(STORAGE_KEYS?.GURU_GRANTH_SHIB_JI_BANI_DATA)}
                >{title || App_Name_In_Punjabi}
                </AppText>
                <View className="flex-row justify-between">
                    {
                        isShowFontSize && <>
                            <Pressable onPress={() => setAppTextScale(textScale - 0.1)}
                                className="bg-blue-200  rounded-full mr-4 w-12 flex-row items-center justify-center"
                            >
                                <Text style={{ fontSize: 20 }}>-</Text>
                            </Pressable>
                            <Pressable onPress={() => setAppTextScale(textScale + 0.1)}
                                className="bg-blue-200 rounded-full w-12 flex-row items-center justify-center" >
                                <Text style={{ fontSize: 20 }}>+</Text>
                            </Pressable>
                        </>
                    }

                </View>
            </View>
        </>
    )
}
