import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import AppText from '../../elements/AppText/AppText';
import ZoomableImage from './ZoomableImage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ViewerImage = {
  uri: string;
  title?: string;
};

type ImageViewerProps = {
  visible: boolean;
  images: ViewerImage[];
  startIndex: number;
  onClose: () => void;
};

export default function ImageViewer({
  visible,
  images,
  startIndex,
  onClose,
}: ImageViewerProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setCurrentIndex(startIndex);
      setIsZoomed(false);
      // Scroll to start index when opening
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: startIndex, animated: false });
      }, 50);
    }
  }, [visible, startIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
      setIsZoomed(false);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleZoomChange = useCallback((zoomed: boolean) => {
    setIsZoomed(zoomed);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ViewerImage; index: number }) => (
      <View style={styles.slide}>
        <ZoomableImage
          uri={item.uri}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT * 0.75}
          onZoomChange={handleZoomChange}
          key={`zoom-${index}-${currentIndex}`}
        />
      </View>
    ),
    [handleZoomChange, currentIndex],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.95)" barStyle="light-content" />
      <GestureHandlerRootView style={styles.overlay}>
        {/* Close button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <AppText size={28} style={styles.closeText}>✕</AppText>
        </Pressable>

        {/* Image counter */}
        <View style={styles.counter}>
          <AppText size={14} style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </AppText>
        </View>

        {/* Swipeable images */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, index) => `viewer-${index}`}
          horizontal
          pagingEnabled
          scrollEnabled={!isZoomed}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          initialScrollIndex={startIndex}
        />

        {/* Title */}
        {images[currentIndex]?.title ? (
          <View style={styles.titleBar}>
            <AppText size={14} style={styles.titleText}>
              {images[currentIndex].title}
            </AppText>
          </View>
        ) : null}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  closeText: {
    color: '#fff',
  },
  counter: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
  },
  counterText: {
    color: 'rgba(255,255,255,0.7)',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    color: '#fff',
    textAlign: 'center',
  },
});
