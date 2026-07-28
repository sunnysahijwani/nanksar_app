import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CircleCard from '../../elements/Card/CircleCard';
import { useAppContext } from '../../../context/AppContext';
import { navigate } from '../../../utils/NavigationUtils';

const TRANSLATION_ICON = require('../../../assets/images/translation.png');
const SEARCH_ICON = require('../../../assets/images/search.png');
/**
 * Bottom action bar: language toggle · sant name · Gurbani search.
 *
 * This is a normal flex child at the end of the column rather than an absolutely
 * positioned overlay — it therefore reserves its own height, is pinned to the
 * bottom, and cannot sit on top of the shortcut cards at any font scale.
 */
function HomeFooterBar() {
  const { colors, lang, switchLang,currentLanguage } = useAppContext();
  

  const buttonSize = 50; // clamp(40 * scale, 46, 60);
  const iconSize = Math.round(buttonSize * 0.78);

  const onSearch = useCallback(
    () => navigate('GurBaniKhojSuwidhaScreen', { searchOn: true }),
    [],
  );

  return (
    <View style={styles.bar}>
      <CircleCard
        size={50}
        iconSize={iconSize}
        onPress={switchLang}
        Icon={
          <Image
            source={TRANSLATION_ICON}
            resizeMode="contain"
            style={{ width: iconSize, height: iconSize }}
          />
        }
      />

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={[
          styles.label,
          {
            color: colors.primary,
            fontSize: currentLanguage == 'punjabi' ? 20 : 18,
            lineHeight: Math.ceil(19 * 1.3),
          },
        ]}
      >
        {lang.babaBhaagSingh}
      </Text>

      <CircleCard
        size={50}
        iconSize={Math.round(iconSize * 0.9)}
        onPress={onSearch}
        Icon={
          <Image
            source={SEARCH_ICON}
            resizeMode="contain"
            style={{ width: iconSize * 0.9, height: iconSize * 0.9 }}
          />
        }
      />
    </View>
  );
}

export default React.memo(HomeFooterBar);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
