import React from 'react'
import { StyleProp, Text, TextProps, TextStyle } from 'react-native'
import { useAppContext } from '../../../context/AppContext';

interface Props extends TextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    size?: number;
}

export default function AppText({
    children,
    style,
    size = 14,
    ...props
}: Props) {

    const { textScale, isDarkMode } = useAppContext();
    return (
        <Text
            {...props}
            allowFontScaling={false}
            style={[
                { color: isDarkMode ? 'white' : 'black' },
                style,
                { fontSize: size * textScale },
            ]}

        >
            {children}
        </Text>
    )
}
