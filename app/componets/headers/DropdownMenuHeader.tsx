import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from '@ant-design/react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../elements/AppText/AppText';
import GoBack from '../smartComponents/GoBack';
import { useAppContext } from '../../context/AppContext';
import { resetAndNavigate } from '../../utils/NavigationUtils';
import { withOpacity } from '../../utils/helper';
import { COLORS } from '../../utils/theme';
import { HEART } from '../../assets/svgs';
import HeartFilled from '../../assets/svgs/newsvgs/HeartFilled';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HEADER_BAR_HEIGHT = 56;

interface DropdownMenuHeaderProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  showDashboardOption?: boolean;
  showTranslateOption?: boolean;
  showFontSizeOption?: boolean;
  showTocOption?: boolean;
  onTocPress?: () => void;
  showTocIcon?: boolean;
  onTocIconPress?: () => void;
  showFavouritesIcon?: boolean;
  onFavouritesIconPress?: () => void;
}

const DropdownMenuHeader: React.FC<DropdownMenuHeaderProps> = ({
  title,
  titleStyle,
  showDashboardOption = true,
  showTranslateOption = true,
  showFontSizeOption = true,
  showTocOption = false,
  onTocPress,
  showTocIcon = false,
  onTocIconPress,
  showFavouritesIcon = false,
  onFavouritesIconPress,
}) => {
  const { colors, lang, switchLang, textScale, setAppTextScale } = useAppContext();
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const menuItems: React.ReactNode[] = [];

  if (showDashboardOption) {
    menuItems.push(
      <TouchableOpacity
        onPress={() => { resetAndNavigate('Home'); closeMenu(); }}
        style={styles.menuItem}
      >
        <AppText size={15} style={{ color: colors.primary, fontWeight: '600' }}>
          {lang?.jumpToDashboard || 'Jump to Dashboard'}
        </AppText>
      </TouchableOpacity>
    );
  }

  if (showTranslateOption) {
    menuItems.push(
      <TouchableOpacity
        onPress={() => { switchLang(); closeMenu(); }}
        style={styles.menuItem}
      >
        <AppText size={15} style={{ color: colors.primary, fontWeight: '600' }}>
          {lang?.translateEnPun || 'Translate (En/Pun)'}
        </AppText>
      </TouchableOpacity>
    );
  }

  if (showTocOption && onTocPress) {
    menuItems.push(
      <TouchableOpacity
        onPress={() => { onTocPress(); closeMenu(); }}
        style={styles.menuItem}
      >
        <AppText size={15} style={{ color: colors.primary, fontWeight: '600' }}>
          {lang?.bookmarksIndex || 'Bookmarks / Index'}
        </AppText>
      </TouchableOpacity>
    );
  }

  if (showFontSizeOption) {
    menuItems.push(
      <View style={styles.menuItemRow}>
        <AppText size={15} style={{ color: colors.primary, fontWeight: '600' }}>
          {lang?.fontSize || 'Font Size'}
        </AppText>
        <View style={styles.fontActions}>
          <TouchableOpacity
            style={styles.fontBtn}
            onPress={() => setAppTextScale(+(textScale - 0.1).toFixed(1))}
            activeOpacity={0.7}
          >
            <AppText size={15} style={{ color: '#fff', fontWeight: 'bold' }}>
              -{lang?.A || 'A'}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fontBtn}
            onPress={() => setAppTextScale(+(textScale + 0.1).toFixed(1))}
            activeOpacity={0.7}
          >
            <AppText size={15} style={{ color: '#fff', fontWeight: 'bold' }}>
              {lang?.A || 'A'}+
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const hasMenuOptions = menuItems.length > 0;
  const showTocIconBtn = showTocIcon && !!onTocIconPress;
  const showFavouritesIconBtn = showFavouritesIcon && !!onFavouritesIconPress;
  const hasHeaderRight = hasMenuOptions || showTocIconBtn || showFavouritesIconBtn;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#C7E4F3', '#D2EAF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerSafeArea, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <GoBack
            title={title ?? lang?.nanaksarAmritGhar}
            textStyle={[
              { fontWeight: '700', fontSize: 20, color: colors.primary, width: 200 },
              titleStyle,
            ] as any}
            color={colors.lightBlue}
          />
          {hasHeaderRight && (
            <View style={styles.headerRight}>
              {showTocIconBtn && (
                <TouchableOpacity
                  onPress={onTocIconPress}
                  activeOpacity={0.7}
                  style={[styles.headerIconBtn, { backgroundColor: withOpacity(colors.white, 1) }]}
                >
                  <Image
                    source={require('../../assets/images/bookmark.png')}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              {showFavouritesIconBtn && (
                <TouchableOpacity
                  onPress={onFavouritesIconPress}
                  activeOpacity={0.7}
                  style={[styles.headerIconBtn]}
                >
                  <HeartFilled width={26} height={26} color={colors.lightBlue} />
                </TouchableOpacity>
              )}
              {hasMenuOptions && (
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(prev => !prev)}
                  activeOpacity={0.7}
                  style={styles.headerIconBtn}
                >
                  <Icon name="more" size={28} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </LinearGradient>

      {isMenuOpen && (
        <Pressable
          style={[styles.menuOverlay, { height: SCREEN_HEIGHT }]}
          onPress={closeMenu}
        />
      )}

      {isMenuOpen && (
        <View style={[styles.dropdownMenu, { top: insets.top + HEADER_BAR_HEIGHT }]}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={styles.menuDivider} />}
              {item}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 20,
    elevation: 20,
  },
  headerSafeArea: {
    zIndex: 20,
    elevation: 20,
  },
  header: {
    height: HEADER_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 25,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    zIndex: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    minWidth: 200,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  fontActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 5,
  },
  fontBtn: {
    backgroundColor: COLORS.default.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DropdownMenuHeader;
