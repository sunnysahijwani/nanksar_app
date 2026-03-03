import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../../context/AppContext";
import GoBack from "../smartComponents/GoBack";
import { App_Name_In_Punjabi } from "../../utils/constant";
import { resetAndNavigate } from "../../utils/NavigationUtils";
import LinearGradient from "react-native-linear-gradient";
import { SEARCH, SETTINGS } from "../../assets/svgs";
import { COLORS } from "../../utils/theme";
import Heart from "../../assets/svgs/newsvgs/Heart";
import { useState } from "react";
import HeartFilled from "../../assets/svgs/newsvgs/HeartFilled";

type ScreenHeadersProps = {
    title?: string;
    isShowBackArrow?: boolean;
    isShowFontSize?: boolean;
    isShowHomeButton?: boolean;
    onSearchIconPress?: () => void;
    onHeartIconPress?: () => void;
    onBookmarkIconPress?: () => void;
    searchText?: string;
    isShowSearchIcon?: boolean;
    isShowSettingsIcon?: boolean;
    onSettingsPress?: () => void;
    isHeartActive?: boolean;
    isBookmarked?: boolean;
    isHeartIconShow?: boolean;
    isBookmarkIconShow?: boolean;
}
export default function ScreenHeaders(
    {
        title,
        isShowBackArrow = true,
        isShowFontSize = true,
        isShowHomeButton = true,
        isShowSearchIcon = true,
        isShowSettingsIcon = false,
        onSettingsPress,
        onSearchIconPress,
        onHeartIconPress,
        onBookmarkIconPress,
        searchText,
        isHeartActive = false,
        isBookmarked = false,
        isHeartIconShow = false,
        isBookmarkIconShow = false,
    }
        : ScreenHeadersProps
) {
    const { switchLang, colors, lang, textScale, setAppTextScale } = useAppContext();
    return (
        <>
            <View>
                <LinearGradient
                    colors={["#C7E4F3", "#D2EAF6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-16 flex-row items-center justify-between p-3"
                >
                    <View>
                        {isShowBackArrow && <GoBack title={title || lang?.nanaksarAmritGhar} textStyle={{ fontWeight: '700', fontSize: 20, color: colors.primary }} color={colors.lightBlue} />}
                    </View>
                    <View className="flex-row items-center" style={{ gap: 16 }}>
                        {
                            isShowFontSize && <>

                                <TouchableOpacity
                                    onPress={() => switchLang()}
                                    activeOpacity={0.7}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: colors.white,
                                        padding: 5,
                                    }}
                                >
                                    <Image
                                        source={require('../../assets/images/translation.png')}
                                        style={{ width: 40, height: 40, borderRadius: 15 }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
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
                                    justifyContent: 'center'
                                }}
                            >
                                <Image
                                    source={require('../../assets/images/nanaksar_logo.png')}
                                    style={{ width: 50, height: 50, borderRadius: 15 }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </LinearGradient>


                {/* serach bar with heart icon */}
                {isShowSearchIcon && <View style={styles.container}>
                    {/* Search Bar */}
                    <View style={styles.searchBar}>
                        <TextInput
                            placeholderTextColor="#999"
                            style={styles.input}
                            onPressIn={onSearchIconPress}
                            value={searchText}
                            showSoftInputOnFocus={false}
                        />
                        {/* Left Search Icon Button */}
                        <TouchableOpacity style={styles.searchIcon} onPress={onSearchIconPress}>
                            <SEARCH color={colors.lightBlue} width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                    {/* Right Heart Button */}
                    <TouchableOpacity style={styles.heartButton} onPress={onHeartIconPress} activeOpacity={0.7}>
                        {isHeartActive ? (
                            <HeartFilled color={colors.primary} width={30} height={30} />
                        ) : (
                            <Heart color={colors.primary} width={30} height={30} />
                        )}
                    </TouchableOpacity>
                </View>}


                {/* icon seaction here  */}
                <View className="flex-row items-center justify-center gap-2" style={{ marginVertical: 10 }}>
                    <TouchableOpacity style={[styles.heartButton, styles.styleIcon]} onPress={() => setAppTextScale(+(textScale - 0.1).toFixed(1))} activeOpacity={0.7}>
                        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 15 }}>
                            -{lang?.A || 'A'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.heartButton, styles.styleIcon]} onPress={() => setAppTextScale(+(textScale + 0.1).toFixed(1))} activeOpacity={0.7}>
                        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 15 }}>
                            {lang?.A || 'A'}+
                        </Text>
                    </TouchableOpacity>
                    {isBookmarkIconShow && <TouchableOpacity style={[styles.heartButton, styles.styleIcon, isBookmarked ? { backgroundColor: colors.screenBg2 } : {}]} onPress={onBookmarkIconPress} activeOpacity={0.7}>
                        <Image
                            source={require('../../assets/images/bookmark.png')}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>}

                    {isShowSettingsIcon && <TouchableOpacity style={[styles.heartButton, styles.styleIcon]} onPress={onSettingsPress} activeOpacity={0.7} >
                        <SETTINGS color={colors.primary} height={30} width={30} />
                    </TouchableOpacity>}


                    {isHeartIconShow && <TouchableOpacity style={styles.heartButton} onPress={onHeartIconPress} activeOpacity={0.7}>
                        {isHeartActive ? (
                            <HeartFilled color={colors.primary} width={30} height={30} />
                        ) : (
                            <Heart color={colors.primary} width={30} height={30} />
                        )}
                    </TouchableOpacity>}
                </View>

            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 15,
        paddingHorizontal: 15,
    },

    searchBar: {
        width: "85%",
        height: 50,
        backgroundColor: COLORS.default.white,
        borderRadius: 40,
        justifyContent: "center",
        paddingLeft: 60,
    },

    input: {
        fontSize: 16,
        color: "#000",
    },

    searchIcon: {
        position: "absolute",
        left: 10,
        top: 5,
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: COLORS.default.white,
        alignItems: "center",
        justifyContent: "center",

        // Shadow (iOS)
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },

        // Shadow (Android)
        elevation: 5,
    },

    heartButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: COLORS.default.white,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    styleIcon: {
        width: 50,
        height: 50,
    }
});