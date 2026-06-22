import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import GradientBg from '../../componets/backgrounds/GradientBg';
import AppText from '../../componets/elements/AppText/AppText';
import { SIZES } from '../../utils/theme';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import { SakhiyanContent } from '../../componets/blocks/InnerSikhHistory/InnerSikhHistoryListing';
import AppLoader from '../../componets/Loader/AppLoader';
import DropdownMenuHeader from '../../componets/headers/DropdownMenuHeader';
import { useLocalize } from '../../hooks/useLocalize';
import AppHeader from '../../componets/headers/AppHeader';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = SCREEN_WIDTH - SIZES.screenDefaultPadding * 3;

const S3_BASE_URL = 'https://nanaksaramritghar.com/storage/';

const getFullUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${S3_BASE_URL}${path}`;
};

// Word fakes right-aligned citation lines (e.g. "(ਭਾਈ ਗੁਰਦਾਸ ਜੀ)", "(ਅੰਗ ੧੩੯੫)")
// using a huge margin-left (3in–4in+) instead of text-align: right. On a phone
// screen that margin alone is wider than the whole content area, so the
// renderer has no room left and wraps the text one glyph per line. Genuine
// paragraph indentation in these docs only ever uses margin-left:.5in, so
// anything 2in or larger is safely assumed to be this right-align hack —
// strip it (and the accompanying text-indent) and apply real text-align:right.
const RIGHT_ALIGN_MARGIN_THRESHOLD_IN = 2;

const sanitizeWordHtml = (html: string): string => {
  return html.replace(/style="([^"]*)"/gi, (full, styleBody: string) => {
    const marginMatch = styleBody.match(/margin-left:\s*(\d+(?:\.\d+)?)in/i);
    if (!marginMatch) return full;
    const inches = parseFloat(marginMatch[1]);
    if (inches < RIGHT_ALIGN_MARGIN_THRESHOLD_IN) return full;

    const cleaned = styleBody
      .replace(/margin-left:\s*\d+(?:\.\d+)?in;?/gi, '')
      .replace(/text-indent:\s*\d+(?:\.\d+)?in;?/gi, '')
      .trim();
    const withTrailingSemi = cleaned && !cleaned.endsWith(';') ? `${cleaned};` : cleaned;
    return `style="${withTrailingSemi} text-align:right;"`;
  });
};

const SikhHistoryContentDetailScreen = ({ route }: any) => {
  const { content } = route.params as { content: SakhiyanContent };

  const { colors, textScale } = useAppContext();
  const { t } = useLocalize();

  const screenTitle = t(content, 'title');

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
          setDescription(sanitizeWordHtml(text));
        })
        .catch(err => {
          setError(err.message || 'Failed to load description');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (content.description) {
      setDescription(sanitizeWordHtml(content.description));
    }
  }, [content]);


  if (loading) return <AppLoader fullScreen />;

  return (
    <GradientBg enableSafeAreaView={false}>
      <View style={styles.container}>
        <AppHeader
          title={screenTitle}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorContainer}>
              <AppText size={14} style={{ color: '#e74c3c' }}>
                {error}
              </AppText>
            </View>
          ) : description ? (
            <RenderHTML
              contentWidth={CONTENT_WIDTH}
              source={{ html: description }}
              enableCSSInlineProcessing={true}
              ignoredStyles={['width', 'height', 'maxWidth', 'minWidth', 'alignContent']}
              baseStyle={{
                fontSize: 16 * textScale,
                lineHeight: 32 * textScale,
                // color: withOpacity(colors.primary, 0.85),
                letterSpacing: 0.2,
                // The source Word document's default paragraph style is bold
                // (defined in its <head><style> block, which never reaches the
                // app since we only fetch the body fragment). The browser
                // inherits that bold default automatically; spans meant to be
                // regular weight explicitly carry style="font-weight: normal"
                // inline, which enableCSSInlineProcessing already honors. So
                // bold must be the inherited default here too, or every span
                // without an explicit override falls back to normal.
                fontWeight: 'bold',
              }}
              tagsStyles={{
                body: {
                  fontSize: 16 * textScale,
                  lineHeight: 32 * textScale,
                },
                p: {
                  marginTop: 4,
                  marginBottom: 4,
                  fontSize: 16 * textScale,
                  lineHeight: 32 * textScale,
                },
                div: {
                  fontSize: 16 * textScale,
                  lineHeight: 32 * textScale,
                },
                span: {
                  fontSize: 16 * textScale,
                },
                center: {
                  textAlign: 'center',
                },
                i: { fontStyle: 'italic' },
                em: { fontStyle: 'italic' },
                b: { fontWeight: 'bold' },
                strong: { fontWeight: 'bold' },
                h1: {
                  fontSize: 22 * textScale,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginVertical: 12,
                },
                h2: {
                  fontSize: 20 * textScale,
                  fontWeight: '700',
                  marginVertical: 10,
                },
                h3: {
                  fontSize: 18 * textScale,
                  fontWeight: '700',
                  marginVertical: 8,
                },
                li: {
                  fontSize: 16 * textScale,
                  lineHeight: 32 * textScale,
                },
                blockquote: {
                  borderLeftWidth: 3,
                  borderLeftColor: colors.primary,
                  paddingLeft: 12,
                  marginLeft: 4,
                  fontStyle: 'italic',
                },
              }}
            />
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
