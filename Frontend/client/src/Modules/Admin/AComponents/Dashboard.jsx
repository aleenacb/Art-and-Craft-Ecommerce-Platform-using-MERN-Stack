import * as React from 'react';
import { useState, useMemo } from 'react';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';
import { Collapse, ListItemButton, ListItemIcon } from '@mui/material';
const ADMIN_EMAIL = 'admin@gmail.com'; 
// ---------- Styled Search ----------
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: { width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' },
  },
}));

// ---------- CraftNest Hero Banner SVG ----------
const CraftNestBanner = () => (
  <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', mb: 4, boxShadow: '0 8px 32px rgba(212,113,78,0.18)' }}>
    <svg width="100%" viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cn_bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDF3E7"/>
          <stop offset="60%" stopColor="#FAE0C8"/>
          <stop offset="100%" stopColor="#F5C9A0"/>
        </linearGradient>
        <linearGradient id="cn_blob1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4714E" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#EF9F27" stopOpacity="0.18"/>
        </linearGradient>
        <linearGradient id="cn_blob2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#378ADD" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#5DCAA5" stopOpacity="0.15"/>
        </linearGradient>
        <linearGradient id="cn_blob3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4537E" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#EF9F27" stopOpacity="0.12"/>
        </linearGradient>
        <linearGradient id="cn_btn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4714E"/>
          <stop offset="100%" stopColor="#EF9F27"/>
        </linearGradient>
        <clipPath id="cn_clip">
          <rect width="900" height="340" rx="16"/>
        </clipPath>
        <style>{`
          @keyframes cn_float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes cn_fadein { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
          .cn_brush { animation: cn_float 4s ease-in-out infinite; transform-origin: 80px 220px; }
          .cn_spool { animation: cn_float 5s ease-in-out infinite 1s; transform-origin: 820px 200px; }
          .cn_title { animation: cn_fadein 0.9s ease both 0.1s; }
          .cn_sub   { animation: cn_fadein 0.9s ease both 0.35s; }
          .cn_cta   { animation: cn_fadein 0.9s ease both 0.55s; }
          .cn_tag   { animation: cn_fadein 0.9s ease both 0.75s; }
        `}</style>
      </defs>

      <g clipPath="url(#cn_clip)">
        <rect width="900" height="340" fill="url(#cn_bg)"/>
        <ellipse cx="120" cy="60" rx="130" ry="80" fill="url(#cn_blob1)"/>
        <ellipse cx="820" cy="290" rx="140" ry="85" fill="url(#cn_blob2)"/>
        <ellipse cx="760" cy="55" rx="90" ry="55" fill="url(#cn_blob3)"/>
        <circle cx="650" cy="42" r="5" fill="#D4714E" opacity="0.35"/>
        <circle cx="663" cy="34" r="3" fill="#EF9F27" opacity="0.3"/>
        <circle cx="640" cy="55" r="2" fill="#D4714E" opacity="0.2"/>
        <circle cx="200" cy="295" r="4" fill="#378ADD" opacity="0.28"/>
        <circle cx="212" cy="305" r="2.5" fill="#185FA5" opacity="0.22"/>
        <path d="M0 175 Q112 160 225 175 Q337 190 450 175 Q562 160 675 175 Q787 190 900 175"
              fill="none" stroke="#D4714E" strokeWidth="1" opacity="0.14" strokeDasharray="7 5"/>
        <path d="M0 185 Q112 170 225 185 Q337 200 450 185 Q562 170 675 185 Q787 200 900 185"
              fill="none" stroke="#BA7517" strokeWidth="0.7" opacity="0.1" strokeDasharray="5 7"/>
        <g className="cn_brush" transform="translate(60, 120) rotate(-28)">
          <rect x="-6" y="0" width="12" height="100" rx="5" fill="#633806"/>
          <rect x="-5" y="10" width="10" height="7" rx="1.5" fill="#412402" opacity="0.45"/>
          <rect x="-7" y="97" width="14" height="16" rx="2.5" fill="#888780"/>
          <path d="M-7 113 Q0 155 7 113 L6 158 Q0 172 -6 158 Z" fill="#2C2C2A"/>
          <path d="M-3 113 Q0 148 3 113 L2 154 Q0 168 -2 154 Z" fill="#555" opacity="0.5"/>
        </g>
        <g transform="translate(760, 60)">
          <path d="M0 42 Q-12 0 22 -6 Q64 -14 70 28 Q76 62 48 74 Q24 80 12 62 Q0 80 -18 62 Q-32 46 0 42Z"
                fill="#FAE8CE" stroke="#BA7517" strokeWidth="1.5"/>
          <circle cx="12" cy="22" r="8" fill="#D85A30"/>
          <circle cx="35" cy="13" r="8" fill="#378ADD"/>
          <circle cx="58" cy="26" r="8" fill="#1D9E75"/>
          <circle cx="57" cy="50" r="8" fill="#D4537E"/>
          <circle cx="34" cy="60" r="8" fill="#EF9F27"/>
          <ellipse cx="6" cy="56" rx="9" ry="7" fill="#BA7517" opacity="0.25"/>
        </g>
        <g transform="translate(848, 130)">
          <path d="M0 0 Q-9 34 -3 68 L4 68 Q9 34 7 0 Z" fill="#B4B2A9"/>
          <circle cx="0" cy="0" r="11" fill="none" stroke="#888780" strokeWidth="2.5"/>
          <circle cx="0" cy="0" r="5.5" fill="#D3D1C7"/>
          <path d="M7 0 Q20 34 14 68 L21 68 Q26 34 21 0 Z" fill="#B4B2A9" opacity="0.75"/>
          <circle cx="21" cy="0" r="11" fill="none" stroke="#888780" strokeWidth="2.5"/>
          <circle cx="21" cy="0" r="5.5" fill="#D3D1C7"/>
        </g>
        <g className="cn_spool" transform="translate(800, 215)">
          <ellipse cx="0" cy="0" rx="28" ry="11" fill="#D4537E" opacity="0.9"/>
          <rect x="-28" y="0" width="56" height="34" fill="#D4537E" opacity="0.78"/>
          <ellipse cx="0" cy="34" rx="28" ry="11" fill="#A32D2D" opacity="0.88"/>
          <ellipse cx="0" cy="17" rx="22" ry="8" fill="none" stroke="#F4C0D1" strokeWidth="2.2" opacity="0.9"/>
          <ellipse cx="0" cy="17" rx="15" ry="5.5" fill="none" stroke="#FBEAF0" strokeWidth="1.5" opacity="0.7"/>
        </g>
        <text x="288" y="142" fontSize="20" fill="#EF9F27" opacity="0.65" fontFamily="serif">✦</text>
        <text x="598" y="138" fontSize="15" fill="#D4537E" opacity="0.6" fontFamily="serif">✦</text>
        <text x="450" y="62" fontSize="11" fill="#D4714E" opacity="0.45" fontFamily="serif">✦</text>
        <path d="M20 325 Q45 298 80 314 Q58 332 20 325Z" fill="#BA7517" opacity="0.18"/>
        <path d="M875 22 Q888 46 865 62 Q852 40 875 22Z" fill="#1D9E75" opacity="0.18"/>
        <g className="cn_tag">
          <rect x="358" y="52" width="184" height="26" rx="13" fill="#D4714E" opacity="0.12"/>
          <text x="450" y="70" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" letterSpacing="2.5" fill="#993C1D" opacity="0.85">✦  HANDMADE WITH LOVE  ✦</text>
        </g>
        <g className="cn_title">
          <text x="450" y="140" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="62" fontWeight="700" letterSpacing="-1.5" fill="#412402">CraftNest</text>
        </g>
        <path d="M255 152 Q352 164 450 156 Q548 148 645 160" fill="none" stroke="#D4714E" strokeWidth="4.5" strokeLinecap="round" opacity="0.7"/>
        <g className="cn_sub">
          <text x="450" y="192" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="18" fontStyle="italic" letterSpacing="0.5" fill="#633806" opacity="0.88">Where every piece tells a story</text>
        </g>
        <circle cx="400" cy="215" r="3.5" fill="#D4714E" opacity="0.55"/>
        <circle cx="450" cy="215" r="3.5" fill="#EF9F27" opacity="0.65"/>
        <circle cx="500" cy="215" r="3.5" fill="#D4537E" opacity="0.55"/>
        <g className="cn_cta">
          <rect x="340" y="232" width="220" height="50" rx="25" fill="url(#cn_btn)"/>
          <text x="450" y="263" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="17" fontWeight="600" letterSpacing="1" fill="#FDF3E7">Explore Collection</text>
        </g>
        <g className="cn_tag">
          <text x="450" y="310" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="12" letterSpacing="2.5" fill="#993C1D" opacity="0.65">PAINT  ·  STITCH  ·  SCULPT  ·  CREATE</text>
        </g>
      </g>
    </svg>
  </Box>
);

export default function Dashboard() {
  const [usersOpen, setUsersOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [productOpen, setProductOpen] = React.useState(false);
  const [ordersOpen, setOrdersOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState('light');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [mailAnchor, setMailAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const Theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: '#D4714E' } },
  }), [mode]);

  const toggleColorMode = () => setMode((prev) => prev === 'light' ? 'dark' : 'light');
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };



const handleLogin = async () => {
    if (!formData.email || !formData.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:7000/user/AdminLogin", formData);
      if (res.data.success === true) {
    setIsLoggedIn(true);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userId', res.data.user._id);
} else {
    setError(res.data.message || 'Invalid email or password.');
}
    } catch (err) {
      console.log("Error response:", err.response?.data);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setAnchorEl(null);
  };

  const handleProfileOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleMobileMenuOpen = (e) => setMobileMenuAnchor(e.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const handleMailOpen = (e) => setMailAnchor(e.currentTarget);
  const handleMailClose = () => setMailAnchor(null);
  const handleSearch = (e) => { if (e.key === 'Enter' && searchValue.trim()) alert(`Searching for: "${searchValue}"`); };

  // ===================== MENUS =====================
  const renderProfileMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
      <MenuItem onClick={handleProfileClose}>My Account</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const renderNotifMenu = (
    <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={handleNotifClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem onClick={handleNotifClose}>New order placed</MenuItem>
      <MenuItem onClick={handleNotifClose}>Your item was shipped</MenuItem>
      <MenuItem onClick={handleNotifClose}>Payment received</MenuItem>
    </Menu>
  );

  const renderMailMenu = (
    <Menu anchorEl={mailAnchor} open={Boolean(mailAnchor)} onClose={handleMailClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem onClick={handleMailClose}>Message from Admin</MenuItem>
      <MenuItem onClick={handleMailClose}>New inquiry received</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu anchorEl={mobileMenuAnchor} open={Boolean(mobileMenuAnchor)} onClose={handleMobileMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem onClick={(e) => { handleMobileMenuClose(); handleMailOpen(e); }}>
        <IconButton size="large" color="inherit"><Badge badgeContent={4} color="error"><MailIcon /></Badge></IconButton>
        Messages
      </MenuItem>
      <MenuItem onClick={(e) => { handleMobileMenuClose(); handleNotifOpen(e); }}>
        <IconButton size="large" color="inherit"><Badge badgeContent={17} color="error"><NotificationsIcon /></Badge></IconButton>
        Notifications
      </MenuItem>
      <MenuItem onClick={(e) => { handleMobileMenuClose(); handleProfileOpen(e); }}>
        <IconButton size="large" color="inherit"><AccountCircle /></IconButton>
        Profile
      </MenuItem>
      <MenuItem onClick={() => { handleMobileMenuClose(); toggleColorMode(); }}>
        <IconButton size="large" color="inherit">{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
        {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </MenuItem>
    </Menu>
  );

  // ===================== SIDEBAR — unique icon per section =====================
  const renderSidebarList = (
    <List>

      {/* Dashboard — grid/widget icon */}
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/Admin/Dashboard">
          <ListItemIcon><SpaceDashboardIcon sx={{ color: '#D4714E' }} /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>

      {/* Users — people icon */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setUsersOpen(!usersOpen)}>
          <ListItemIcon><ManageAccountsIcon sx={{ color: '#378ADD' }} /></ListItemIcon>
          <ListItemText primary="Users" />
          {usersOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={usersOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/ViewUser">
              <ListItemText primary="View Users" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/AddUser">
              <ListItemText primary="Add Users" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* Products — box/inventory icon */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setProductOpen(!productOpen)}>
          <ListItemIcon><StorefrontIcon sx={{ color: '#1D9E75' }} /></ListItemIcon>
          <ListItemText primary="Products" />
          {productOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={productOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/AddProduct">
              <ListItemText primary="Add Product" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/ViewProduct">
              <ListItemText primary="View Product" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* Category — category/tag icon */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setCategoryOpen(!categoryOpen)}>
          <ListItemIcon><WorkspacesIcon sx={{ color: '#EF9F27' }} /></ListItemIcon>
          <ListItemText primary="Category" />
          {categoryOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={categoryOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/AddCategory">
              <ListItemText primary="Add Category" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/ViewCategory">
              <ListItemText primary="View Category" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* Orders — shopping cart icon */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOrdersOpen(!ordersOpen)}>
          <ListItemIcon><ReceiptLongIcon sx={{ color: '#D4537E' }} /></ListItemIcon>
          <ListItemText primary="Orders" />
          {ordersOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton
              component={Link}
              to="/Admin/AdminBooking"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Booking" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/Manageorder">
              <ListItemText primary="Manage Order" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

{/* <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItem disablePadding sx={{ pl: 4 }}>
      <ListItemButton
        component={Link}
        to="/Users/Booking"
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemText primary="Booking" />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding sx={{ pl: 4 }}>
      <ListItemButton component={Link} to="/Admin/Manageorder">
        <ListItemText primary="Manage Order" />
      </ListItemButton>
    </ListItem>
  </List>
</Collapse> */}

      {/* Payment — payments/wallet icon */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setPaymentOpen(!paymentOpen)}>
          <ListItemIcon><AccountBalanceWalletIcon sx={{ color: '#5DCAA5' }} /></ListItemIcon>
          <ListItemText primary="Payment" />
          {paymentOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={paymentOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/ManagePayment">
              <ListItemText primary="Manage Payment" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* Feedback — review/star icon */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setFeedbackOpen(!feedbackOpen)}>
          <ListItemIcon><ForumIcon sx={{ color: '#9B59B6' }} /></ListItemIcon>
          <ListItemText primary="Feedback" />
          {feedbackOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={feedbackOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Admin/ViewFeedback">
              <ListItemText primary="View Feedback" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

    </List>
  );

  // Side drawer
  const renderDrawer = (
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 240 }} role="presentation">
        <Typography variant="h6" sx={{ p: 2, color: '#D4714E', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
          CraftNest
        </Typography>
        <Divider />
        {renderSidebarList}
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon sx={{ color: '#e53935' }} /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );

  // ===================== NAVBAR =====================
  const renderNavbar = (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn && (
            <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 1 }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
            CraftNest
          </Typography>
          {isLoggedIn && (
            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }}
                value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleSearch} />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {isLoggedIn && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                <IconButton size="large" color="inherit" onClick={toggleColorMode}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Messages">
                <IconButton size="large" color="inherit" onClick={handleMailOpen}>
                  <Badge badgeContent={4} color="error"><MailIcon /></Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton size="large" color="inherit" onClick={handleNotifOpen}>
                  <Badge badgeContent={17} color="error"><NotificationsIcon /></Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Account">
                <IconButton size="large" edge="end" color="inherit" onClick={handleProfileOpen}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          {isLoggedIn && (
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" color="inherit" onClick={handleMobileMenuOpen}><MoreIcon /></IconButton>
            </Box>
          )}
          {!isLoggedIn && (
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton size="large" color="inherit" onClick={toggleColorMode}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderProfileMenu}
      {renderNotifMenu}
      {renderMailMenu}
      {renderDrawer}
    </Box>
  );

  // ===================== LOGIN PAGE =====================
  const renderLoginPage = (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Paper elevation={6} sx={{ padding: 4, width: '100%', maxWidth: 420, borderRadius: 3, backgroundColor: mode === 'dark' ? '#2c2c2c' : '#fff' }}>
        <Typography variant="h4" fontWeight="bold" color="primary" mb={1} textAlign="center">CraftNest</Typography>
        <Typography variant="h6" mb={3} textAlign="center" color="text.secondary">Login to your account</Typography>
        {error && <Typography color="error" mb={2} textAlign="center" fontSize={14}>{error}</Typography>}
        <TextField variant="outlined" type="email" label="Email" name="email" fullWidth sx={{ mb: 2 }} value={formData.email} onChange={handleChange} />
        <TextField variant="outlined" type="password" label="Password" name="password" fullWidth sx={{ mb: 3 }} value={formData.password} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        <Button variant="contained" fullWidth size="large" onClick={handleLogin} disabled={loading} sx={{ borderRadius: 2, py: 1.4, fontSize: 16 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </Paper>
    </Box>
  );

  // ===================== DASHBOARD PAGE =====================
  const renderDashboardPage = (
    <Box sx={{ p: 3 }}>
      <CraftNestBanner />
      <Typography variant="h4" fontWeight="bold" color="primary">
        Welcome to CraftNest Dashboard
      </Typography>
      <Typography variant="body1" mt={1} color="text.secondary">
        You are successfully logged in.
      </Typography>
      <Outlet />
    </Box>
  );

  // ===================== MAIN RENDER =====================
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {renderNavbar}
      {isLoggedIn ? renderDashboardPage : renderLoginPage}
    </ThemeProvider>
  );
}
