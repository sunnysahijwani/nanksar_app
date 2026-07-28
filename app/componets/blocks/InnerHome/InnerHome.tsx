import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import GradientBg from '../../backgrounds/GradientBg';
import DisclaimerModal from '../Disclaimer/DisclaimerModal';
import HomeTitlePill from './HomeTitlePill';
import HomeCircleGrid, { HomeGridItem } from './HomeCircleGrid';
import HomeShortcutRow, { HomeShortcut } from './HomeShortcutRow';
import HomeFooterBar from './HomeFooterBar';
import { useHomeLayout } from './useHomeLayout';
import { useAppContext } from '../../../context/AppContext';
import { useHukamnama } from '../../../hooks/query/useHukamnama';
import { navigate } from '../../../utils/NavigationUtils';
import { READ_CV_LOGO } from '../../../assets/svgs';
import {
  shouldShowDisclaimer,
  markDisclaimerShown,
} from '../../../storage/disclaimer';

const GALLERY_ICON = require('../../../assets/images/gallery.png');
const VIDYALA_ICON = require('../../../assets/images/vidyala.png');
const INFO_ICON = require('../../../assets/images/info.png');

/**
 * Home screen content.
 *
 * Layout contract: the screen never scrolls vertically. It is a three-band column —
 *
 *   1. title pill      (natural height)
 *   2. body            (flex: 1 — measured, then the circle grid + shortcut row are
 *                       sized to fit inside exactly that many pixels)
 *   3. footer bar      (natural height, in normal flow so it can't overlay anything)
 *
 * All the arithmetic lives in `useHomeLayout`; this component only wires it up.
 */
export default function InnerHome() {
  const { colors, setTheme, lang, textScale } = useAppContext();
  const { data: hukamnamaData } = useHukamnama();

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [body, setBody] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setTheme('default');
  }, [setTheme]);

  // Two-step (Punjabi -> English) disclaimer, then hidden for 3 days.
  useEffect(() => {
    if (shouldShowDisclaimer()) setShowDisclaimer(true);
  }, []);

  const onDisclaimerDone = useCallback(() => {
    markDisclaimerShown();
    setShowDisclaimer(false);
  }, []);

  const onBodyLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBody(prev =>
      Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
        ? prev
        : { width, height },
    );
  }, []);

  const layout = useHomeLayout({
    width: body.width,
    height: body.height,
    textScale,
  });

  const gridItems = (lang.homaeContainer ?? []) as HomeGridItem[];

  const hasHukamnama = !!hukamnamaData?.result?.length;

  const shortcuts = useMemo<HomeShortcut[]>(() => {
    const items: HomeShortcut[] = [
      {
        key: 'gallery',
        title: lang.gallery,
        renderIcon: size => (
          <Image
            source={GALLERY_ICON}
            resizeMode="contain"
            style={{ width: size + 10, height: size + 10 }}
          />
        ),
        onPress: () => navigate('GalleryScreen'),
      },
      {
        key: 'vidyala',
        title: lang.gurmatVidyala,
        renderIcon: size => (
          <Image
            source={VIDYALA_ICON}
            resizeMode="contain"
            style={{ width: size + 10, height: size + 10 }}
          />
        ),
        onPress: () => navigate('VidyalaScreen'),
      },
      {
        key: 'info',
        title: lang.info,
        iconRatio: 0.78,
        renderIcon: size => (
          <Image
            source={INFO_ICON}
            resizeMode="contain"
            style={{ width: size + 10, height: size + 10 }}
          />
        ),
        onPress: () => navigate('InformationListScreen'),
      },
    ];

    if (hasHukamnama) {
      items.push({
        key: 'hukamnama',
        title: lang.hukamnama,
        iconRatio: 0.72,
        renderIcon: size => (
          <READ_CV_LOGO width={size} height={size} color={colors.white} />
        ),
        onPress: () => navigate('HukamnamaScreen'),
      });
    }

    return items;
  }, [lang, hasHukamnama, colors.white]);

  return (
    <GradientBg enableSafeAreaView notchColor={colors.screenBgGr[1]}>
      <DisclaimerModal visible={showDisclaimer} onDone={onDisclaimerDone} />

      <HomeTitlePill />

      <View style={styles.body} onLayout={onBodyLayout}>
        {layout.ready && (
          <>
            <HomeCircleGrid items={gridItems} layout={layout} />
            <View style={{ marginTop: layout.sectionGap }}>
              <HomeShortcutRow shortcuts={shortcuts} layout={layout} />
            </View>
          </>
        )}
      </View>

      <HomeFooterBar />
    </GradientBg>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});
