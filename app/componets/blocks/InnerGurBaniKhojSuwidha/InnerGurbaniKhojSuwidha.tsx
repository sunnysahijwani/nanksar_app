import React, { useCallback, useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'
import AudioListingHeader from '../../headers/AudioListingHeader'
import { useGuruGranthSahibjiBani, useGuruGranthSahibjiBaniSearch } from '../../../hooks/query/useGuruGranthSahibjiBani';
import AppLoader from '../../Loader/AppLoader';
import PaathList from '../../lists/PaathList';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { navigate } from '../../../utils/NavigationUtils';
import { useFocusEffect } from '@react-navigation/native';
import { getCache } from '../../../storage/cache';
import { STORAGE_KEYS } from '../../../storage/keys';
import PunjabiKeyboard from '../../elements/PunjabiKeyboard/PunjabiKeyboard';


const EmptyListBox = () => {
    return (
        <View className='flex-1 justify-center  items-center' style={{ flex: 1 }}>
            <AppText >{emptyListText}</AppText>
        </View>
    )
}

export default function InnerGurbaniKhojSuwidha() {

    const [gurbaniRecords, setGurbaniRecords] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [showKeyboard, setShowKeyboard] = useState(false);

    const { data, isLoading } = useGuruGranthSahibjiBani(1, 20);
    const { data: searchData, isLoading: isSearching } = useGuruGranthSahibjiBaniSearch(searchText);

    const user_previous_page_index = getCache<number>(STORAGE_KEYS.GURU_GRANTH_SHIB_JI_BANI_PAGE) || 20;

    const getListData = (ListData: any) => {
        if (!ListData || !Object.values(ListData).length) return [];
        return Object.values(ListData ?? {})?.flat();
    }

    const getPujabiText = (PujabiText: any) => {
        if (!PujabiText || !PujabiText?.text) return '';
        return PujabiText?.text;
    }
    const getEnglishText = (TextData: any) => {
        if (!TextData || !TextData?.transliterations || !TextData?.transliterations?.length) return '';
        return TextData?.transliterations?.find((t: any) => t?.language?.language === 'English')?.text || '';
    }

    const handleOnListCardPress = (item: any) => {
        navigate('GurBaniKhojSuwidhaDetailScreen', { page_index: item?.page_index || '-1' });
    }

    useFocusEffect(
        useCallback(() => {
            setGurbaniRecords((prevRecords: any[]) => ([
                ...prevRecords,
                ...getListData(data),
            ]));

            return () => {
                setGurbaniRecords([]);
            };
        }, [data])
    );

    // Search results flattened
    const searchResults = useMemo(() => {
        if (!searchText || !searchData) return [];
        return getListData(searchData);
    }, [searchText, searchData]);

    const isSearchMode = searchText.length > 0;
    const displayData = isSearchMode ? searchResults : gurbaniRecords;
    const loading = isSearchMode ? isSearching : isLoading;

    const handleSearchIconPress = () => {
        setShowKeyboard(prev => !prev);
    };

    const handleKeyPress = (char: string) => {
        setSearchText(prev => prev + char);
    };

    const handleBackspace = () => {
        setSearchText(prev => prev.slice(0, -1));
    };

    const handleClearSearch = () => {
        setSearchText('');
        setShowKeyboard(false);
    };

    const handleToggleKeyboard = () => {
        setShowKeyboard(false);
    };

    const renderItem = useCallback(
        ({ item, index }: any) => {
            return <AppText className='mx-3'>
                <PaathList punjabiText={getPujabiText(item)} englishText={getEnglishText(item)} onPress={() => handleOnListCardPress(item)}
                    isActive={
                        !isSearchMode &&
                        item?.page_index === user_previous_page_index &&
                        gurbaniRecords?.findLastIndex((i: any) => i?.page_index === item?.page_index) === index
                    } />
            </AppText>
        },
        [user_previous_page_index, gurbaniRecords, isSearchMode],
    );

    if (isLoading && !isSearchMode) return <AppLoader fullScreen />

    return (
        <View className='flex-1' style={{ flex: 1 }}>
            <View>
                <AudioListingHeader
                    punjabiSearchActive={showKeyboard || isSearchMode}
                    searchText={searchText}
                    onSearchIconPress={handleSearchIconPress}
                    onClearSearch={handleClearSearch}
                />
            </View>

            {/* Search result count */}
            {isSearchMode && !loading && (
                <View style={{ paddingHorizontal: 16, paddingVertical: 6, alignItems: 'center' }}>
                    <AppText size={13} style={{ color: '#888' }}>
                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                    </AppText>
                </View>
            )}

            {/* list section  */}
            <FlatList
                data={displayData}
                renderItem={renderItem}
                contentContainerStyle={displayData.length === 0 && !loading ? { flex: 1 } : undefined}
                keyExtractor={(item) => item?.id?.toString()}
                refreshing={loading}
                ListEmptyComponent={loading ? <AppLoader /> : EmptyListBox}
                removeClippedSubviews={true}
                initialNumToRender={10}
                windowSize={10}
                updateCellsBatchingPeriod={50}
            />

            {/* Punjabi keyboard at the bottom */}
            {showKeyboard && (
                <PunjabiKeyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onToggleKeyboard={handleToggleKeyboard}
                />
            )}

        </View>
    )
}
