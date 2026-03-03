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
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M20.84 4.61c-1.54-1.34-3.9-1.14-5.32.45L12 8.09l-3.52-3.03c-1.42-1.59-3.78-1.79-5.32-.45-1.66 1.45-1.75 4.02-.2 5.58l8.39 8.49a1 1 0 0 0 1.42 0l8.39-8.49c1.55-1.56 1.46-4.13-.2-5.58z"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Heart;