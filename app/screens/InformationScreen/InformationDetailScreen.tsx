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
import { SIZES } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InformationDetailScreen({ route }: any) {
  const { colors, lang } = useAppContext();
  const { item } = route.params;

  const isEnglish = lang.info === 'INFO';
  const title = isEnglish ? item.title_english : (item.title_punjabi || item.title_english);

  return (
    <GradientBg colorsList={['#ffffff', '#ffffff']}>
      <View style={styles.container}>
        <ScreenHeaders title={lang.info} isShowFontSize={true} isShowSearchIcon={false} />

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
                baseStyle={styles.htmlBase}
                tagsStyles={{
                  p: { marginBottom: 8, lineHeight: 22 },
                  strong: { fontWeight: '700' },
                  em: { fontStyle: 'italic' },
                }}
              />
            </View>
          ) : (
            <View style={styles.noContent}>
              <AppText size={15} style={styles.noContentText}>
                {isEnglish ? 'No content available.' : 'ਕੋਈ ਸਮੱਗਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।'}
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>
    </GradientBg>
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
