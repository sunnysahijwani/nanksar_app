import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import GradientBg from '../../componets/backgrounds/GradientBg';
import { ScreenHeaders } from '../../componets';
import AppText from '../../componets/elements/AppText/AppText';
import { useAppContext } from '../../context/AppContext';
import { useLocalize } from '../../hooks/useLocalize';
import { SIZES } from '../../utils/theme';
import AppHeader from '../../componets/headers/AppHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InformationDetailScreen({ route }: any) {
  const { colors, lang } = useAppContext();
  const { t } = useLocalize();
  const { item } = route.params;

  const title = t(item, 'title');

  return (
      <View style={styles.container}>
        <AppHeader title={lang.info} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AppText size={22} style={[styles.title, { color: colors.primary }]}>
            {title}
          </AppText>

          {item.description ? (
            <View style={styles.descriptionContainer}>
              <RenderHtml
                contentWidth={SCREEN_WIDTH - SIZES.screenDefaultPadding * 2}
                source={{ html: item.description }}
                enableCSSInlineProcessing={true}
                // RenderHtml builds its own <Text> nodes internally.
                defaultTextProps={{ allowFontScaling: false }}
                baseStyle={styles.htmlBase}
                tagsStyles={{
                  p: { marginBottom: 8, lineHeight: 22 },
                  strong: { fontWeight: '700' },
                  b: { fontWeight: '700' },
                  em: { fontStyle: 'italic' },
                  i: { fontStyle: 'italic' },
                  center: { textAlign: 'center' },
                }}
              />
            </View>
          ) : (
            <View style={styles.noContent}>
              <AppText size={15} style={styles.noContentText}>
                No content available.
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingBottom: 40,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  htmlBase: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  noContent: {
    marginTop: 40,
    alignItems: 'center',
  },
  noContentText: {
    color: '#999',
  },
});
