import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { IconName, iconsList } from '@shared/config/iconList';

interface IconProps {
  name: IconName;
  style?: StyleProp<ViewStyle>;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  style,
  width,
  height,
  color,
}) => {
  const IconComponent = iconsList[name] || iconsList.box;
  return (
    <IconComponent
      style={style}
      width={width || 24}
      height={height || 24}
      color={color}
    />
  );
};
