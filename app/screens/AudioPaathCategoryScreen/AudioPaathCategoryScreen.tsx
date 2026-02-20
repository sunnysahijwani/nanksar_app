import React from 'react';
import GradientBg from '../../componets/backgrounds/GradientBg';
import InnerAudioPaathCategory from '../../componets/blocks/InnerAudioPaathCategory/InnerAudioPaathCategory';

export default function AudioPaathCategoryScreen({ route }: any) {
  const { category, breadcrumbs } = route.params;
  return (
    <GradientBg colorsList={['#ffffff', '#ffffff']}>
      <InnerAudioPaathCategory category={category} breadcrumbs={breadcrumbs} />
    </GradientBg>
  );
}
