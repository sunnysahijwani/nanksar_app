import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../elements/AppText/AppText';
import GoBack from '../../smartComponents/GoBack';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_LEFT, ARROW_RIGHT } from '../../../assets/svgs';
import { SIZES } from '../../../utils/theme';
import { resetAndNavigate } from '../../../utils/NavigationUtils';
import { BeantBaniyanService } from '../../../api/services/BeantBaniyan.service';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

const HEADER_BAR_HEIGHT = 56;

const InnerSundarGutkaDetail = ({ route }: any) => {
  const { colors, lang, switchLang } = useAppContext();
  const insets = useSafeAreaInsets();
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

  const HEADER_TOTAL = insets.top + HEADER_BAR_HEIGHT;
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
      const diff = currentY - previousScrollY.value;

      if (currentY <= 0) {
        headerOffset.value = withTiming(0, { duration: 200 });
      } else if (diff > 3) {
        headerOffset.value = withTiming(-HEADER_TOTAL, { duration: 250 });
      } else if (diff < -3) {
        headerOffset.value = withTiming(0, { duration: 250 });
      }

      previousScrollY.value = currentY;
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

  return (
    <>
      <View style={styles.container}>
        {/* Scrollable content (behind the frame) */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <Animated.ScrollView
            ref={scrollRef}
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: SCREEN_HEIGHT * 0.17 + HEADER_BAR_HEIGHT },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            <View style={styles.descriptionCard}>
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

        {/* Frame image overlay (full screen, passes touches through) */}
        <View style={styles.frameOverlay} pointerEvents="none">
          <Image
            source={require('../../../assets/images/sundar_gutka_background.png')}
            style={styles.frameImage}
            resizeMode="stretch"
          />
        </View>

        {/* Header — rendered AFTER frame so it's on top (Android respects JSX order) */}
        <Animated.View style={[styles.headerSafeArea, headerAnimStyle]}>
          <View style={{ height: insets.top }} />
          <View style={styles.header}>
            <GoBack
              title={lang?.nanaksarAmritGhar}
              textStyle={{ fontWeight: '700', fontSize: 20, color: colors.primary, width: 200 } as any}
              color={colors.lightBlue}
            />
            <View style={styles.headerRight}>
              {tocEntries.length > 0 && (
                <TouchableOpacity
                  onPress={() => setTocVisible(true)}
                  activeOpacity={0.7}
                  style={styles.headerIconBtn}
                >
                  <Image
                    source={require('../../../assets/images/bookmark.png')}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => switchLang()}
                activeOpacity={0.7}
                style={styles.headerIconBtn}
              >
                <Image
                  source={require('../../../assets/images/translation.png')}
                  style={{ width: 40, height: 40, borderRadius: 15 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => resetAndNavigate('Home')}
                activeOpacity={0.7}
                style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
              >
                <Image
                  source={require('../../../assets/images/nanaksar_logo.png')}
                  style={{ width: 50, height: 50, borderRadius: 15 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Prev / Next navigation — rendered AFTER frame so it's on top */}
        {items.length > 1 && (
          <View style={[styles.navBar, { bottom: SCREEN_HEIGHT * 0.03 + insets.bottom }]}>
            <Pressable
              onPress={() => hasPrev && goTo(currentIndex - 1)}
              style={[styles.navBtn, !hasPrev && { opacity: 0.5 }]}
              disabled={!hasPrev}
            >
              <ARROW_LEFT
                color={colors.primary}
                width={20}
                height={20}
              />
              <AppText
                size={13}
                style={{ color: colors.primary, marginLeft: 6, fontWeight: '600' }}
              >
                Previous
              </AppText>
            </Pressable>

            <AppText size={12} style={{ color: colors.primary, fontWeight: '600' }}>
              {currentIndex + 1} / {items.length}
            </AppText>

            <Pressable
              onPress={() => hasNext && goTo(currentIndex + 1)}
              style={[styles.navBtn, !hasNext && { opacity: 0.5 }]}
              disabled={!hasNext}
            >
              <AppText
                size={13}
                style={{ color: colors.primary, marginRight: 6, fontWeight: '600' }}
              >
                Next
              </AppText>
              <ARROW_RIGHT
                color={colors.primary}
                width={20}
                height={20}
              />
            </Pressable>
          </View>
        )}
      </View>

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
    zIndex: 20,
    elevation: 20,
  },
  header: {
    height: HEADER_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: SCREEN_WIDTH * 0.06,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    flex: 1,
    marginHorizontal: SCREEN_WIDTH * 0.08,
  },
  scrollContent: {
    paddingBottom: SCREEN_HEIGHT * 0.25,
    paddingHorizontal: 15,
  },
  descriptionCard: {
    padding: SIZES.medium,
  },
  frameOverlay: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.015,
    left: -SCREEN_WIDTH * 0.04,
    right: -SCREEN_WIDTH * 0.04,
    bottom: -SCREEN_HEIGHT * 0.015,
    zIndex: 5,
    elevation: 5,
  },
  frameImage: {
    flex: 1,
    width: '100%',
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
    position: 'absolute',
    left: SCREEN_WIDTH * 0.1,
    right: SCREEN_WIDTH * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
    elevation: 20,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
