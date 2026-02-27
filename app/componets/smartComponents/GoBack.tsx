import React from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  View,
  Text,
  GestureResponderEvent,
} from 'react-native';
import { goBack } from '../../utils/NavigationUtils';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import { ARROW_LEFT } from '../../assets/svgs';

interface GoBackProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  width?: number;
  height?: number;
  title?: string;
  textStyle?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
}

const GoBack: React.FC<GoBackProps> = ({
  style,
  color,
  width = 24,
  height = 24,
  title = '',
  textStyle,
  numberOfLines = 1,

  onPress,
}) => {
  const { textScale, colors, setTheme } = useAppContext();

  // setTheme('default');
  // setTheme('primary');

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event);
    } else {
      goBack();
    }
  };

  return (
    <View className="flex flex-row items-center justify-start gap-3">
      <TouchableOpacity
        onPress={handlePress}
        style={[
          {
            padding: 8,
            borderRadius: 50,
            backgroundColor: withOpacity(colors.primary, 0.08),
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        <ARROW_LEFT
          color={color || colors.primary}
          width={width}
          height={height}
        />
      </TouchableOpacity>

      {title ? (
        <Text
          style={[
            {
              fontSize: 16,
              color: color || colors.primary,
            },
            textStyle,
          ]}
          numberOfLines={numberOfLines}
        >
          {title}
        </Text>
      ) : null}
    </View>
  );
};

export default GoBack;
