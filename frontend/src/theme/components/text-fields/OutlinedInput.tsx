import { Theme, inputBaseClasses, outlinedInputClasses } from '@mui/material';
import type { Components } from '@mui/material/styles';

const OutlinedInput: Components<Omit<Theme, 'components'>>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: 8,
      // Dark mode: use a visible dark-gray background with white text
      backgroundColor: theme.vars.palette.background.paper,
      color: theme.vars.palette.text.primary,
      [theme.getColorSchemeSelector('dark')]: {
        backgroundColor: 'hsl(220, 10%, 22%)',
        color: '#fff',
        '& input, & textarea': {
          color: '#fff',
        },
        '& input::placeholder, & textarea::placeholder': {
          color: 'rgba(255,255,255,0.45)',
          opacity: 1,
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255,255,255,0.7)',
        },
      },
      ':hover': {
        [`&:not(&.${outlinedInputClasses.focused},.${outlinedInputClasses.disabled},.${outlinedInputClasses.error})`]:
        {
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.vars.palette.action.disabled,
          },
        },
      },
      [`&.${outlinedInputClasses.disabled}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.divider,
        },
      },
      variants: [
        {
          props: { size: 'large' },
          style: {
            [`& .${outlinedInputClasses.input}`]: {
              padding: '7px 20px',
              height: '2.5rem',
              fontSize: '16px',
            },
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              padding: '0 14px',
            },
          },
        },
        {
          props: { size: 'small' },
          style: {
            borderRadius: 4,
          },
        },
      ],
      [`&.${inputBaseClasses.multiline}`]: {
        paddingLeft: 16,
        paddingRight: 16,
      },
    }),
    adornedStart: {
      paddingLeft: 16,
      [`&.${inputBaseClasses.sizeSmall}`]: {
        paddingLeft: 12,
      },
      [`&.MuiInputBase-sizeLarge`]: {
        paddingLeft: 20,
      },
      [`& .${outlinedInputClasses.input}`]: {
        paddingLeft: 0,
      },
    },
    input: () => ({
      padding: '8px 16px',
      height: '2rem',
      fontSize: 14,
    }),
    sizeSmall: {
      borderRadius: 4,
      [`& .${outlinedInputClasses.notchedOutline}`]: {
        padding: '0 6px',
      },
    },
    inputAdornedStart: {
      paddingLeft: 0,
    },
    inputAdornedEnd: {
      paddingRight: 0,
    },
    inputSizeSmall: {
      padding: '8px 12px',
      height: '1.625rem',
    },
    notchedOutline: ({ theme }) => ({
      borderStyle: 'solid',
      borderColor: theme.vars.palette.divider,
      borderWidth: '1px !important',
    }),
    multiline: {
      paddingTop: 13.5,
      paddingBottom: 13.5,
      paddingLeft: 11,
      paddingRight: 11,
      [`& .${outlinedInputClasses.input}`]: {
        padding: 0,
      },
    },
  },
};

export default OutlinedInput;
