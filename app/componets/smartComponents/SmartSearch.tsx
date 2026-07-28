import React, { useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SEARCH } from '../../assets/svgs';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
interface SmartSearchProps {
  type?: string;
  style?: StyleProp<ViewStyle>;
  searhIconWidth?: number;
  searchIconHeight?: number;
  onPress?: (event: GestureResponderEvent) => void;
  onChangeText?: (text: string) => void; // ✅ renamed
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  type = 'default',
  style,
  searhIconWidth = 24,
  searchIconHeight = 24,
  onPress,
  onChangeText, // ✅ renamed
}) => {
  const { colors, textScale } = useAppContext();
  const [text, setText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputWidth = useSharedValue(0);
  const searchInputStyle = useAnimatedStyle(() => ({
    width: searchInputWidth.value,
  }));


  useEffect(() => {
    if (!onChangeText) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChangeText(text); // ✅ debounced callback
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text]);

  const onSearchIconPress = (event: GestureResponderEvent) => {
    setShowSearchInput((prev) => !prev);
  };

  useEffect(() => {
    searchInputWidth.value = withTiming(
      showSearchInput ? 200 : 0,
      {
        duration: 300, // animation time in ms
      }
    );
  }, [showSearchInput]);


  return (
    <View>
      <TouchableOpacity style={{ opacity: showSearchInput ? 0 : 1 }} onPress={onSearchIconPress}>
        <SEARCH
          color={colors.primary}
          width={searhIconWidth}
          height={searchIconHeight}
        />
      </TouchableOpacity>

      <Animated.View
        className="absolute top-0 right-0 rounded-full  flex-row items-center"
        style={[{ height: 30, backgroundColor: withOpacity(colors.primary, 0.3), paddingHorizontal: showSearchInput ? 8 : 0, width: showSearchInput ? 200 : 0 }, style, searchInputStyle]}
      >
        <TextInput allowFontScaling={false}
          value={text}
          onChangeText={setText}
          placeholder="Search"
          placeholderTextColor={withOpacity(colors.white,1)}
          className="flex-1 bg-red-5000"
          style={{ color: colors.white, fontSize: 14 * textScale, lineHeight: 16 * textScale,  paddingVertical: 2, }}
        />
        <TouchableOpacity style={{ opacity: showSearchInput ? 1 : 0 }} onPress={onSearchIconPress}>
          <Text allowFontScaling={false} style={{ color: colors.primary, fontSize: 12 * textScale, marginRight: 4, }}>
            X
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SmartSearch;
