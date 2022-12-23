module.exports = {
  content: ['index.html', './src/**/*.{html,js,jsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1440px',
      '2xl': '1920px',
    },
    listStyleType: {
      none: 'none',
      decimal: 'decimal',
      square: 'square',
    },
    colors: {
      bgPrimary: '#ffffff',
      bgPrimaryDark: '#252530',
      fgPrimary: '#353595',
      fgPrimaryDark: '#e0e0e0',
      fgSecondary: '#6060c0',
      fgSecondaryDark: '#80b0ff',
      fgThird: '#6060c0',
      fgThirdDark: '#c0c0e0',
      fgName: '#3060c0',
      fgNameDark: '#d59000',
      fgRed: '#c00000',
      fgRedDark: '#f04030',
      fgGreen: '#00a000',
      fgGreenDark: '#00d000',
      bgNav: '#404060',
      bgNavDark: '#303040',
      bgSecondary: '#e0e5ff',
      bgSecondaryDark: '#353545',
      bgThird: '#f0f5ff',
      bgThirdDark: '#303040',
      bgError: '#f04040',
      bgErrorDark: '#901000',
      bgErrorSecondary: '#ff8080',
      bgErrorSecondaryDark: '#b03525',
      bgSuccess: '#40d080',
      bgSuccessDark: '#007035',
      bgWarning: '#ffb050',
      bgWarningDark: '#c06500',
      bgButton: '#ffffff',
      bgButtonDark: '#404050',
      bgButtonSecondary: '#ffffff',
      bgButtonSecondaryDark: '#303040',
      bgCheckbox: '#ffffff',
      bgCheckboxDark: '#e0e0e0',
      bgCheckboxSelected: '#7070ff',
      bgCheckboxSelectedDark: '#6060d0',
      borderPrimary: '#80b0ff',
      borderPrimaryDark: '#505060',
      borderSecondary: '#b5c5ff',
      borderSecondaryDark: '#404050',
      borderThird: '#b5c5ff',
      borderThirdDark: '#303040',
      borderNestModal: '#555570',
      borderNestModalDark: '#404050',
    },
    extend: {},
  },
  plugins: [],
};
