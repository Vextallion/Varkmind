const colors = {
  white: '#FFFFFF',
  black: '#202020',
};

const gradients = {
  default: ['#FFFFFF', '#FFFFFF'],
};

export const darkScheme = {
  //shared colors for all app
  BG: {
    white: colors.white,
  },
  text: {
    primary: colors.black,
    secondary: colors.white,
  },
  icon: {
    primary: colors.black,
    secondary: colors.white,
  },
  border: {
    primary: colors.white,
    secondary: colors.black,
  },

  gradients: {
    default: gradients.default,
  },

  //colors for UIkit
  button: {
    primary: colors.white,
    secondary: colors.black,
    disabled: colors.white,
    border: colors.black,
  },

  // colors for unique colors
  // example
  // calendar: {
  //   active: colors.red,
  //   activeText: colors.white,
  //   primaryText: colors.black,
  //   buttonColor: colors.secondaryBG,
  //   divider: colors.grey,
  // },
};
