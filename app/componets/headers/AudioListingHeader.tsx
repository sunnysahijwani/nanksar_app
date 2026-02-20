import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import GoBack from '../smartComponents/GoBack';
import { useAppContext } from '../../context/AppContext';
import { SEARCH, SETTINGS } from '../../assets/svgs';
import SmartSearch from '../smartComponents/SmartSearch';
import { SIZES } from '../../utils/theme';
import AppText from '../elements/AppText/AppText';
import { withOpacity } from '../../utils/helper';

type AudioListingHeaderProps = {
  handleSettingsPress?: () => void;
  // Punjabi keyboard search mode
  punjabiSearchActive?: boolean;
  searchText?: string;
  onSearchIconPress?: () => void;
  onClearSearch?: () => void;
  isSearchBarShow?: boolean;
  isShowSettings?: boolean;
};

const AudioListingHeader = ({
  handleSettingsPress,
  punjabiSearchActive = false,
  searchText = '',
  onSearchIconPress,
  onClearSearch,
  isSearchBarShow = true,
  isShowSettings = true,
}: AudioListingHeaderProps) => {
  const { colors, textScale } = useAppContext();

  const handleSearhTextChange = (text: string) => {
    console.log('Search text changed in Header: ', text);
  };

  const showSearchBar = onSearchIconPress && punjabiSearchActive;

  return (
    <>
      <View
        style={[
          styles.mainHeaderContainer,
        ]}
        className={`w-full flex flex-row items-center py-[10px]`}
      >
        <View>
          <GoBack />
        </View>

        {/* Search bar takes up the middle space when active */}
        {showSearchBar ? (
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: withOpacity(colors.primary, 0.1),
                borderColor: withOpacity(colors.primary, 0.25),
              },
            ]}
          >
            <TouchableOpacity
              onPress={onClearSearch}
              style={styles.clearButton}
            >
              <AppText
                size={16}
                style={{ color: colors.primary, fontWeight: '700' }}
              >
                ✕
              </AppText>
            </TouchableOpacity>
            <AppText
              size={16 * textScale}
              style={{ color: colors.primary, flex: 1, letterSpacing: 4 }}
              numberOfLines={1}
            >
              {searchText || ' '}
            </AppText>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={styles.rightIcons}>
          {isSearchBarShow && (
            <>
              {onSearchIconPress ? (
                <TouchableOpacity onPress={onSearchIconPress}>
                  <SEARCH color={colors.primary} width={30} height={30} />
                </TouchableOpacity>
              ) : (
                <SmartSearch
                  onChangeText={handleSearhTextChange}
                  searhIconWidth={30}
                  searchIconHeight={30}
                />
              )}
            </>
          )}
          {isShowSettings && <Pressable onPress={handleSettingsPress}>
            <SETTINGS color={colors.primary} height={30} width={30} />
          </Pressable>}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainHeaderContainer: {
    paddingHorizontal: SIZES.screenDefaultPadding,
  },
  searchBar: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  clearButton: {
    paddingRight: 8,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
export default AudioListingHeader;
