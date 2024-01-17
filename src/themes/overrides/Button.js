// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: '#aad8a7',
      cursor: 'no-drop',
      pointerEvents: 'auto !important',
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400
        },
        contained: {
          ...disabledStyle
        },
        outlined: {
          ...disabledStyle
        }
      }
    }
  };
}
