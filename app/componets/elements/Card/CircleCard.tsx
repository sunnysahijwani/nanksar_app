import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import AppText from '../AppText/AppText';
import { COLORS } from '../../../utils/theme';

type CircleCardProps = {
    title?: string;
    size?: number;
    backgroundColor?: string;
    style?: ViewStyle;
    Icon?: React.ReactNode;
    onPress?: () => void;
};

const CircleCard: React.FC<CircleCardProps> = ({
    title,
    Icon,
    size = 80,
    backgroundColor = '#fff',
    style,
    onPress,
}) => {
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
                {Icon}
            </View>

            {title && <AppText size={14} style={styles.title}>
                {title}
            </AppText>}
        </TouchableOpacity>
    );
};

export default CircleCard;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    title: {
        marginTop: 8,
        fontWeight: '500',
        color: COLORS.primary.black,
    },
});
