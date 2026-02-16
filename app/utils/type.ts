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
  isActive?: boolean
}
export type Explanation = {
  text: string;
  lang: string;
};

export interface PaathCardData {
  title: string;
  engVersion?: string;
  explanations?: Explanation[];
}

export interface PaathCardItem {
  data: PaathCardData;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  engVersionStyle?: StyleProp<TextStyle>;
  handleReadMorePress?: (textObj: Explanation) => void;
}

