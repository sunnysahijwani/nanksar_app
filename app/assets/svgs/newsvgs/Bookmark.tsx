import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
}

const Bookmark: React.FC<IconProps> = ({
  width = 22,
  height = 26,
  color = '#333333',
  filled = false,
}) => (
  <Svg width={width} height={height} viewBox="0 0 22 26" fill="none">
    <Path
      d="M4 1H18C18.5523 1 19 1.44772 19 2V24.5L11 18.75L3 24.5V2C3 1.44772 3.44772 1 4 1Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

export default Bookmark;
