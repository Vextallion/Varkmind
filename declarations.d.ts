declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  import React from 'react';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export = value;
}
