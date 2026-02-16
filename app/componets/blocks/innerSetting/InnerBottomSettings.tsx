import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import TranslationsCard from '../../elements/Card/TranslationsCard'
import AppText from '../../elements/AppText/AppText'
import { useAppContext } from '../../../context/AppContext'

export default function InnerBottomSettings() {
  const { textScale, setAppTextScale } = useAppContext();

  return (
    <View style={styles.container}>
      {/* Card 1: Translation toggles */}
      <TranslationsCard
        title="Translation"
        items={[
          { label: 'English', preferenceKey: 'showEnglish' },
          { label: 'Punjabi', preferenceKey: 'showPunjabi' },
          { label: 'Hindi', preferenceKey: 'showHindi' },
        ]}
      />

      {/* Card 2: Transliteration toggle */}
      <TranslationsCard
        title="Transliteration"
        items={[
          { label: 'English Transliteration', preferenceKey: 'showTransliteration' },
        ]}
      />

      {/* Card 3: Font size controls */}
      <View style={styles.fontSizeCard}>
        <AppText size={16} style={styles.fontSizeTitle}>Font Size</AppText>
        <View style={styles.fontSizeControls}>
          <Pressable
            onPress={() => setAppTextScale(+(textScale - 0.1).toFixed(1))}
            style={styles.fontSizeButton}
          >
            <AppText size={22} style={styles.fontSizeButtonText}>A-</AppText>
          </Pressable>
          <AppText size={16} style={styles.fontSizeValue}>
            {Math.round(textScale * 100)}%
          </AppText>
          <Pressable
            onPress={() => setAppTextScale(+(textScale + 0.1).toFixed(1))}
            style={styles.fontSizeButton}
          >
            <AppText size={22} style={styles.fontSizeButtonText}>A+</AppText>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  fontSizeCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  fontSizeTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  fontSizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  fontSizeButtonText: {
    fontWeight: '700',
  },
  fontSizeValue: {
    minWidth: 50,
    textAlign: 'center',
  },
});
