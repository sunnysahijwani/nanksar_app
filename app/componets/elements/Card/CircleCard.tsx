import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    Image,
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
                        borderColor: COLORS.default.golden,  
                        borderWidth: 1, 
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
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
        marginTop: 8,
        fontWeight: '500',
        color: COLORS.primary.black,
    },
});
