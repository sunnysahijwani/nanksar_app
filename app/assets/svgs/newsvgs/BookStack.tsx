import React from "react";
import Svg, { G, Polygon, Text } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const BookStack: React.FC<IconProps> = ({
  width = 135,
  height = 135,
  color = "#0A2A4A",
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    fill="none"
    {...props}
  >
    {/* Bottom Book */}
    <G>
      <Polygon
        points="30,120 140,120 170,140 60,140"
        fill="#E6E6E6"
      />
      <Polygon
        points="30,120 60,140 60,160 30,140"
        fill={color}
      />
      <Polygon
        points="60,140 170,140 170,160 60,160"
        fill="#FFFFFF"
      />
    </G>

    {/* Middle Book */}
    <G>
      <Polygon
        points="40,90 150,90 180,110 70,110"
        fill="#F2F2F2"
      />
      <Polygon
        points="40,90 70,110 70,130 40,110"
        fill={color}
      />
      <Polygon
        points="70,110 180,110 180,130 70,130"
        fill="#FFFFFF"
      />
    </G>

    {/* Top Book */}
    <G>
      <Polygon
        points="50,60 160,60 190,80 80,80"
        fill={color}
      />
      <Polygon
        points="50,60 80,80 80,100 50,80"
        fill={color}
      />
      <Polygon
        points="80,80 190,80 190,100 80,100"
        fill="#FFFFFF"
      />
    </G>

    {/* Title Text (Hindi style placeholder) */}
    <Text
      x="105"
      y="75"
      fontSize="14"
      fill="#FFFFFF"
      fontWeight="bold"
      textAnchor="middle"
      transform="rotate(-15 105 75)"
    >
      सिख इतिहास
    </Text>
  </Svg>
);

export default BookStack;
