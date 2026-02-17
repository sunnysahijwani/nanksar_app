import React, { useCallback, useState } from 'react';
import GradientBg from '../../backgrounds/GradientBg';
import { Pressable, ScrollView, View } from 'react-native';
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

const page_index_prefix = 'page_index_';

export default function InnerGurbaniKhojSuwidhaDetail({ route }: any) {
  const [myContentData, setMyContentData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const { page_index } = route.params;

  const [currentPageIndex, setCurrentPageIndex] = useState(page_index || 1);

  const { data, isLoading } = useGuruGranthSahibjiBani(
    currentPageIndex,
    currentPageIndex + 5,
  );

  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const [bottomSheetContent, setBottomSheetContent] =
    useState<React.ReactNode | null>(null);

  useFocusEffect(
    useCallback(() => {
      const getMyData = (data: any) => {
        if (!data || !Object.values(data).length) return [];
        let currentData =
          data?.[`${page_index_prefix + currentPageIndex}`] || [];
        if (!currentData || !currentData?.length) {
          currentData =
            data?.[`${page_index_prefix + (currentPageIndex - 1)}`] || [];
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

  return (
    <>
      <GradientBg colorsList={['#ffffff', '#ffffff']}>
        <View className="flex-1">
          <View>
            <AudioListingHeader
              handleSettingsPress={handleSettingsPress}
              isSearchBarShow={false}
            />
          </View>

          {/* main content ares  */}
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

          {/* bottom navigation for next and previous */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => setCurrentPageIndex(currentPageIndex - 1)}
                className="p-3 px-5"
              >
                <ArrowLeft color="#0B3C5D" />
              </Pressable>
            </View>

            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => setCurrentPageIndex(currentPageIndex + 1)}
                className="p-3 px-5"
              >
                <ArrowRight color="#0B3C5D" />
              </Pressable>
            </View>
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
