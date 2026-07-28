import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../../../context/AppContext';


/**
 * App-name pill at the top of Home. Kept to a single line and shrink-to-fit so a
 * large font scale (or the longer English name) can never push it into two lines
 * and steal height from the circle grid below.
 */
function HomeTitlePill() {
  const { colors, lang } = useAppContext();

  return (
    <View style={styles.row}>
      <LinearGradient
        colors={['#C7E4F3', '#D2EAF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.pill, { borderColor: colors.primary }]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          allowFontScaling={false}
          style={[styles.text, { color: colors.primary, fontSize: 23 }]}
        >
          {lang.nanaksarAmritGhar}
        </Text>
      </LinearGradient>
    </View>
  );
}

export default React.memo(HomeTitlePill);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  pill: {
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
