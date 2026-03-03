import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
    width?: number;
    height?: number;
    color?: string;
}

const HeartFilled: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = "#9C043A",
    ...props
}) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={color}
        {...props}
    >
        <Path d="M12 21s-8-4.438-8-11.25C4 6.42 6.42 4 9.75 4c1.99 0 3.72 1.15 4.25 2.8C14.53 5.15 16.26 4 18.25 4 21.58 4 24 6.42 24 9.75 24 16.562 12 21 12 21Z" />
    </Svg>
);

export default HeartFilled;