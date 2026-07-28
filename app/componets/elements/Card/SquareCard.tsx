import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type SquareCardProps = {
    title: string;
    icon: React.ReactNode;
    /** Shorthand for equal width + height. `width`/`height` win when supplied. */
    size?: number;
    width?: number;
    /**
     * Height is driven by the caller (title block + icon box) rather than being a
     * fixed square, so the card grows with the app's font scale instead of
     * squeezing / clipping its title.
     */
    height?: number;
    padding?: number;
    gap?: number;
    titleFontSize?: number;
    titleLines?: number;
    backgroundColor?: string;
    titleColor?: string;
    style?: ViewStyle;
    onPress?: () => void;
};

const SquareCard: React.FC<SquareCardProps> = ({
    title,
    icon,
    size = 140,
    width,
    height,
    padding = 10,
    gap = 6,
    titleFontSize = 14,
    titleLines = 2,
    backgroundColor = '#0B3C5D',
    titleColor = '#FFFFFF',
    style,
    onPress,
}) => {
    const lineHeight = Math.ceil(titleFontSize * 1.3);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                {
                    width: width ?? size,
                    height: height ?? size,
                    padding,
                    backgroundColor,
                },
                style,
            ]}
        >
            {/* Reserved title block — always `titleLines` tall so every card in the
                row lines up and the icon never gets pushed out of the card. */}
            <View style={{ height: lineHeight * titleLines }}>
                <Text
                    numberOfLines={titleLines}
                    allowFontScaling={false}
                    style={[
                        styles.title,
                        { color: titleColor, fontSize: titleFontSize, lineHeight },
                    ]}
                >
                    {title}
                </Text>
            </View>

            <View style={[styles.iconContainer, { marginTop: gap }]}>{icon}</View>
        </TouchableOpacity>
    );
};

export default React.memo(SquareCard);

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 6, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    title: {
        fontWeight: '600',
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});
