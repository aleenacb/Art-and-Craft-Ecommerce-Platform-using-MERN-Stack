<<<<<<< HEAD
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
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
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import axios from 'axios';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Collapse, ListItemButton, ListItemIcon } from '@mui/material';

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
          .cn_brush { animation: cn_float 4s ease-in-out infinite; }
          .cn_spool { animation: cn_float 5s ease-in-out infinite 1s; }
          .cn_title { animation: cn_fadein 0.9s ease both 0.1s; }
          .cn_sub   { animation: cn_fadein 0.9s ease both 0.35s; }
          .cn_cta   { animation: cn_fadein 0.9s ease both 0.55s; }
          .cn_tag   { animation: cn_fadein 0.9s ease both 0.75s; }
        `}</style>
      </defs>
      <g clipPath="url(#cn_clip)">
        <rect width="900" height="340" fill="url(#cn_bg)"/>
        <ellipse cx="120" cy="60" rx="130" ry="80" fill="#D4714E" opacity="0.15"/>
        <ellipse cx="820" cy="290" rx="140" ry="85" fill="#378ADD" opacity="0.12"/>
        <g className="cn_brush" transform="translate(60, 120) rotate(-28)">
          <rect x="-6" y="0" width="12" height="100" rx="5" fill="#633806"/>
          <rect x="-7" y="97" width="14" height="16" rx="2.5" fill="#888780"/>
          <path d="M-7 113 Q0 155 7 113 L6 158 Q0 172 -6 158 Z" fill="#2C2C2A"/>
        </g>
        <g className="cn_spool" transform="translate(800, 215)">
          <ellipse cx="0" cy="0" rx="28" ry="11" fill="#D4537E" opacity="0.9"/>
          <rect x="-28" y="0" width="56" height="34" fill="#D4537E" opacity="0.78"/>
          <ellipse cx="0" cy="34" rx="28" ry="11" fill="#A32D2D" opacity="0.88"/>
        </g>
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

export default function Login() {
  const navigate = useNavigate(); // ✅ FIXED: added useNavigate

  const [profileOpen, setProfileOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [orderOpen, setOrderOpen] = React.useState(false);
  const [trackOpen, setTrackOpen] = React.useState(false);
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
  const [categories, setCategories] = useState([]); // ✅ FIXED: added categories state

  // ✅ FIXED: fetch categories from API
  useEffect(() => {
    axios.get('http://localhost:7000/product/getProducts')
      .then(res => {
        const data = res.data.pdata || [];
        const cats = [...new Set(
          data.map(p =>
            typeof p.categoryId === 'object'
              ? p.categoryId?.categoryName
              : p.categoryId
          ).filter(Boolean)
        )];
        setCategories(cats);
      })
      .catch(err => console.error(err));
  }, []);

  const Theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#D4714E' },
    },
  }), [mode]);

  const toggleColorMode = () => setMode((prev) => prev === 'light' ? 'dark' : 'light');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:7000/user/Login", formData);
      if (res.data.success === true) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user._id);
        setIsLoggedIn(true);
      } else {
        setError(res.data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.log(err);
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
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) alert(`Searching for: "${searchValue}"`);
  };

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

  // ===================== SIDEBAR LIST =====================
  const renderSidebarList = (
    <List>
      {/* Dashboard */}
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/Users/Login">
          <ListItemIcon><DashboardCustomizeIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>

      {/* Products — ✅ FIXED: navigates to FilterCategory, not ViewProductDetail/:id
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/Users/FilterCategory">
          <ListItemIcon><DashboardCustomizeIcon /></ListItemIcon>
          <ListItemText primary="Products" />
        </ListItemButton>
      </ListItem> */}
      {/* 4. Filter Category — ✅ FIXED: uses navigate + dynamic categories */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setFilterOpen(!filterOpen)}>
          <ListItemIcon><FilterListIcon /></ListItemIcon>
          <ListItemText primary="Filter Category" />
          {filterOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={filterOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton onClick={() => { navigate('/Users/FilterCategory'); setDrawerOpen(false); }}>
              <ListItemText primary="All Products" />
            </ListItemButton>
          </ListItem>
          {categories.map((cat) => (
            <ListItem disablePadding sx={{ pl: 4 }} key={cat}>
              {/* <ListItemButton onClick={() => {
                navigate(`/Users/FilterCategory?category=${encodeURIComponent(cat)}`);
                setDrawerOpen(false);
              }}>
                <ListItemText primary={cat} />
              </ListItemButton> */}
            </ListItem>
          ))}
        </List>
      </Collapse>

      {/* 3. Manage Profile */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setProfileOpen(!profileOpen)}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Manage Profile" />
          {profileOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={profileOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/UpdateProfile">
              <ListItemText primary="Update Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 6. Orders */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOrderOpen(!orderOpen)}>
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
          {orderOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={orderOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/Cart">
              <ListItemText primary="My Cart" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/OrderHistory">
              <ListItemText primary="Order History" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 7. Track Orders */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setTrackOpen(!trackOpen)}>
          <ListItemIcon><LocalShippingIcon /></ListItemIcon>
          <ListItemText primary="Track Orders" />
          {trackOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={trackOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/OrderHistory">
              <ListItemText primary="Track Status" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 8. Payment */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setPaymentOpen(!paymentOpen)}>
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Payment" />
          {paymentOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={paymentOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/MakePayment">
              <ListItemText primary="Make Payment" />
            </ListItemButton>
          </ListItem> */}
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/PaymentHistory">
              <ListItemText primary="Payment History" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 10. Feedback */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setFeedbackOpen(!feedbackOpen)}>
          <ListItemIcon><StarIcon /></ListItemIcon>
          <ListItemText primary="Feedback" />
          {feedbackOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={feedbackOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/WriteReview">
              <ListItemText primary="Write Review" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/MyReviews">
              <ListItemText primary="My Reviews" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>
    </List>
  );

  const renderDrawer = (
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 250 }} role="presentation">
        <Typography variant="h6" sx={{ p: 2, color: '#D4714E', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
          CraftNest
        </Typography>
        <Divider />
        {renderSidebarList}
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
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
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 1 }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
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

  const renderDashboardPage = (
    <Box sx={{ p: 3 }}>
      <CraftNestBanner />
      <Typography variant="h4" fontWeight="bold" color="primary">Welcome to CraftNest</Typography>
      <Typography variant="body1" mt={1} color="text.secondary">You are successfully logged in.</Typography>
      <Outlet />
    </Box>
  );

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {renderNavbar}
      {isLoggedIn ? renderDashboardPage : renderLoginPage}
    </ThemeProvider>
  );
}
=======
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
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
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import axios from 'axios';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Collapse, ListItemButton, ListItemIcon } from '@mui/material';

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
          .cn_brush { animation: cn_float 4s ease-in-out infinite; }
          .cn_spool { animation: cn_float 5s ease-in-out infinite 1s; }
          .cn_title { animation: cn_fadein 0.9s ease both 0.1s; }
          .cn_sub   { animation: cn_fadein 0.9s ease both 0.35s; }
          .cn_cta   { animation: cn_fadein 0.9s ease both 0.55s; }
          .cn_tag   { animation: cn_fadein 0.9s ease both 0.75s; }
        `}</style>
      </defs>
      <g clipPath="url(#cn_clip)">
        <rect width="900" height="340" fill="url(#cn_bg)"/>
        <ellipse cx="120" cy="60" rx="130" ry="80" fill="#D4714E" opacity="0.15"/>
        <ellipse cx="820" cy="290" rx="140" ry="85" fill="#378ADD" opacity="0.12"/>
        <g className="cn_brush" transform="translate(60, 120) rotate(-28)">
          <rect x="-6" y="0" width="12" height="100" rx="5" fill="#633806"/>
          <rect x="-7" y="97" width="14" height="16" rx="2.5" fill="#888780"/>
          <path d="M-7 113 Q0 155 7 113 L6 158 Q0 172 -6 158 Z" fill="#2C2C2A"/>
        </g>
        <g className="cn_spool" transform="translate(800, 215)">
          <ellipse cx="0" cy="0" rx="28" ry="11" fill="#D4537E" opacity="0.9"/>
          <rect x="-28" y="0" width="56" height="34" fill="#D4537E" opacity="0.78"/>
          <ellipse cx="0" cy="34" rx="28" ry="11" fill="#A32D2D" opacity="0.88"/>
        </g>
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

export default function Login() {
  const navigate = useNavigate(); // ✅ FIXED: added useNavigate

  const [profileOpen, setProfileOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [orderOpen, setOrderOpen] = React.useState(false);
  const [trackOpen, setTrackOpen] = React.useState(false);
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
  const [categories, setCategories] = useState([]); // ✅ FIXED: added categories state

  // ✅ FIXED: fetch categories from API
  useEffect(() => {
    axios.get('http://localhost:7000/product/getProducts')
      .then(res => {
        const data = res.data.pdata || [];
        const cats = [...new Set(
          data.map(p =>
            typeof p.categoryId === 'object'
              ? p.categoryId?.categoryName
              : p.categoryId
          ).filter(Boolean)
        )];
        setCategories(cats);
      })
      .catch(err => console.error(err));
  }, []);

  const Theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#D4714E' },
    },
  }), [mode]);

  const toggleColorMode = () => setMode((prev) => prev === 'light' ? 'dark' : 'light');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:7000/user/Login", formData);
      if (res.data.success === true) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user._id);
        setIsLoggedIn(true);
      } else {
        setError(res.data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.log(err);
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
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) alert(`Searching for: "${searchValue}"`);
  };

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

  // ===================== SIDEBAR LIST =====================
  const renderSidebarList = (
    <List>
      {/* Dashboard */}
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/Users/Login">
          <ListItemIcon><DashboardCustomizeIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>

      {/* Products — ✅ FIXED: navigates to FilterCategory, not ViewProductDetail/:id
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/Users/FilterCategory">
          <ListItemIcon><DashboardCustomizeIcon /></ListItemIcon>
          <ListItemText primary="Products" />
        </ListItemButton>
      </ListItem> */}
      {/* 4. Filter Category — ✅ FIXED: uses navigate + dynamic categories */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setFilterOpen(!filterOpen)}>
          <ListItemIcon><FilterListIcon /></ListItemIcon>
          <ListItemText primary="Filter Category" />
          {filterOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={filterOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton onClick={() => { navigate('/Users/FilterCategory'); setDrawerOpen(false); }}>
              <ListItemText primary="All Products" />
            </ListItemButton>
          </ListItem>
          {categories.map((cat) => (
            <ListItem disablePadding sx={{ pl: 4 }} key={cat}>
              {/* <ListItemButton onClick={() => {
                navigate(`/Users/FilterCategory?category=${encodeURIComponent(cat)}`);
                setDrawerOpen(false);
              }}>
                <ListItemText primary={cat} />
              </ListItemButton> */}
            </ListItem>
          ))}
        </List>
      </Collapse>

      {/* 3. Manage Profile */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setProfileOpen(!profileOpen)}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Manage Profile" />
          {profileOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={profileOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/UpdateProfile">
              <ListItemText primary="Update Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 6. Orders */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOrderOpen(!orderOpen)}>
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
          {orderOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={orderOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/Cart">
              <ListItemText primary="My Cart" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/OrderHistory">
              <ListItemText primary="Order History" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 7. Track Orders */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setTrackOpen(!trackOpen)}>
          <ListItemIcon><LocalShippingIcon /></ListItemIcon>
          <ListItemText primary="Track Orders" />
          {trackOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={trackOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/OrderHistory">
              <ListItemText primary="Track Status" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 8. Payment */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setPaymentOpen(!paymentOpen)}>
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Payment" />
          {paymentOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={paymentOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/MakePayment">
              <ListItemText primary="Make Payment" />
            </ListItemButton>
          </ListItem> */}
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/PaymentHistory">
              <ListItemText primary="Payment History" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* 10. Feedback */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => setFeedbackOpen(!feedbackOpen)}>
          <ListItemIcon><StarIcon /></ListItemIcon>
          <ListItemText primary="Feedback" />
          {feedbackOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={feedbackOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/WriteReview">
              <ListItemText primary="Write Review" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/Users/MyReviews">
              <ListItemText primary="My Reviews" />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>
    </List>
  );

  const renderDrawer = (
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 250 }} role="presentation">
        <Typography variant="h6" sx={{ p: 2, color: '#D4714E', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
          CraftNest
        </Typography>
        <Divider />
        {renderSidebarList}
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
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
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 1 }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
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

  const renderDashboardPage = (
    <Box sx={{ p: 3 }}>
      <CraftNestBanner />
      <Typography variant="h4" fontWeight="bold" color="primary">Welcome to CraftNest</Typography>
      <Typography variant="body1" mt={1} color="text.secondary">You are successfully logged in.</Typography>
      <Outlet />
    </Box>
  );

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {renderNavbar}
      {isLoggedIn ? renderDashboardPage : renderLoginPage}
    </ThemeProvider>
  );
}
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
