import React from 'react'
import { GestureResponderEvent, Text, TouchableOpacity, View } from 'react-native';
import { PaathCardItem } from '../../utils/type';
import { useAppContext } from '../../context/AppContext';
import AppText from '../elements/AppText/AppText';
import { withOpacity } from '../../utils/helper';
import { SIZES } from '../../utils/theme';


const PaathCard: React.FC<PaathCardItem> = ({ punjabiText, hindiText, englishText, containerStyle, punjabiTextStyle, hindiTextStyle, englishTextStyle }) => {
  const { colors, setTheme } = useAppContext();
  
  return (
      <View  style={[{ borderColor: withOpacity(colors.primary, 0.7), borderWidth: 0, borderStyle: 'solid', borderRadius: SIZES.xsSmall, paddingBottom: SIZES.xsSmall, boxShadow: `0px 2px 2px ${withOpacity(colors.primary, 0.25)}`, backgroundColor: withOpacity(colors.white, 0.7) },containerStyle]}>
        <View style={{ gap: SIZES.xsSmall }}>
          <View style={{ borderRadius: SIZES.xsSmall , paddingVertical: SIZES.xssSmall , backgroundColor: withOpacity(colors.secondary, 1), overflow: "hidden"}}>
            <AppText size={20} style={[{ color: colors.plpTextColor, textAlign: 'center',},punjabiTextStyle]}>
              {punjabiText}
            </AppText>
          </View>
          {hindiText && (
          <View>
            <AppText size={14} style={[{ color: colors.plhTextColor, textAlign: 'center'},hindiTextStyle]}>
              {hindiText}
            </AppText>
          </View>

          )}
          {englishText && (
            <View>
              <AppText size={14} style={[{ color: colors.pleTextColor, textAlign: 'center' }, englishTextStyle]}>
                {englishText}
              </AppText>
            </View>
          )}
        </View>
      </View>
  )
}
export default PaathCard;
