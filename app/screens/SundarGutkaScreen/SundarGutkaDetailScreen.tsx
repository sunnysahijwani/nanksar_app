import React from 'react'
import GradientBg from '../../componets/backgrounds/GradientBg';
import InnerSundarGutkaListing from '../../componets/blocks/InnerSundarGutka/InnerSundarGutkaListing';
import InnerSundarGutkaDetail from '../../componets/blocks/InnerSundarGutka/InnerSundarGutkaDetail';

const SundarGutkaDetailScreen = ({ navigation, route }: { navigation: any, route: any }) => {
  return (
    <GradientBg>
      <InnerSundarGutkaDetail route={route} />
    </GradientBg>
  )
}

export default SundarGutkaDetailScreen;