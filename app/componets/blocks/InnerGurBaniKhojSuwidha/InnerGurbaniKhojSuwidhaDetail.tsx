import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GradientBg from '../../backgrounds/GradientBg';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import { SIZES } from '../../../utils/theme';
import { formatScriptureData } from '../../../utils/helper';
import PaathCard from '../../cards/PaathCard';
import { Explanation } from '../../../utils/type';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { useGuruGranthSahibjiBani } from '../../../hooks/query/useGuruGranthSahibjiBani';
import AppLoader from '../../Loader/AppLoader';
import { setCache } from '../../../storage/cache';
import { STORAGE_KEYS } from '../../../storage/keys';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '../../BottomSheets/BottomSheet';
import BrieflyExplainText from '../../elements/AppText/BrieflyExplainText';
import { ArrowLeft, ArrowRight } from '../../../assets';
import InnerBottomSettings from '../innerSetting/InnerBottomSettings';
import {
  getBookmark,
  saveBookmark,
  clearBookmark,
} from '../../../storage/gurbaniKhojBookmark';
import {
  getFavourites,
  toggleFavourite,
  type GurbaniKhojFavourite,
} from '../../../storage/gurbaniKhojFavourites';
import { useAppContext } from '../../../context/AppContext';
import { withOpacity } from '../../../utils/helper';
import { BOOKMARK } from '../../../assets/svgs';

const page_index_prefix = 'page_index_';

export default function InnerGurbaniKhojSuwidhaDetail({ route }: any) {
  const { colors } = useAppContext();
  const [myContentData, setMyContentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { page_index, scroll_to_id } = route.params ?? {};

  const [currentPageIndex, setCurrentPageIndex] = useState(page_index || 1);

  // Bookmark
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const b = getBookmark();
    return b?.page_index === (page_index || 1);
  });

  // Set of favourited verse IDs — used to show ★/☆ in header
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(
    () => new Set(getFavourites().map(f => f.id)),
  );

  // Favourite selection modal state
  const [showFavouriteModal, setShowFavouriteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // True if any verse on the current page is already favourited
  const isAnyItemFavourited = useMemo(
    () => myContentData.some((item: any) => favouriteIds.has(item.id)),
    [myContentData, favouriteIds],
  );

  const { data, isLoading } = useGuruGranthSahibjiBani(
    currentPageIndex,
    currentPageIndex + 5,
  );

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] =
    useState<React.ReactNode | null>(null);

  // Scroll-to support — track each item's Y offset within the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  const itemOffsetsRef = useRef<Record<number, number>>({});
  const hasScrolledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      const b = getBookmark();
      setIsBookmarked(b?.page_index === currentPageIndex);
      setFavouriteIds(new Set(getFavourites().map(f => f.id)));

      // Reset scroll tracking when page changes
      hasScrolledRef.current = false;
      itemOffsetsRef.current = {};

      const getMyData = (d: any) => {
        if (!d || !Object.values(d).length) return [];
        let currentData = d?.[`${page_index_prefix + currentPageIndex}`] || [];
        if (!currentData || !currentData?.length) {
          currentData =
            d?.[`${page_index_prefix + (currentPageIndex - 1)}`] || [];
        }
        setLoading(false);
        return currentData;
      };
      setMyContentData(getMyData(data));
      setCache(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_PAGE, currentPageIndex);

      return () => {
        setMyContentData([]);
        setLoading(true);
      };
    }, [currentPageIndex, data]),
  );

  // Auto-scroll to target verse after layout settles
  useEffect(() => {
    if (!scroll_to_id || hasScrolledRef.current || loading || isLoading) return;
    const timer = setTimeout(() => {
      const offset = itemOffsetsRef.current[scroll_to_id];
      if (offset !== undefined) {
        scrollViewRef.current?.scrollTo({ y: offset, animated: true });
        hasScrolledRef.current = true;
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [scroll_to_id, loading, isLoading, myContentData]);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      clearBookmark();
      setIsBookmarked(false);
    } else {
      saveBookmark({ page_index: currentPageIndex });
      setIsBookmarked(true);
    }
  };

  // Open the selection modal, pre-selecting an already-favourited item if any
  const handleFavouritePress = () => {
    const alreadySaved = myContentData.find((item: any) =>
      favouriteIds.has(item.id),
    );
    setSelectedItemId(alreadySaved?.id ?? myContentData[0]?.id ?? null);
    setShowFavouriteModal(true);
  };

  // Save (or remove) the chosen verse as a favourite
  const handleSaveFavourite = () => {
    if (selectedItemId === null) return;
    const item = myContentData.find((i: any) => i.id === selectedItemId);
    if (!item) return;

    const payload: GurbaniKhojFavourite = {
      id: item.id,
      page_index: item.page_index,
      punjabiText: item.text ?? '',
      englishText:
        item.transliterations?.find(
          (t: any) => t?.language?.language === 'English',
        )?.text ?? '',
    };
    toggleFavourite(payload);
    setFavouriteIds(new Set(getFavourites().map(f => f.id)));
    setShowFavouriteModal(false);
  };

  const handleReadMorePress = (textObj: Explanation) => {
    setBottomSheetContent(
      <BrieflyExplainText textObj={textObj} textSize={14} />,
    );
    setOpenBottomSheet(true);
  };

  const handleSettingsPress = () => {
    setBottomSheetContent(<InnerBottomSettings />);
    setOpenBottomSheet(true);
  };

  const headerRightActions = (
    <>
      {/* Verse favourite — opens selection overlay */}
      <Pressable
        onPress={handleFavouritePress}
        hitSlop={8}
        style={styles.headerIconBtn}
      >
        <AppText
          size={24}
          style={{
            color: isAnyItemFavourited
              ? colors.primary
              : withOpacity(colors.primary, 0.3),
          }}
        >
          {isAnyItemFavourited ? '★' : '☆'}
        </AppText>
      </Pressable>

      {/* Bookmark */}
      <Pressable
        onPress={handleBookmarkToggle}
        hitSlop={8}
        style={styles.headerIconBtn}
      >
        <BOOKMARK
          width={22}
          height={26}
          color={
            isBookmarked ? colors.primary : withOpacity(colors.primary, 0.3)
          }
          filled={isBookmarked}
        />
      </Pressable>
    </>
  );

  return (
    <>
      <GradientBg colorsList={['#f8fafc', '#ffffff', '#ffffff']}>
        <View className="flex-1">
          <View>
            <AudioListingHeader
              handleSettingsPress={handleSettingsPress}
              isSearchBarShow={false}
              rightActions={headerRightActions}
            />
          </View>

          {/* main content area */}
          <ScrollView ref={scrollViewRef} className="flex-1">
            <View
              className="items-center justify-center"
              style={{
                paddingHorizontal: SIZES.screenDefaultPadding,
                paddingVertical: SIZES.screenDefaultPadding,
                gap: SIZES.xsSmall,
              }}
            >
              {(isLoading || loading) && <AppLoader />}
              {myContentData?.length === 0 && !isLoading && !loading && (
                <View>
                  <AppText>{emptyListText}</AppText>
                </View>
              )}

              {myContentData?.map((item: any, index: number) => {
                const pathCardData = formatScriptureData(item);
                return (
                  <View
                    key={item.id ?? index}
                    onLayout={e => {
                      // Capture y immediately — the event object is pooled and
                      // will be nullified before any async callback fires.
                      const y = e.nativeEvent.layout.y;
                      itemOffsetsRef.current[item.id] = y;
                      if (
                        scroll_to_id &&
                        item.id === scroll_to_id &&
                        !hasScrolledRef.current
                      ) {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollTo({ y, animated: true });
                          hasScrolledRef.current = true;
                        }, 100);
                      }
                    }}
                  >
                    <AppText>
                      <PaathCard
                        handleReadMorePress={handleReadMorePress}
                        data={pathCardData}
                      />
                    </AppText>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom navigation: Prev | Next */}
          <View style={styles.bottomNav}>
            <Pressable
              onPress={() => setCurrentPageIndex(currentPageIndex - 1)}
              style={styles.navArrow}
            >
              <ArrowLeft color="#0B3C5D" />
            </Pressable>

            <Pressable
              onPress={() => setCurrentPageIndex(currentPageIndex + 1)}
              style={styles.navArrow}
            >
              <ArrowRight color="#0B3C5D" />
            </Pressable>
          </View>

          {/* bottom sheet for read-more / settings */}
          <BottomSheet
            isOpen={openBottomSheet}
            onClose={() => setOpenBottomSheet(false)}
          >
            <View
              style={{
                paddingHorizontal: SIZES.screenDefaultPadding,
                backgroundColor: '#FFFF2200',
              }}
            >
              {bottomSheetContent}
            </View>
          </BottomSheet>
        </View>
      </GradientBg>

      {/* ── Favourite selection overlay ── */}
      <Modal
        visible={showFavouriteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFavouriteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header row */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowFavouriteModal(false)}
                hitSlop={10}
                style={styles.modalBackBtn}
              >
                <AppText size={22} style={{ color: '#333' }}>
                  ←
                </AppText>
              </TouchableOpacity>
              <AppText size={17} style={styles.modalTitle}>
                Add to Favourites
              </AppText>
              <AppText
                size={22}
                style={{ color: colors.primary, paddingRight: 4 }}
              >
                ★
              </AppText>
            </View>

            {/* Instruction */}
            <View style={styles.modalInstruction}>
              <AppText
                size={13}
                style={[styles.modalInstructionText, { color: colors.primary }]}
              >
                Select which line to save as favourite.
              </AppText>
            </View>

            {/* Radio list */}
            <ScrollView
              style={styles.radioScroll}
              showsVerticalScrollIndicator={false}
            >
              {myContentData.map((item: any) => {
                const isSelected = selectedItemId === item.id;
                const alreadySaved = favouriteIds.has(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedItemId(item.id)}
                    activeOpacity={0.7}
                    style={styles.radioRow}
                  >
                    {/* Radio circle */}
                    <View
                      style={[
                        styles.radioCircle,
                        { borderColor: colors.primary },
                        isSelected && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>

                    {/* Verse text */}
                    <AppText
                      size={15}
                      style={[
                        styles.radioText,
                        {
                          color: isSelected
                            ? colors.primary
                            : alreadySaved
                              ? withOpacity(colors.primary, 0.7)
                              : '#333',
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {item.text}
                      {alreadySaved ? '  ★' : ''}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Save / Remove button */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleSaveFavourite}
                activeOpacity={0.85}
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor:
                      selectedItemId !== null &&
                      favouriteIds.has(selectedItemId)
                        ? '#c0392b'
                        : colors.primary,
                  },
                ]}
              >
                <AppText size={15} style={styles.saveBtnText}>
                  {selectedItemId !== null && favouriteIds.has(selectedItemId)
                    ? 'Remove from Favourites'
                    : 'Save'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerIconBtn: {
    padding: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navArrow: {
    padding: 12,
    paddingHorizontal: 20,
  },

  // Modal overlay — semi-transparent full screen
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
  },
  // White card that slides in from the top
  modalCard: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  modalBackBtn: {
    padding: 2,
  },
  modalTitle: {
    flex: 1,
    fontWeight: '700',
    color: '#222',
  },

  // Instruction
  modalInstruction: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalInstructionText: {
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },

  // Radio list
  radioScroll: {
    maxHeight: 360,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 14,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  radioText: {
    flex: 1,
    lineHeight: 22,
  },

  // Actions
  modalActions: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
