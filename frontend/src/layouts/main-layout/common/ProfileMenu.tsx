import { PropsWithChildren, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Box,
  Button,
  Divider,
  Link,
  ListItemIcon,
  MenuItem,
  MenuItemProps,
  Stack,
  SxProps,
  Typography,
  listClasses,
  listItemIconClasses,
  paperClasses,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import StatusAvatar from 'components/base/StatusAvatar';

interface ProfileMenuItemProps extends MenuItemProps {
  icon: string;
  href?: string;
  sx?: SxProps;
}

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        const userId = payload.sub;

        axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          const user = res.data;
          let name = user.username;
          let designation = user.role;
          let initials = name.substring(0, 2).toUpperCase();

          if (user.personnel) {
            name = `${user.personnel.firstName || ''} ${user.personnel.lastName || ''}`.trim() || name;
            const fInitial = user.personnel.firstName ? user.personnel.firstName.charAt(0).toUpperCase() : '';
            const lInitial = user.personnel.lastName ? user.personnel.lastName.charAt(0).toUpperCase() : '';
            if (fInitial || lInitial) {
              initials = `${fInitial}${lInitial}`;
            }
            if (user.personnel.functionRole) {
              designation = user.personnel.functionRole;
            }
          }
          setProfile({ name, designation, initials });
        }).catch(err => console.error("Could not fetch user profile", err));
      } catch (err) {
        console.error("Could not parse token", err);
      }
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const menuButton = (
    <Button
      color="neutral"
      variant="text"
      shape="circle"
      onClick={handleClick}
      sx={{
        height: 44,
        width: 44,
      }}
    >
      <StatusAvatar
        alt={profile?.name || demoUser.name}
        status="online"
        src={profile?.avatar || demoUser.avatar || undefined}
        sx={{
          width: 40,
          height: 40,
          border: 2,
          borderColor: 'background.paper',
        }}
      >
        {profile?.initials}
      </StatusAvatar>
    </Button>
  );
  return (
    <>
      {menuButton}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={menuOpen}
        onClose={handleClose}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: { minWidth: 320 },
          [`& .${listClasses.root}`]: { py: 0 },
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <StatusAvatar
            status="online"
            alt={profile?.name || demoUser.name}
            src={profile?.avatar || demoUser.avatar || undefined}
            sx={{ width: 48, height: 48 }}
          >
            {profile?.initials}
          </StatusAvatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {profile?.name || demoUser.name}
            </Typography>
            {(profile?.designation || demoUser.designation) && (
              <Typography
                variant="subtitle2"
                textTransform="capitalize"
                sx={{
                  color: 'warning.main',
                }}
              >
                {profile?.designation || demoUser.designation}
                <IconifyIcon
                  icon="material-symbols:diamond-rounded"
                  color="warning.main"
                  sx={{ verticalAlign: 'text-bottom', ml: 0.5 }}
                />
              </Typography>
            )}
          </Box>
        </Stack>
        <Divider />
        <Box sx={{ py: 1 }}>
          <ProfileMenuItem
            icon="material-symbols:manage-accounts-outline-rounded"
            onClick={handleClose}
            href="#!"
          >
            Account Settings
          </ProfileMenuItem>
        </Box>
        <Divider />
        <Box sx={{ py: 1 }}>
          {profile || demoUser ? (
            <ProfileMenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
              icon="material-symbols:logout-rounded"
            >
              Sign Out
            </ProfileMenuItem>
          ) : (
            <ProfileMenuItem href={paths.login} icon="material-symbols:login-rounded">
              Sign In
            </ProfileMenuItem>
          )}
        </Box>
      </Menu>
    </>
  );
};

const ProfileMenuItem = ({
  icon,
  onClick,
  children,
  href,
  sx,
}: PropsWithChildren<ProfileMenuItemProps>) => {
  const linkProps = href ? { component: Link, href, underline: 'none' } : {};
  return (
    <MenuItem onClick={onClick} {...linkProps} sx={{ gap: 1, ...sx }}>
      <ListItemIcon
        sx={{
          [`&.${listItemIconClasses.root}`]: { minWidth: 'unset !important' },
        }}
      >
        <IconifyIcon icon={icon} sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      {children}
    </MenuItem>
  );
};

export default ProfileMenu;

const demoUser = {
  id: 0,
  email: 'guest@mail.com',
  name: 'Guest',
  designation: undefined, // Type requirement
  avatar: undefined // Remove the default image so it falls back to the generated initials correctly
};
