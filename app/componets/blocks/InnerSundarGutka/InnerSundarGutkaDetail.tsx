import React from 'react'
import { ScrollView, View } from 'react-native';
import AudioListingHeader from '../../headers/AudioListingHeader';
import { SIZES } from '../../../utils/theme';
import PaathList from '../../lists/PaathList';
import PaathCard from '../../cards/PaathCard';

const InnerSundarGutkaDetail = () => {
    return (
        <View className='flex-1' style={{ flex: 1, }}>
            <View>
                <AudioListingHeader />
            </View>

            <ScrollView style={{ flex: 1, }}>
                <View style={{ paddingHorizontal: SIZES.screenDefaultPadding, paddingVertical: SIZES.screenDefaultPadding, gap: SIZES.xsSmall }}>
                    <PaathCard punjabiText="ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥"  englishText="One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru's Grace ~ "/>
                    <PaathCard punjabiText="ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥" hindiText="हिंदी हिंदी हिंदी हिंदी हिंदी हिंदी हिंदी हिंदी हिंदी " />
                </View>
            </ScrollView>
        </View>
    )
}

export default InnerSundarGutkaDetail;
