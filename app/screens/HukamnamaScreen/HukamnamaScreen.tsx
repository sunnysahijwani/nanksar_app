import React from 'react';
import InnerHukamnama from '../../componets/blocks/InnerHukamnama/InnerHukamnama';
import GradientBg from '../../componets/backgrounds/GradientBg';

const HukamnamaScreen = () => {
  return (
    <>
      <GradientBg enableSafeAreaView={false}>
        <InnerHukamnama />
      </GradientBg>
    </>
  );
};

export default HukamnamaScreen;
