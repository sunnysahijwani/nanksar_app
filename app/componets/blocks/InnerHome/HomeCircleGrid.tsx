import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import CircleCard from '../../elements/Card/CircleCard';
import { useAppContext } from '../../../context/AppContext';
import type { HomeLayout } from './useHomeLayout';

export type HomeGridItem = {
  title: string;
  iconRatio?: number;
  onPress: () => void;
  Icon: React.FC<{ size: number }>;
};

type Props = {
  items: HomeGridItem[];
  layout: HomeLayout;
};

/**
 * 2x2 grid of circular entry points. Every cell is exactly `cellWidth x cellHeight`
 * (circle + reserved 2-line title block), so cards can never bleed into each other
 * or into the title pill above regardless of font scale or screen height.
 */
function HomeCircleGrid({ items, layout }: Props) {
  const { colors } = useAppContext();

  const cells = useMemo(
    () =>
      items.map((item, index) => {
        const iconSize = Math.round(layout.circleSize * (item.iconRatio ?? 0.8));
        return (
          <View
            key={`${item.title}-${index}`}
            style={[
              styles.cell,
              { width: layout.cellWidth, height: layout.cellHeight },
            ]}
          >
            <CircleCard
              // Fill the cell so the title can use the full column width instead
              // of being squeezed to the circle's diameter.
              style={styles.card}
              title={item.title}
              size={layout.circleSize}
              iconSize={iconSize}
              onPress={item.onPress}
              titleFontSize={layout.circleTitleFont}
              titleHeight={layout.circleTitleHeight}
              titleLines={layout.circleTitleLines}
              titleGap={layout.circleTitleGap}
              titleColor={colors.black}
              Icon={<item.Icon size={iconSize} />}
            />
          </View>
        );
      }),
    [items, layout, colors.black],
  );

  return (
    <View
      style={[
        styles.grid,
        {
          width: layout.gridWidth,
          columnGap: layout.columnGap,
          rowGap: layout.rowGap,
        },
      ]}
    >
      {cells}
    </View>
  );
}

export default React.memo(HomeCircleGrid);

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cell: {
    alignItems: 'center',
  },
  card: {
    width: '100%',
  },
});
