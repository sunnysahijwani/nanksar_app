import React from 'react';
import GradientBg from '../../componets/backgrounds/GradientBg';
import InnerGalleryListing from '../../componets/blocks/InnerGallery/InnerGalleryListing';

export default function GalleryScreen({ route }: any) {
  return (
    <GradientBg colorsList={['#ffffff', '#ffffff']}>
      <InnerGalleryListing route={route} />
    </GradientBg>
  );
}
