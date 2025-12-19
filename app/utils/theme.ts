import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');


const COLORS = {
  default: {
    primary: "#003D5D",
    secondary: "#E3F5FF",
    black: "#000000",
    white: "#FFFFFF",
    plpTextColor: "#000000", // paath list punjabi text color
    plhTextColor: "#003D5D", // paath list hindi text color
    pleTextColor: "#003D5D", // paath list english text color
    plpiTextColor: "#2990CB", // paath list page info text color 
    screenBg: "#FFFFFF",
  },
  primary: {
    primary: "#EC691F",
    secondary: "#fbfcfe",
    black: "#000000",
    white: "#FFFFFF",
    plpTextColor: "#000000", // paath list punjabi text color
    plhTextColor: "#003D5D", // paath list hindi text color
    pleTextColor: "#003D5D", // paath list english text color
    plpiTextColor: "#2990CB", // paath list page info text color 
    screenBg: "#FFFFFF",
  },
  secondary: {
    primary: "#9C043A",
    secondary: "#fbfcfe",
    black: "#000000",
    white: "#FFFFFF",
    plpTextColor: "#000000", // paath list punjabi text color
    plhTextColor: "#003D5D", // paath list hindi text color
    pleTextColor: "#003D5D", // paath list english text color
    plpiTextColor: "#2990CB", // paath list page info text color 
    screenBg: "#FFFFFF",
  },
  tertiary: {
    primary: "#9C043A",
    secondary: "#fbfcfe",
    black: "#000000",
    white: "#FFFFFF",
    plpTextColor: "#000000", // paath list punjabi text color
    plhTextColor: "#003D5D", // paath list hindi text color
    pleTextColor: "#003D5D", // paath list english text color
    plpiTextColor: "#2990CB", // paath list page info text color 
    screenBg: "#FFFFFF",
  },
  quaternary: {
    primary: "#9C043A",
    secondary: "#fbfcfe",
    black: "#000000",
    white: "#FFFFFF",
    plpTextColor: "#000000", // paath list punjabi text color
    plhTextColor: "#003D5D", // paath list hindi text color
    pleTextColor: "#003D5D", // paath list english text color
    plpiTextColor: "#2990CB", // paath list page info text color 
    screenBg: "#FFFFFF",
  },
  dark: {
    primary: "#9C043A",
    secondary: "#fbfcfe",
    black: "#000000",
    white: "#FFFFFF",
    plpTextColor: "#000000", // paath list punjabi text color
    plhTextColor: "#003D5D", // paath list hindi text color
    pleTextColor: "#003D5D", // paath list english text color
    plpiTextColor: "#2990CB", // paath list page info text color 
    screenBg: "#000000",
  },
};


const SIZES = {
  xssSmall: 6,
  xsSmall: 8,
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  screenDefaultPadding: 16,
  height,
  width,
  widthPer: (percent = 100) => width * (percent / 100),
  heightPer: (percent = 100) => height * (percent / 100),
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 1,
  },
};

const FONTS = {
};



export { COLORS, SIZES, SHADOWS, FONTS };
