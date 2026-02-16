import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import GoBack from '../smartComponents/GoBack'
import { useAppContext } from '../../context/AppContext';
import { SETTINGS } from '../../assets/svgs';
import SmartSearch from '../smartComponents/SmartSearch';
import { SIZES } from '../../utils/theme';


const AudioListingHeader = ({ handleSettingsPress }: { handleSettingsPress?: () => void }) => {
  const { colors } = useAppContext();

  const handleSearhTextChange = (text: string) => {
    console.log("Search text changed in Header: ", text);
  };
  //   setTheme('primary');
  return (
    <>
      <View style={[{ backgroundColor: colors.secondary }, styles.mainHeaderContainer]} className={`w-full flex flex-row items-center justify-between py-[10px]`}>
        <View>
          <GoBack />
        </View>
        <View className="flex flex-row items-center justify-center gap-[3px]">
          <View>
            <SmartSearch onChangeText={handleSearhTextChange} searhIconWidth={30} searchIconHeight={30} />
          </View>
          <Pressable onPress={handleSettingsPress}>
            <SETTINGS color={colors.primary} height={30} width={30} />
          </Pressable>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainHeaderContainer: {
    paddingHorizontal: SIZES.screenDefaultPadding,
  }
})
export default AudioListingHeader
