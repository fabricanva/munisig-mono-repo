import { Button } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';

const ThemeToggler = () => {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button color="neutral" variant="soft" shape="circle" onClick={handleToggle}>
      <IconifyIcon
        icon={
          mode === 'dark'
            ? 'material-symbols:light-mode-outline-rounded'
            : 'material-symbols:dark-mode-outline-rounded'
        }
        sx={{ fontSize: 22 }}
      />
    </Button>
  );
};

export default ThemeToggler;
