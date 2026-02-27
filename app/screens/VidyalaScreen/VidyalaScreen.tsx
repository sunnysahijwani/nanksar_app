import React from 'react';
import GradientBg from '../../componets/backgrounds/GradientBg';
import InnerVidyala from '../../componets/blocks/InnerVidyala/InnerVidyala';

export default function VidyalaScreen() {
  return (
    <GradientBg colorsList={['#ffffff', '#ffffff']}>
      <InnerVidyala />
    </GradientBg>
  );
}
