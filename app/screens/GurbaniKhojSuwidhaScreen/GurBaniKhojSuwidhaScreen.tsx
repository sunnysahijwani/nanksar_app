import React from 'react'
import GradientBg from '../../componets/backgrounds/GradientBg'
import InnerGurbaniKhojSuwidha from '../../componets/blocks/InnerGurBaniKhojSuwidha/InnerGurbaniKhojSuwidha'
import { useRoute } from '@react-navigation/native';

export default function GurBaniKhojSuwidhaScreen() {

    const { params } = useRoute();

    return (
        <GradientBg>
            <InnerGurbaniKhojSuwidha {...params} />
        </GradientBg>
    )
}
