export const fontFamily = {
  display: 'Fraunces_600SemiBold',
  displayRegular: 'Fraunces_400Regular',
  ui: 'DMSans_400Regular',
  uiMedium: 'DMSans_500Medium',
  uiSemiBold: 'DMSans_600SemiBold',
  uiBold: 'DMSans_700Bold',
} as const;

export const typeScale = {
  displayLg: { fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38 },
  displayMd: { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 34 },
  title: { fontFamily: fontFamily.uiSemiBold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fontFamily.ui, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamily.uiMedium, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.ui, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fontFamily.uiMedium, fontSize: 12, lineHeight: 16 },
} as const;
