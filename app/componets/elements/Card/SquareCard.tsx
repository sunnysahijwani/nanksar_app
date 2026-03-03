import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import AppText from '../AppText/AppText';


type SquareCardProps = {
    title: string;
    icon: React.ReactNode;
    size?: number;
    backgroundColor?: string;
    titleColor?: string;
    style?: ViewStyle;
    onPress?: () => void;
};

const SquareCard: React.FC<SquareCardProps> = ({
    title,
    icon,
    size = 140,
    backgroundColor = '#0B3C5D',
    titleColor = '#FFFFFF',
    style,
    onPress,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                {
                    width: size,
                    height: size,
                    backgroundColor,
                },
                style,
            ]}
        >
            {/* Title */}
            <AppText size={14} style={[styles.title, { color: titleColor }]}>
                {title}
            </AppText>

            {/* Icon */}
            <View style={styles.iconContainer}>{icon}</View>
        </TouchableOpacity>
    );
};

export default SquareCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 10,
        paddingBottom: 3,
        justifyContent: 'space-between',
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
