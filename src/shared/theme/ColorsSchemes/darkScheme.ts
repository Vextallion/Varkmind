import { paletteDark } from '../tokens/colors';
import { fontFamily, typeScale } from '../tokens/typography';
import { radius, space } from '../tokens/space';

export const darkScheme = {
  BG: {
    white: paletteDark.paper,
    surface: paletteDark.surface,
    accentSoft: paletteDark.accentSoft,
  },
  text: {
    primary: paletteDark.ink,
    secondary: paletteDark.inkMuted,
    inverse: paletteDark.paper,
    accent: paletteDark.accent,
  },
  progress: {
    track: paletteDark.accentTrack,
    fill: paletteDark.accent,
  },
  icon: {
    primary: paletteDark.ink,
    secondary: paletteDark.inkMuted,
    active: paletteDark.accent,
  },
  border: {
    primary: paletteDark.border,
    secondary: paletteDark.ink,
    accent: paletteDark.accent,
  },
  status: {
    success: paletteDark.success,
    danger: paletteDark.danger,
  },
  button: {
    primary: paletteDark.accent,
    secondary: paletteDark.ink,
    disabled: paletteDark.border,
    border: paletteDark.accent,
    textOnPrimary: paletteDark.paper,
  },
  tab: {
    active: paletteDark.accent,
    inactive: paletteDark.inkMuted,
    background: paletteDark.surface,
    border: paletteDark.border,
  },
  font: fontFamily,
  type: typeScale,
  space,
  radius,
  gradients: {
    default: [paletteDark.paper, paletteDark.paper],
  },
};
