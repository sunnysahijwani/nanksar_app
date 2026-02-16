import React from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../elements/AppText/AppText';
import { useAppContext } from '../../context/AppContext';
import { withOpacity } from '../../utils/helper';
import LinearGradient from 'react-native-linear-gradient';

type GalleryCategoryCardProps = {
  name: string;
  highlightImage: string | null;
  imagesCount: number;
  size: number;
  onPress: () => void;
};

const GalleryCategoryCard: React.FC<GalleryCategoryCardProps> = ({
  name,
  highlightImage,
  imagesCount,
  size,
  onPress,
}) => {
  const { colors } = useAppContext();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { width: size, height: size * 1.1 }]}
    >
      {highlightImage ? (
        <ImageBackground
          source={{ uri: highlightImage }}
          style={styles.imageBg}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <View style={styles.labelContainer}>
              <AppText size={14} style={styles.nameText} numberOfLines={2}>
                {name}
              </AppText>
              {imagesCount > 0 && (
                <AppText size={11} style={styles.countText}>
                  {imagesCount} {imagesCount === 1 ? 'photo' : 'photos'}
                </AppText>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={[styles.placeholder, { backgroundColor: withOpacity(colors.primary, 0.15) }]}>
          <View style={styles.placeholderContent}>
            <AppText size={36} style={{ color: withOpacity(colors.primary, 0.3) }}>
              📁
            </AppText>
          </View>
          <View style={[styles.placeholderLabel, { backgroundColor: withOpacity(colors.primary, 0.08) }]}>
            <AppText size={14} style={{ color: colors.primary, fontWeight: '600' }} numberOfLines={2}>
              {name}
            </AppText>
            {imagesCount > 0 && (
              <AppText size={11} style={{ color: withOpacity(colors.primary, 0.6) }}>
                {imagesCount} {imagesCount === 1 ? 'photo' : 'photos'}
              </AppText>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  imageBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 12,
  },
  gradient: {
    paddingTop: 30,
    paddingBottom: 12,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  labelContainer: {
    gap: 2,
  },
  nameText: {
    color: '#fff',
    fontWeight: '700',
  },
  countText: {
    color: 'rgba(255,255,255,0.8)',
  },
  placeholder: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderLabel: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    gap: 2,
  },
});

export default GalleryCategoryCard;
