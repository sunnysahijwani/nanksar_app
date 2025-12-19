import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from "react-native";

export type ThemeName =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary";

export interface PaathlistItem {
  punjabiText: string;
  hindiText?: string;
  englishText?: string;
  pageInfo?: string;
  containerStyle?: StyleProp<ViewStyle>;
  punjabiTextStyle?: StyleProp<TextStyle>;
  hindiTextStyle?: StyleProp<TextStyle>;
  englishTextStyle?: StyleProp<TextStyle>;
  pageInfoStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}
export interface PaathCardItem {
  punjabiText: string;
  hindiText?: string;
  englishText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  punjabiTextStyle?: StyleProp<TextStyle>;
  hindiTextStyle?: StyleProp<TextStyle>;
  englishTextStyle?: StyleProp<TextStyle>;
}