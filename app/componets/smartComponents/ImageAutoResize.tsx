import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

const ImageAutoResize = ({ source }: { source: any }) => {
  const [height, setHeight] = useState(300);
  let layoutWidth = 0;
  const onLayout = (event: any) => {
    layoutWidth = event.nativeEvent.layout.width;
  };
  return (
    <Image
      onLayout={onLayout}
      source={{ uri: source }}
      style={[styles.cardImage, { height: height }]}
      height={height}
      resizeMode="cover"
      onLoad={event => {
        const { width, height } = event.nativeEvent.source;
        const scaledHeight = (layoutWidth * height) / width;
        setHeight(scaledHeight - 100);
      }}
    />
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',

    top: 0,
  },
});

export default ImageAutoResize;
