import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../elements/AppText/AppText';

type GalleryImageCardProps = {
  thumbnailUrl: string;
  title?: string;
  size: number;
  onPress: () => void;
};

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
  thumbnailUrl,
  title,
  size,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { width: size, height: size }]}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {title ? (
        <View style={styles.titleOverlay}>
          <AppText size={11} style={styles.titleText} numberOfLines={1}>
            {title}
          </AppText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  titleText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default GalleryImageCard;
