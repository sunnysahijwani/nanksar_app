import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import GradientBg from '../../backgrounds/GradientBg';
import AudioListingHeader from '../../headers/AudioListingHeader';
import AppText from '../../elements/AppText/AppText';
import { SIZES } from '../../../utils/theme';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_LEFT, ARROW_RIGHT } from '../../../assets/svgs';

const stripHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const InnerSundarGutkaDetail = ({ route }: any) => {
  const { colors } = useAppContext();
  const { item: initialItem, items = [], index: initialIndex = 0 } = route?.params || {};

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const scrollRef = useRef<ScrollView>(null);

  const currentItem = items[currentIndex] ?? initialItem;
  const title: string = currentItem?.title || '';
  const description: string = stripHtml(currentItem?.description || '');

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const goTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <GradientBg colorsList={['#f8fafc', '#ffffff', '#ffffff']}>
      <View style={styles.container}>
        <AudioListingHeader isSearchBarShow={false} isShowSettings={false} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title banner */}
          <View
            style={[
              styles.titleBanner,
              {
                backgroundColor: withOpacity(colors.primary, 0.06),
                borderColor: withOpacity(colors.primary, 0.18),
              },
            ]}
          >
            <AppText
              size={20}
              style={[styles.titleText, { color: colors.primary }]}
            >
              {title}
            </AppText>
          </View>

          {/* Divider */}
          <View
            style={[
              styles.divider,
              { backgroundColor: withOpacity(colors.primary, 0.12) },
            ]}
          />

          {/* Description */}
          <View
            style={[
              styles.descriptionCard,
              {
                backgroundColor: withOpacity(colors.primary, 0.04),
                borderColor: withOpacity(colors.primary, 0.12),
                borderLeftColor: withOpacity(colors.primary, 0.5),
              },
            ]}
          >
            <AppText size={15} style={styles.descriptionText}>
              {description}
            </AppText>
          </View>
        </ScrollView>

        {/* Prev / Next navigation */}
        {items.length > 1 && (
          <View
            style={[
              styles.navBar,
              { borderTopColor: withOpacity(colors.primary, 0.1) },
            ]}
          >
            <Pressable
              onPress={() => hasPrev && goTo(currentIndex - 1)}
              style={[
                styles.navBtn,
                {
                  backgroundColor: hasPrev
                    ? withOpacity(colors.primary, 0.08)
                    : withOpacity(colors.primary, 0.03),
                },
              ]}
              disabled={!hasPrev}
            >
              <ARROW_LEFT
                color={hasPrev ? colors.primary : withOpacity(colors.primary, 0.3)}
                width={20}
                height={20}
              />
              <AppText
                size={13}
                style={{
                  color: hasPrev ? colors.primary : withOpacity(colors.primary, 0.3),
                  marginLeft: 6,
                  fontWeight: '600',
                }}
              >
                Previous
              </AppText>
            </Pressable>

            <AppText size={12} style={{ color: withOpacity(colors.primary, 0.5) }}>
              {currentIndex + 1} / {items.length}
            </AppText>

            <Pressable
              onPress={() => hasNext && goTo(currentIndex + 1)}
              style={[
                styles.navBtn,
                {
                  backgroundColor: hasNext
                    ? withOpacity(colors.primary, 0.08)
                    : withOpacity(colors.primary, 0.03),
                },
              ]}
              disabled={!hasNext}
            >
              <AppText
                size={13}
                style={{
                  color: hasNext ? colors.primary : withOpacity(colors.primary, 0.3),
                  marginRight: 6,
                  fontWeight: '600',
                }}
              >
                Next
              </AppText>
              <ARROW_RIGHT
                color={hasNext ? colors.primary : withOpacity(colors.primary, 0.3)}
                width={20}
                height={20}
              />
            </Pressable>
          </View>
        )}
      </View>
    </GradientBg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingTop: SIZES.xsSmall,
    paddingBottom: 24,
  },
  titleBanner: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: SIZES.screenDefaultPadding,
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  titleText: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    marginBottom: SIZES.medium,
    borderRadius: 1,
  },
  descriptionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: SIZES.medium,
  },
  descriptionText: {
    lineHeight: 28,
    letterSpacing: 0.3,
    color: '#2c2c2c',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
});

export default InnerSundarGutkaDetail;
