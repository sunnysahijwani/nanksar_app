import React, { useCallback, useState } from 'react';
import GradientBg from '../../backgrounds/GradientBg';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  isFavourited,
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

  const { page_index } = route.params;
  const [currentPageIndex, setCurrentPageIndex] = useState(page_index || 1);

  // Bookmark — is the current page saved as a reading position?
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const b = getBookmark();
    return b?.page_index === (page_index || 1);
  });

  // Page-level favourite — stored with a negative ID to avoid clashing with item IDs
  const [isPageFavourited, setIsPageFavourited] = useState(() =>
    isFavourited(-( page_index || 1)),
  );

  const { data, isLoading } = useGuruGranthSahibjiBani(
    currentPageIndex,
    currentPageIndex + 5,
  );

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] =
    useState<React.ReactNode | null>(null);

  useFocusEffect(
    useCallback(() => {
      // Re-read storage on every focus so icons reflect changes made on other screens
      const b = getBookmark();
      setIsBookmarked(b?.page_index === currentPageIndex);
      setIsPageFavourited(isFavourited(-currentPageIndex));

      const getMyData = (d: any) => {
        if (!d || !Object.values(d).length) return [];
        let currentData = d?.[`${page_index_prefix + currentPageIndex}`] || [];
        if (!currentData || !currentData?.length) {
          currentData = d?.[`${page_index_prefix + (currentPageIndex - 1)}`] || [];
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

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      clearBookmark();
      setIsBookmarked(false);
    } else {
      saveBookmark({ page_index: currentPageIndex });
      setIsBookmarked(true);
    }
  };

  const handleFavouritePage = () => {
    const pageAsFav: GurbaniKhojFavourite = {
      id: -currentPageIndex,
      page_index: currentPageIndex,
      punjabiText: 'Page ' + currentPageIndex,
    };
    const nowFavourited = toggleFavourite(pageAsFav);
    setIsPageFavourited(nowFavourited);
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
      {/* Page favourite (★ / ☆) */}
      <Pressable onPress={handleFavouritePage} hitSlop={8} style={styles.headerIconBtn}>
        <AppText
          size={24}
          style={{ color: isPageFavourited ? colors.primary : withOpacity(colors.primary, 0.3) }}
        >
          {isPageFavourited ? '★' : '☆'}
        </AppText>
      </Pressable>

      {/* Bookmark (filled ribbon when active, outline when not) */}
      <Pressable onPress={handleBookmarkToggle} hitSlop={8} style={styles.headerIconBtn}>
        <BOOKMARK
          width={22}
          height={26}
          color={isBookmarked ? colors.primary : withOpacity(colors.primary, 0.3)}
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
          <ScrollView className="flex-1">
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
                  <AppText key={index}>
                    <PaathCard
                      handleReadMorePress={handleReadMorePress}
                      data={pathCardData}
                    />
                  </AppText>
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

          {/* bottom sheet */}
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
});
