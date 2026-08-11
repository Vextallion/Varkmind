import { palette } from '../tokens/colors';
import { fontFamily, typeScale } from '../tokens/typography';
import { radius, space } from '../tokens/space';

export const primaryScheme = {
  BG: {
    white: palette.paper,
    surface: palette.surface,
    accentSoft: palette.accentSoft,
  },
  text: {
    primary: palette.ink,
    secondary: palette.inkMuted,
    inverse: palette.surface,
    accent: palette.accent,
  },
  progress: {
    track: palette.accentTrack,
    fill: palette.accent,
  },
  icon: {
    primary: palette.ink,
    secondary: palette.inkMuted,
    active: palette.accent,
  },
  border: {
    primary: palette.border,
    secondary: palette.ink,
    accent: palette.accent,
  },
  status: {
    success: palette.success,
    danger: palette.danger,
  },
  button: {
    primary: palette.accent,
    secondary: palette.ink,
    disabled: palette.border,
    border: palette.accent,
    textOnPrimary: palette.surface,
  },
  tab: {
    active: palette.accent,
    inactive: palette.inkMuted,
    background: palette.surface,
    border: palette.border,
  },
  font: fontFamily,
  type: typeScale,
  space,
  radius,
  gradients: {
    default: [palette.paper, palette.paper],
  },
};
