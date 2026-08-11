import { SymbolView } from 'expo-symbols';
import React from 'react';
import type { ColorValue } from 'react-native';

type TabSymbolProps = {
  name: {
    ios: string;
    android: string;
    web: string;
  };
  color: ColorValue;
  size?: number;
};

export function TabSymbol({ name, color, size = 24 }: TabSymbolProps) {
  return <SymbolView name={name as never} tintColor={color} size={size} />;
}
