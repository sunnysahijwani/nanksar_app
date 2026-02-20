import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type Props = {
  isPlaying: boolean;
  color: string;
  /** Max height of the tallest bar in dp. Default 16. */
  size?: number;
};

const BAR_COUNT = 3;
const BAR_WIDTH = 3;
const BAR_GAP = 2;

const PlayingIndicator: React.FC<Props> = ({ isPlaying, color, size = 16 }) => {
  const anims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.35)),
  ).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Each bar gets a different stagger offset so they feel independent
      const delays = [0, 120, 60];
      const durations = [320, 280, 360];

      const loops = anims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delays[i]),
            Animated.timing(anim, {
              toValue: 1,
              duration: durations[i],
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0.25,
              duration: durations[i],
              useNativeDriver: false,
            }),
          ]),
        ),
      );

      const parallel = Animated.parallel(loops);
      loopRef.current = parallel;
      parallel.start();
    } else {
      loopRef.current?.stop();
      loopRef.current = null;
      // Settle bars to a low resting position
      Animated.parallel(
        anims.map(anim =>
          Animated.timing(anim, {
            toValue: 0.35,
            duration: 180,
            useNativeDriver: false,
          }),
        ),
      ).start();
    }

    return () => {
      loopRef.current?.stop();
      loopRef.current = null;
    };
  }, [isPlaying]);

  const totalWidth = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP;

  return (
    <View style={[styles.container, { width: totalWidth, height: size }]}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              width: BAR_WIDTH,
              marginLeft: i > 0 ? BAR_GAP : 0,
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [size * 0.25, size],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    borderRadius: 1.5,
  },
});

export default PlayingIndicator;
