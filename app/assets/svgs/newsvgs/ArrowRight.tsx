import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ArrowRight: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#9C043A",
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.5 19.5 21 12m0 0-7.5-7.5M21 12H3"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowRight;
