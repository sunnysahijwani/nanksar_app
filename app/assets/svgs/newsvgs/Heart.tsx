import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const Heart: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#9C043A",
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    strokeWidth={1.5}
    stroke={color}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.245.994-4 2.444C11.745 4.744 10.24 3.75 8.5 3.75 6.015 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25Z"
    />
  </Svg>
);

export default Heart;