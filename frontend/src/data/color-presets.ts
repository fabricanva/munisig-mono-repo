export interface PresetOption {
  value: string;
  label: string;
  preset: 'default' | 'luxury' | 'retro' | 'arctic' | 'nature';
  mode?: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    error: string;
    warning: string;
    success: string;
    neutral: string;
  };
}

const lightPaletteMainColors = {
  primary: '#3385F0',
  secondary: '#A641FA',
  error: '#D02241',
  warning: '#F68D2A',
  success: '#099F69',
  neutral: '#1B2124',
} as const;

const darkPaletteMainColors = {
  primary: '#589BF3',
  secondary: '#B663FB',
  error: '#D84A63',
  warning: '#F8A250',
  success: '#35B084',
  neutral: '#C3D3DB',
} as const;

const corePresetOptions: PresetOption[] = [
  {
    value: 'default-light',
    label: 'Light',
    preset: 'default',
    mode: 'light',
    colors: lightPaletteMainColors,
  },
  {
    value: 'default-dark',
    label: 'Dark',
    preset: 'default',
    mode: 'dark',
    colors: darkPaletteMainColors,
  },
];

export const presetOptions: PresetOption[] = [...corePresetOptions];

