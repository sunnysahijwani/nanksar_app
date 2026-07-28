import React, { useCallback, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import SquareCard from '../../elements/Card/SquareCard';
import { useAppContext } from '../../../context/AppContext';
import type { HomeLayout } from './useHomeLayout';

export type HomeShortcut = {
  key: string;
  title: string;
  /** Icon size as a fraction of the card's icon box. */
  iconRatio?: number;
  renderIcon: (size: number) => React.ReactNode;
  onPress: () => void;
};

type Props = {
  shortcuts: HomeShortcut[];
  layout: HomeLayout;
};

/**
 * Horizontally scrolling shortcut cards + an always-visible scroll indicator.
 *
 * Scroll/measurement state lives here rather than on the screen so dragging the
 * row never re-renders the circle grid or the footer. The indicator's vertical
 * space is reserved by the layout engine whether or not it is visible, so showing
 * it can't shift the cards.
 */
function HomeShortcutRow({ shortcuts, layout }: Props) {
  const { colors } = useAppContext();

  const scrollX = useRef(new Animated.Value(0)).current;
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const onLayout = useCallback(
    (e: any) => setViewportWidth(e.nativeEvent.layout.width),
    [],
  );
  const onContentSizeChange = useCallback((w: number) => setContentWidth(w), []);

  const isScrollable = contentWidth > viewportWidth + 1;
  const trackWidth = Math.max(viewportWidth - layout.horizontalPadding * 2, 0);
  const thumbWidth = isScrollable
    ? Math.max(trackWidth * (viewportWidth / contentWidth), 28)
    : 0;

  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, Math.max(contentWidth - viewportWidth, 1)],
    outputRange: [0, Math.max(trackWidth - thumbWidth, 0)],
    extrapolate: 'clamp',
  });

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: layout.horizontalPadding,
            gap: layout.columnGap + 4,
            // Centre the cards when they all fit; scroll normally when they don't.
            justifyContent: isScrollable ? 'flex-start' : 'center',
          },
        ]}
      >
        {shortcuts.map(item => (
          <SquareCard
            key={item.key}
            title={item.title}
            width={layout.squareWidth}
            height={layout.squareHeight}
            padding={layout.squarePadding}
            gap={layout.squareGap}
            titleFontSize={layout.squareTitleFont}
            titleLines={layout.squareTitleLines}
            backgroundColor={colors.primary}
            icon={item.renderIcon(
              Math.round(layout.squareIconSize * (item.iconRatio ?? 1)),
            )}
            onPress={item.onPress}
          />
        ))}
      </ScrollView>

      {/* Height is always reserved by the layout engine — only the visuals toggle. */}
      <View style={[styles.indicatorSlot, { height: layout.indicatorBlock }]}>
        {isScrollable && (
          <View
            style={[
              styles.track,
              {
                width: trackWidth,
                height: layout.indicatorHeight,
                borderRadius: layout.indicatorHeight,
                backgroundColor: colors.primary + '26', // ~15% opacity track
              },
            ]}
          >
            <Animated.View
              style={{
                width: thumbWidth,
                height: layout.indicatorHeight,
                borderRadius: layout.indicatorHeight,
                backgroundColor: colors.primary,
                transform: [{ translateX: thumbTranslateX }],
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default React.memo(HomeShortcutRow);

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  indicatorSlot: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  track: {
    overflow: 'hidden',
  },
});
