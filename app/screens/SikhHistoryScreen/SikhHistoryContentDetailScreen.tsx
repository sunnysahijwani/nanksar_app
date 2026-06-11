import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import GradientBg from '../../componets/backgrounds/GradientBg';
import AppText from '../../componets/elements/AppText/AppText';
import { SIZES } from '../../utils/theme';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import { SakhiyanContent } from '../../componets/blocks/InnerSikhHistory/InnerSikhHistoryListing';
import RenderHTML from 'react-native-render-html';
import AppLoader from '../../componets/Loader/AppLoader';
import DropdownMenuHeader from '../../componets/headers/DropdownMenuHeader';
import { APP_LANGUAGES } from '../../utils/constant';

const S3_BASE_URL = 'https://nanaksaramritghar.com/storage/';

const getFullUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${S3_BASE_URL}${path}`;
};

const SikhHistoryContentDetailScreen = ({ route }: any) => {
  const { content } = route.params as { content: SakhiyanContent };

  const { colors, textScale, currentLanguage } = useAppContext();

  const screenTitle =
    currentLanguage === APP_LANGUAGES.PUNJABI
      ? content.title_punjabi || content.title
      : content.title;

  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content.description_path) {
      setLoading(true);
      setError(null);
      const url = getFullUrl(content.description_path);
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load content');
          return res.text();
        })
        .then(text => {
          setDescription(text);
        })
        .catch(err => {
          setError(err.message || 'Failed to load description');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (content.description) {
      setDescription(content.description);
    }
  }, [content]);

  if (loading) return <AppLoader fullScreen />;

  return (
    <GradientBg enableSafeAreaView={false}>
      <View style={styles.container}>
        <DropdownMenuHeader
          title={screenTitle}
          showDashboardOption
          showTranslateOption
          showFontSizeOption
          showTocOption={false}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* <AppText
            size={20}
            style={[styles.title, { color: colors.primary }]}
          >
            {content.title}
          </AppText> */}

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <AppText size={14} style={{ color: '#e74c3c' }}>
                {error}
              </AppText>
            </View>
          ) : description ? (
            <AppText
              size={16}
              style={[styles.description, { color: withOpacity(colors.primary, 0.85) }]}
            >
              <RenderHTML
                contentWidth={SIZES.width - SIZES.screenDefaultPadding * 2}
                source={{ html: description }}
                baseStyle={{
                  fontSize: 16 * textScale,
                  lineHeight: 28 * textScale,
                  letterSpacing: 0.2,
                  color: withOpacity(colors.primary, 0.85),
                }}
                tagsStyles={{
                  body: { fontSize: 16 * textScale, lineHeight: 28 * textScale },
                  p: { fontSize: 16 * textScale, lineHeight: 28 * textScale },
                  span: { fontSize: 16 * textScale, lineHeight: 28 * textScale },
                  div: { fontSize: 16 * textScale, lineHeight: 28 * textScale },
                  li: { fontSize: 16 * textScale, lineHeight: 28 * textScale },
                }}
              />
              {/* {description} */}
            </AppText>
          ) : (
            <View style={styles.emptyContainer}>
              <AppText
                size={14}
                style={{ color: withOpacity(colors.primary, 0.5) }}
              >
                No description available.
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>
    </GradientBg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  description: {
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  loaderContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  errorContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
});

export default SikhHistoryContentDetailScreen;
