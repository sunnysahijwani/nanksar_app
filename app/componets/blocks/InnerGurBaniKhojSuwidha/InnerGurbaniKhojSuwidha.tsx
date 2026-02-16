import React, { useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'
import AudioListingHeader from '../../headers/AudioListingHeader'
import { useGuruGranthSahibjiBani } from '../../../hooks/query/useGuruGranthSahibjiBani';
import AppLoader from '../../Loader/AppLoader';
import PaathList from '../../lists/PaathList';
import AppText from '../../elements/AppText/AppText';
import { emptyListText } from '../../../utils/constant';
import { navigate } from '../../../utils/NavigationUtils';
import { useFocusEffect } from '@react-navigation/native';
import { getCache } from '../../../storage/cache';
import { STORAGE_KEYS } from '../../../storage/keys';


const EmptyListBox = () => {
    return (
        <View className='flex-1 justify-center  items-center' style={{ flex: 1 }}>
            <AppText >{emptyListText}</AppText>
        </View>
    )
}

export default function InnerGurbaniKhojSuwidha() {

    const [gurbaniRecords, setGurbaniRecords] = useState<any[]>([]);


    const { data, isLoading } = useGuruGranthSahibjiBani(1, 20);

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

    const renderItem = useCallback(
        ({ item, index }: any) => {
            return <AppText className='mx-3'>
                <PaathList punjabiText={getPujabiText(item)} englishText={getEnglishText(item)} onPress={() => handleOnListCardPress(item)}
                    isActive={
                        item?.page_index === user_previous_page_index &&
                        gurbaniRecords?.findLastIndex((i: any) => i?.page_index === item?.page_index) === index
                    } />
            </AppText>
        },
        [user_previous_page_index, gurbaniRecords],
    );

    if (isLoading) return <AppLoader fullScreen />

    return (
        <View className='flex-1' style={{ flex: 1 }}>
            <View>
                <AudioListingHeader />
            </View>

            {/* list section  */}
            <FlatList
                data={gurbaniRecords}
                renderItem={renderItem}
                contentContainerStyle={getListData(data).length === 0 && { flex: 1 }}
                keyExtractor={(item) => item?.id?.toString()}
                refreshing={isLoading}
                ListEmptyComponent={EmptyListBox}
                removeClippedSubviews={true}
                initialNumToRender={10}
                windowSize={10}
                updateCellsBatchingPeriod={50}
            />

        </View>
    )
}


