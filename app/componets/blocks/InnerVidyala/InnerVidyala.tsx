import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import YoutubePlayer from 'react-native-youtube-iframe';
import AppText from '../../elements/AppText/AppText';
import AppLoader from '../../Loader/AppLoader';
import { ScreenHeaders } from '../../index';
import GalleryImageCard from '../../cards/GalleryImageCard';
import ImageViewer from '../InnerGallery/ImageViewer';
import { useVidyala } from '../../../hooks/query/useVidyala';
import { useAppContext } from '../../../context/AppContext';
import { SIZES } from '../../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_COLUMNS = 2;
const IMAGE_SPACING = 8;
const IMAGE_CARD_SIZE =
  (SCREEN_WIDTH - SIZES.screenDefaultPadding * 2 - IMAGE_SPACING * (IMAGE_COLUMNS - 1)) /
  IMAGE_COLUMNS;

const S3_BASE_URL = 'https://nanaksar.s3.ap-south-1.amazonaws.com/';

type VidyalaMedia = {
  id: number;
  media_path: string;
  thumbnail: string | null;
  medium_img: string | null;
  media_type: 'image' | 'youtube';
  vidyala_id: number;
};

const getFullUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${S3_BASE_URL}${path}`;
};

const extractYoutubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

export default function InnerVidyala() {
  const { colors, lang } = useAppContext();
  const { data: apiResponse, isLoading, isError } = useVidyala();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const vidyalaData = apiResponse?.data;
  const media: VidyalaMedia[] = vidyalaData?.vidyala_media || [];

  const imageMedia = useMemo(
    () => media.filter((m) => m.media_type === 'image'),
    [media],
  );

  const viewerImages = useMemo(
    () =>
      imageMedia.map((m) => ({
        uri: getFullUrl(m.medium_img || m.media_path),
      })),
    [imageMedia],
  );

  const handleImagePress = useCallback(
    (index: number) => {
      setViewerStartIndex(index);
      setViewerVisible(true);
    },
    [],
  );

  const handleYoutubePress = useCallback((url: string) => {
    const videoId = extractYoutubeId(url);
    if (videoId) {
      setYoutubeVideoId(videoId);
    }
  }, []);

  const renderMediaGrid = () => {
    if (media.length === 0) return null;

    const rows: VidyalaMedia[][] = [];
    for (let i = 0; i < media.length; i += IMAGE_COLUMNS) {
      rows.push(media.slice(i, i + IMAGE_COLUMNS));
    }

    let imageIndex = 0;

    return (
      <View style={styles.mediaSection}>
        <AppText size={18} style={[styles.sectionTitle, { color: colors.primary }]}>
          {lang.gurmatVidyala === 'Gurmat Vidyala' ? 'Photos & Videos' : 'ਫੋਟੋ ਅਤੇ ਵੀਡੀਓ'}
        </AppText>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.imageRow}>
            {row.map((item) => {
              if (item.media_type === 'image') {
                const currentImageIndex = imageIndex;
                imageIndex++;
                return (
                  <GalleryImageCard
                    key={item.id}
                    thumbnailUrl={getFullUrl(item.thumbnail || item.medium_img || item.media_path)}
                    size={IMAGE_CARD_SIZE}
                    onPress={() => handleImagePress(currentImageIndex)}
                  />
                );
              }

              // YouTube video card
              const videoId = extractYoutubeId(item.media_path);
              const youtubeThumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : '';

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => handleYoutubePress(item.media_path)}
                  style={[styles.youtubeCard, { width: IMAGE_CARD_SIZE, height: IMAGE_CARD_SIZE }]}
                >
                  <Image
                    source={{ uri: youtubeThumbnail }}
                    style={styles.youtubeThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <View style={styles.playButton}>
                      <AppText size={24} style={styles.playIcon}>▶</AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {row.length < IMAGE_COLUMNS && (
              <View style={{ width: IMAGE_CARD_SIZE, height: IMAGE_CARD_SIZE }} />
            )}
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ScreenHeaders title={lang.gurmatVidyala} isShowFontSize={false} />
        <AppLoader />
      </View>
    );
  }

  if (isError || !vidyalaData) {
    return (
      <View style={styles.centered}>
        <ScreenHeaders title={lang.gurmatVidyala} isShowFontSize={false} />
        <AppText size={16} style={styles.errorText}>
          Failed to load content. Please try again.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeaders title={lang.gurmatVidyala} isShowFontSize={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        {vidyalaData.hero_image && (
          <Image
            source={{ uri: getFullUrl(vidyalaData.hero_image) }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Title */}
        <AppText size={22} style={[styles.title, { color: colors.primary }]}>
          {vidyalaData.title}
        </AppText>

        {/* Long Description (HTML) */}
        {vidyalaData.long_description && (
          <View style={styles.descriptionContainer}>
            <RenderHtml
              contentWidth={SCREEN_WIDTH - SIZES.screenDefaultPadding * 2}
              source={{ html: vidyalaData.long_description }}
              baseStyle={styles.htmlBase}
              tagsStyles={{
                p: { marginBottom: 8, lineHeight: 22 },
                strong: { fontWeight: '700' },
                em: { fontStyle: 'italic' },
              }}
            />
          </View>
        )}

        {/* Media Grid */}
        {renderMediaGrid()}
      </ScrollView>

      {/* Image Viewer Modal */}
      <ImageViewer
        visible={viewerVisible}
        images={viewerImages}
        startIndex={viewerStartIndex}
        onClose={() => setViewerVisible(false)}
      />

      {/* YouTube Player Modal */}
      <Modal
        visible={!!youtubeVideoId}
        transparent
        animationType="fade"
        onRequestClose={() => setYoutubeVideoId(null)}
        statusBarTranslucent
      >
        <View style={styles.youtubeModalOverlay}>
          <Pressable
            style={styles.youtubeCloseButton}
            onPress={() => setYoutubeVideoId(null)}
          >
            <AppText size={28} style={styles.youtubeCloseText}>✕</AppText>
          </Pressable>
          <View style={styles.youtubePlayerContainer}>
            {youtubeVideoId && (
              <YoutubePlayer
                height={SCREEN_WIDTH * (9 / 16)}
                width={SCREEN_WIDTH - 32}
                videoId={youtubeVideoId}
                play={true}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.screenDefaultPadding,
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  htmlBase: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  mediaSection: {
    marginTop: 8,
  },
  imageRow: {
    flexDirection: 'row',
    gap: IMAGE_SPACING,
    marginBottom: IMAGE_SPACING,
  },
  youtubeCard: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#000',
  },
  youtubeThumb: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    marginLeft: 4,
  },
  errorText: {
    textAlign: 'center',
    color: '#e74c3c',
    marginTop: 40,
  },
  youtubeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubeCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  youtubeCloseText: {
    color: '#fff',
  },
  youtubePlayerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
