import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '../../../utils/theme';

type CircleCardProps = {
    title?: string;
    /** Diameter of the circle. */
    size?: number;
    /** Box the icon is centred in. Defaults to 70% of `size`. */
    iconSize?: number;
    backgroundColor?: string;
    style?: ViewStyle;
    Icon?: React.ReactNode;
    onPress?: () => void;
    /**
     * Title metrics are passed in explicitly (already font-scaled by the caller) so
     * the card occupies a height the parent can predict. `titleHeight` is reserved
     * whether the title wraps or not — that is what keeps a grid of cards aligned
     * and stops a circle from overlapping the title above it.
     */
    titleFontSize?: number;
    titleHeight?: number;
    titleLines?: number;
    titleGap?: number;
    titleColor?: string;
};

const CircleCard: React.FC<CircleCardProps> = ({
    title,
    Icon,
    size = 80,
    iconSize,
    backgroundColor = '#fff',
    style,
    onPress,
    titleFontSize = 14,
    titleHeight,
    titleLines = 2,
    titleGap = 8,
    titleColor = COLORS.primary.black,
}) => {
    const innerIconSize = iconSize ?? size * 0.7;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.wrapper, style]}
        >
            <View
                style={[
                    styles.circle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor,
                    },
                ]}
            >
                <View
                    style={[
                        styles.iconBox,
                        { width: innerIconSize, height: innerIconSize },
                    ]}
                >
                    {Icon}
                </View>
            </View>

            {!!title && (
                <View
                    style={[
                        styles.titleBox,
                        { height: titleHeight, marginTop: titleGap },
                    ]}
                >
                    <Text
                        numberOfLines={titleLines}
                           allowFontScaling={false}
                        style={[
                            styles.title,
                            {
                                color: titleColor,
                                fontSize: titleFontSize,
                                lineHeight: Math.ceil(titleFontSize * 1.3),
                            },
                        ]}
                    >
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default React.memo(CircleCard);

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderColor: COLORS.default.golden,
        borderWidth: 2,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    iconBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBox: {
        width: '100%',
    },
    title: {
        fontWeight: '500',
        textAlign: 'center',
    },
});
