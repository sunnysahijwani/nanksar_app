import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import GradientBg from '../../backgrounds/GradientBg';
import AppText from '../../elements/AppText/AppText';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_LEFT, ARROW_RIGHT } from '../../../assets/svgs';
import { SIZES } from '../../../utils/theme';
import MainHeader from '../../headers/MainHeader';
import { BeantBaniyanService } from '../../../api/services/BeantBaniyan.service';

type DescriptionEntry = {
  index: number;
  title: string;
  content: string;
};

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

const HEADER_BAR_HEIGHT = 48;

const InnerSundarGutkaDetail = ({ route }: any) => {
  const { colors } = useAppContext();
  const { item: initialItem, items = [], index: initialIndex = 0 } = route?.params || {};

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [descriptions, setDescriptions] = useState<DescriptionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);
  const [descriptionLayouts, setDescriptionLayouts] = useState<{ [key: number]: number }>({});

  const currentItem = items[currentIndex] ?? initialItem;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const HEADER_TOTAL = HEADER_BAR_HEIGHT + SIZES.screenDefaultPadding;
  const previousScrollY = useSharedValue(0);
  const headerOffset = useSharedValue(0);

  const loadDescriptions = useCallback(async () => {
    setLoading(true);
    setDescriptions([]);
    setDescriptionLayouts({});
    try {
      const item = items[currentIndex] ?? initialItem;
      if (item?.description_file_url) {
        const data = await BeantBaniyanService.getDescriptionsFromUrl(item.description_file_url);
        setDescriptions(Array.isArray(data) ? data : []);
      } else if (item?.descriptions_data && Array.isArray(item.descriptions_data)) {
        setDescriptions(item.descriptions_data);
      } else if (item?.id) {
        const response = await BeantBaniyanService.getShow(item.id);
        if (response?.data?.descriptions_data) {
          setDescriptions(response.data.descriptions_data);
        } else if (response?.data?.description_file_url) {
          const data = await BeantBaniyanService.getDescriptionsFromUrl(response.data.description_file_url);
          setDescriptions(Array.isArray(data) ? data : []);
        }
      }
    } catch (e) {
      console.error('Failed to load descriptions:', e);
    } finally {
      setLoading(false);
    }
  }, [currentIndex, items, initialItem]);

  useEffect(() => {
    loadDescriptions();
  }, [loadDescriptions]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = previousScrollY.value - currentY;
      headerOffset.value = withTiming(
        Math.min(Math.max(headerOffset.value + diff, -HEADER_TOTAL), 0),
        { duration: 200 },
      );
      const maxScrollY = event.contentSize.height - event.layoutMeasurement.height;
      previousScrollY.value = withTiming(
        Math.min(Math.max(currentY, 0), maxScrollY),
        { duration: 200 },
      );
    },
  });

  const headerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerOffset.value }],
  }));

  const goTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    previousScrollY.value = 0;
    headerOffset.value = 0;
    (scrollRef.current as any)?.scrollTo?.({ y: 0, animated: false });
  };

  const handleDescriptionLayout = (descIndex: number, y: number) => {
    setDescriptionLayouts((prev) => ({ ...prev, [descIndex]: y }));
  };

  const scrollToDescription = (descIndex: number) => {
    setTocVisible(false);
    const y = descriptionLayouts[descIndex];
    if (y !== undefined) {
      setTimeout(() => {
        (scrollRef.current as any)?.scrollTo?.({ y, animated: true });
      }, 300);
    }
  };

  const tocEntries = descriptions.filter((d) => d.title && d.title.trim() !== '');

  const bookIcon = tocEntries.length > 0 ? (
    <TouchableOpacity
      onPress={() => setTocVisible(true)}
      activeOpacity={0.7}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
      }}
    >
      <Image
        source={require('../../../assets/images/bookmark.png')}
        style={{ width: 28, height: 28 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  ) : null;

  return (
    <>
      <GradientBg colorsList={['#f8fafc', '#ffffff', '#ffffff']} enableSafeAreaView={false}>
        <View style={styles.container}>
          <Animated.View style={[styles.headerSafeArea, headerAnimStyle]}>
            <MainHeader
              isShowSearchIcon={false}
              isfontSizeShow={false}
              rightExtra={bookIcon}
            />
          </Animated.View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <Animated.ScrollView
              ref={scrollRef}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingTop: HEADER_TOTAL },
              ]}
              showsVerticalScrollIndicator={false}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            >
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
                {descriptions.map((desc, i) => (
                  <View
                    key={desc.index}
                    onLayout={(e) => handleDescriptionLayout(desc.index, e.nativeEvent.layout.y)}
                  >
                    {i > 0 && <View style={styles.paragraphSpacer} />}
                    <AppText size={15} style={styles.descriptionText}>
                      {stripHtml(desc.content || '')}
                    </AppText>
                  </View>
                ))}
              </View>

              {descriptions.length === 0 && (
                <View style={styles.emptyBox}>
                  <AppText size={14} style={{ color: '#999' }}>
                    No content available.
                  </AppText>
                </View>
              )}
            </Animated.ScrollView>
          )}

          {/* Prev / Next navigation */}
          {items.length > 1 && (
            <View
              style={[styles.navBar, { borderTopColor: withOpacity(colors.primary, 0.1) }]}
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

      {/* Table of Contents Modal */}
      <Modal
        visible={tocVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTocVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setTocVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: '#fff' }]} onPress={() => {}}>
            <View style={[styles.modalHeader, { borderBottomColor: withOpacity(colors.primary, 0.15) }]}>
              <AppText size={18} style={{ fontWeight: '700', color: colors.primary }}>
                Contents
              </AppText>
              <TouchableOpacity onPress={() => setTocVisible(false)} activeOpacity={0.7}>
                <AppText size={16} style={{ color: colors.primary, fontWeight: '600' }}>
                  Close
                </AppText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {tocEntries.map((desc, i) => (
                <TouchableOpacity
                  key={desc.index}
                  onPress={() => scrollToDescription(desc.index)}
                  activeOpacity={0.7}
                  style={[
                    styles.tocItem,
                    { borderBottomColor: withOpacity(colors.primary, 0.1) },
                  ]}
                >
                  <View style={[styles.tocIndex, { backgroundColor: withOpacity(colors.primary, 0.1) }]}>
                    <AppText size={13} style={{ color: colors.primary, fontWeight: '700' }}>
                      {i + 1}
                    </AppText>
                  </View>
                  <AppText
                    size={15}
                    style={[styles.tocTitle, { color: colors.primary }]}
                    numberOfLines={2}
                  >
                    {desc.title}
                  </AppText>
                  <ARROW_RIGHT
                    color={withOpacity(colors.primary, 0.4)}
                    width={16}
                    height={16}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingBottom: 24,
  },
  descriptionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: SIZES.medium,
  },
  paragraphSpacer: {
    height: 20,
  },
  descriptionText: {
    lineHeight: 28,
    letterSpacing: 0.3,
    color: '#2c2c2c',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalList: {
    paddingHorizontal: SIZES.screenDefaultPadding,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  tocIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tocTitle: {
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginRight: 8,
  },
});

export default InnerSundarGutkaDetail;
