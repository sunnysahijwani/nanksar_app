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
import Animated from 'react-native-reanimated';
import AppText from '../../elements/AppText/AppText';
import DropdownMenuHeader from '../../headers/DropdownMenuHeader';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { ARROW_LEFT, ARROW_RIGHT } from '../../../assets/svgs';
import { SIZES } from '../../../utils/theme';
import { BeantBaniyanService } from '../../../api/services/BeantBaniyan.service';
import AppHeader from '../../headers/AppHeader';
import { useLocalize } from '../../../hooks/useLocalize';

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

const InnerSundarGutkaDetail = ({ route }: any) => {
  const { colors } = useAppContext();
  const { t } = useLocalize();

  const { item: initialItem, items = [], index: initialIndex = 0 } = route?.params || {};

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const scrollRef = useRef<ScrollView>(null);
  const [descriptions, setDescriptions] = useState<DescriptionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);
  const [descriptionLayouts, setDescriptionLayouts] = useState<{ [key: number]: number }>({});

  const currentItem = items[currentIndex] ?? initialItem;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

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

  const goTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
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
        {/* Header */}
        {/* <DropdownMenuHeader
          showDashboardOption
          showTranslateOption
          showFontSizeOption
          showTocOption={tocEntries.length > 0}
          showTocIcon={tocEntries.length > 0}
          onTocPress={() => setTocVisible(true)}
          onTocIconPress={() => setTocVisible(true)}
        /> */}
        <AppHeader title={t(currentItem, 'title')} />

        {/* Scrollable content inside the frame */}
        <View style={styles.contentWrapper}>
          <View style={styles.frameOverlay} pointerEvents="none">
            <Image
              source={require('../../../assets/images/sundar_gutka_background.png')}
              style={styles.frameImage}
              resizeMode="stretch"
            />
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.scrollBoundary}>
              <ScrollView
                ref={scrollRef as any}
                style={styles.scrollArea}
                contentContainerStyle={[
                  styles.scrollContent,
                ]}
                showsVerticalScrollIndicator={false}
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
              </ScrollView>
            </View>
          )}
        </View>

        {/* Prev / Next navigation — rendered AFTER frame so it's on top */}
        {/* {items.length > 1 && (
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
        )} */}
      </View>

      {/* Table of Contents Modal */}
      <Modal
        visible={tocVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTocVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setTocVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: '#fff' }]} onPress={() => { }}>
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
    // Removed #fff to let global background show through
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 20,
    marginTop: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  frameImage: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBoundary: {
    flex: 1,
    zIndex: 1,
    marginVertical: 45, // Clips scroll content within the border top and bottom
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: 10,
  },
  descriptionCard: {
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
