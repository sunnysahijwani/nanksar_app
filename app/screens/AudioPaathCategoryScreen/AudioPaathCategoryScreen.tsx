import React from 'react';
import InnerAudioPaathCategory from '../../componets/blocks/InnerAudioPaathCategory/InnerAudioPaathCategory';

export default function AudioPaathCategoryScreen({ route }: any) {
  const { category, breadcrumbs } = route.params;
  return (
    <InnerAudioPaathCategory category={category} breadcrumbs={breadcrumbs} />
  );
}
