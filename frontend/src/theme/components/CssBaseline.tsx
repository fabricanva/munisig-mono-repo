import { Theme } from '@mui/material';
import type { Components } from '@mui/material/styles';
import keyFrames from 'theme/styles/keyFrames';
import popper from 'theme/styles/popper';
import simplebar from 'theme/styles/simplebar';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme) => ({
    '*': {
      scrollbarWidth: 'thin',
    },
    body: {
      scrollbarColor: `${theme.vars.palette.background.elevation4} transparent`,
      [`h1, h2, h3, h4, h5, h6, p`]: {
        margin: 0,
      },
      fontVariantLigatures: 'none',
      [`[id]`]: {
        scrollMarginTop: 82,
      },
    },
    // Dark mode: make all outlined input fields clearly visible
    '[data-aurora-color-scheme="dark"]': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#2d3141',
      },
      '& .MuiOutlinedInput-input': {
        color: '#ffffff',
      },
      '& .MuiOutlinedInput-root textarea': {
        color: '#ffffff',
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.7)',
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: theme.vars.palette.primary.light,
      },
      '& .MuiSelect-select': {
        color: '#ffffff',
      },
    },
    ...simplebar(theme),
    ...keyFrames(),
    ...popper(theme),
  }),
};

export default CssBaseline;
