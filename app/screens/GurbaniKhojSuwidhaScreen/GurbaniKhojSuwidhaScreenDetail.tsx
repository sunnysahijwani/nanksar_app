import React from 'react'
import InnerGurbaniKhojSuwidhaDetail from '../../componets/blocks/InnerGurBaniKhojSuwidha/InnerGurbaniKhojSuwidhaDetail'
import GradientBg from '../../componets/backgrounds/GradientBg'

export default function GurbaniKhojSuwidhaScreenDetail({ navigation, route }: any) {
  return (
    <GradientBg>
      <InnerGurbaniKhojSuwidhaDetail route={route} navigation={navigation} />
    </GradientBg>
  )
}
