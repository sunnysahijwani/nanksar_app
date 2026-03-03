import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import GradientBg from '../../componets/backgrounds/GradientBg';
import { ScreenHeaders } from '../../componets';
import AppText from '../../componets/elements/AppText/AppText';
import AppLoader from '../../componets/Loader/AppLoader';
import { useInformation } from '../../hooks/query/useInformation';
import { useAppContext } from '../../context/AppContext';
import { navigate } from '../../utils/NavigationUtils';
import { SIZES, SHADOWS } from '../../utils/theme';

type InformationItem = {
  id: number;
  title_english: string;
  title_punjabi: string;
  slug: string;
  order: number;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export default function InformationListScreen() {
  const { colors, lang } = useAppContext();
  const { data: apiResponse, isLoading, isError } = useInformation();

  const isEnglish = lang.info === 'INFO';

  const sortedItems = useMemo(() => {
    if (!apiResponse?.data) return [];
    return [...apiResponse.data].sort(
      (a: InformationItem, b: InformationItem) => a.order - b.order,
    );
  }, [apiResponse?.data]);

  const renderItem = ({ item }: { item: InformationItem }) => {
    const title = isEnglish ? item.title_english : (item.title_punjabi || item.title_english);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.card, { backgroundColor: '#fff' }, SHADOWS.medium]}
        onPress={() =>
          navigate('InformationDetailScreen', {
            item,
            isEnglish,
          })
        }
      >
        <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
          <AppText size={14} style={styles.orderText}>
            {item.order}
          </AppText>
        </View>
        <View style={styles.cardContent}>
          <AppText size={16} style={[styles.cardTitle, { color: colors.primary }]}>
            {title}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBg colorsList={['#ffffff', '#ffffff']}>
      <View style={styles.container}>
        <ScreenHeaders title={lang.info} isShowFontSize={false} />

        {isLoading && (
          <View style={styles.centered}>
            <AppLoader />
          </View>
        )}

        {isError && (
          <View style={styles.centered}>
            <AppText size={16} style={styles.errorText}>
              Failed to load content. Please try again.
            </AppText>
          </View>
        )}

        {!isLoading && !isError && (
          <FlatList
            data={sortedItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </GradientBg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  orderBadge: {
    width: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    color: '#fff',
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cardTitle: {
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    color: '#e74c3c',
    marginTop: 40,
  },
});
