import React from 'react';
import { View } from 'react-native';
import { PaathCardItem } from '../../utils/type';
import { useAppContext } from '../../context/AppContext';
import AppText from '../elements/AppText/AppText';
import { withOpacity } from '../../utils/helper';
import { SIZES } from '../../utils/theme';
import ExplanationText from '../elements/AppText/ExplanationText';

// type PaathCardProps = {
//   data: PaathCardData;
//   containerStyle?: any;
//   titleStyle?: any;
//   engVersionStyle?: any;
// };

/**
 * A component for displaying a Path card.
 * It takes in a title, engVersion, explanations, containerStyle, titleStyle, and engVersionStyle as props.
 * The component renders a card with a title and engVersion, and displays the explanations below it.
 * The card has a border radius of SIZES.xsSmall, a padding of SIZES.xsSmall, and a box shadow of 0px 2px 2px with opacity of 0.25.
 * The title and engVersion are centered and have a text color of colors.plpTextColor and colors.pleTextColor respectively.
 * The explanations are displayed below the title and engVersion, and have a text color of colors.plhTextColor.
 * The component uses the useAppContext hook to get the colors from the app context.
 * The component uses the withOpacity helper function to get the opacity of the colors.
 * The component uses the SIZES constant from the theme to get the sizes of the components.
 */
const LANG_PREFERENCE_MAP: Record<string, keyof import('../../context/AppContext').DisplayPreferences> = {
  English: 'showEnglish',
  Gurmukhi_SS: 'showPunjabi',
  Hindi: 'showHindi',
};

const PaathCard: React.FC<PaathCardItem> = ({
  data,
  containerStyle,
  titleStyle,
  engVersionStyle,
  handleReadMorePress,
}) => {
  const { colors, displayPreferences, textScale } = useAppContext();

  const filteredExplanations = data?.explanations?.filter(
    exp => {
      const prefKey = LANG_PREFERENCE_MAP[exp.lang];
      return prefKey ? displayPreferences[prefKey] : true;
    }
  );

  return (
    <View
      style={[
        {
          borderColor: withOpacity(colors.primary, 0.7),
          borderWidth: 0,
          borderStyle: 'solid',
          borderRadius: SIZES.xsSmall,
          paddingBottom: SIZES.xsSmall,
          boxShadow: `0px 2px 2px ${withOpacity(colors.primary, 0.25)}`,
          backgroundColor: withOpacity(colors.white, 0.7),

        },
        containerStyle,
      ]}
    >
      <View style={{ gap: SIZES.xsSmall }}>
        <View
          style={{
            paddingHorizontal: SIZES.xsSmall,
            borderRadius: SIZES.xsSmall,
            paddingVertical: SIZES.xssSmall,
            backgroundColor: withOpacity(colors.secondary, 1),
            overflow: 'hidden',
            width: SIZES.width - SIZES.screenDefaultPadding * 2,
          }}
        >
          <AppText
            size={20 * textScale}
            style={[
              { color: colors.plpTextColor, textAlign: 'center' },
              titleStyle,
            ]}
          >
            {data?.title}
          </AppText>
        </View>
        {displayPreferences.showTransliteration && data?.engVersion && (
          <View style={[{ paddingHorizontal: SIZES.xsSmall }]}>
            <AppText
              size={14 * textScale}
              style={[
                { color: colors.pleTextColor, textAlign: 'center' },
                engVersionStyle,
              ]}
            >
              {data?.engVersion}
            </AppText>
          </View>
        )}
        {filteredExplanations &&
          filteredExplanations.map((explanation, index) => {
            return (
              <View style={[{ paddingHorizontal: SIZES.xsSmall }]} key={index}>
                <ExplanationText
                  text={explanation.text}
                  onReadMorePress={() =>
                    handleReadMorePress && handleReadMorePress(explanation)
                  }
                />
              </View>
            );
          })}
      </View>
    </View>
  );
};
export default PaathCard;
