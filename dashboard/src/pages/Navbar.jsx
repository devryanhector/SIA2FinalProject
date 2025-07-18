import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconButton,
  Modal,
  Box,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Badge,
  Button,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Person,
  ShoppingCart,
  ExpandMore
} from '@mui/icons-material';
import './Navbar.css';

function Navbar({ cart = [], onRemoveFromCart = () => { }, scrollToImageSection, onCategorySelect = () => { }, search = '', setSearch = () => { } }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  // search and setSearch now come from props
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [logoutMsgOpen, setLogoutMsgOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setUserRole(localStorage.getItem('userRole'));
  }, [isLoggedIn, userRole]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole('');
    setLogoutMsgOpen(true);
  };

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  const genres = ['All', 'Action', 'Manga', 'Horror'];
  const handleGenreClick = (event) => setAnchorEl(event.currentTarget);
  const handleGenreClose = () => setAnchorEl(null);

  const handleSettingsClick = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Just update the search term, don't navigate
    setSearch(search);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Left: Logo + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="logo-img">
          <img src="/White_Minimalist_Design.png" alt="Bookly Logo" />
        </div>
        <form className="navbar-search" onSubmit={handleSearch} style={{ marginLeft: 0, marginRight: 0 }}>
          <InputBase
            placeholder="Search books or authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ background: '#f1f1f1', borderRadius: 2, padding: '2px 10px', width: 220 }}
          />
        </form>
      </div>

      {/* Right: Nav Links + Cart & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Link
          to="/"
          className="navbar-link"
          style={{ color: 'white', fontWeight: 'bold' }}
          onClick={() => {
            if (typeof scrollToImageSection === 'function') {
              setTimeout(() => scrollToImageSection(), 100);
            }
          }}
        >
          Home
        </Link>
        <Link
          to="/"
          className="navbar-link"
          style={{ color: 'white', fontWeight: 'bold' }}
          onClick={() => {
            setTimeout(() => {
              const menu = document.querySelector('.menu');
              if (menu) menu.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          Books
        </Link>
        <IconButton onClick={handleGenreClick} sx={{ color: 'white', fontWeight: 'bold' }}>
          Categories <ExpandMore />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleGenreClose}>
          {genres.map((genre) => (
            <MenuItem
              key={genre}
              onClick={() => {
                handleGenreClose();
                onCategorySelect(genre);
              }}
            >
              {genre}
            </MenuItem>
          ))}
        </Menu>
        <IconButton sx={{ color: 'white' }} onClick={handleCartOpen} title="Cart">
          <Badge badgeContent={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        {/* Profile/Account Icon */}
        {isLoggedIn ? (
          <IconButton
            sx={{ color: 'white' }}
            onClick={handleSettingsClick}
            title="Account Menu"
          >
            <Person />
          </IconButton>
        ) : (
          <IconButton
            sx={{ color: 'white' }}
            component={Link}
            to="/login"
            title="Login or Register"
          >
            <Person />
          </IconButton>
        )}
        {/* Account Dropdown Menu */}
        <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleSettingsClose}>
          <MenuItem onClick={handleSettingsClose} component={Link} to="/profile">Profile</MenuItem>
          <MenuItem onClick={handleSettingsClose} component={Link} to="/settings">Settings</MenuItem>
          <MenuItem onClick={() => { handleSettingsClose(); handleLogout(); }}>Logout</MenuItem>
        </Menu>
      </div>

      {/* Cart Modal */}
      <Modal
        open={cartOpen}
        onClose={handleCartClose}
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 450,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 3,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <Typography id="cart-modal-title" variant="h6" mb={2}>
            Cart Items
          </Typography>
          {cart.length === 0 ? (
            <Typography>Your cart is currently empty.</Typography>
          ) : (
            <>
              {cart.map((item, index) => (
                <Box key={item._id || index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <div>
                    <Typography fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₱{item.price} × {item.quantity || 1}
                    </Typography>
                  </div>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => onRemoveFromCart(item._id)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={600} mb={1}>
                Total: ₱{totalPrice}
              </Typography>
              <Button variant="contained" color="primary" fullWidth onClick={() => {
                if (cart.length === 0) return;
                handleCartClose();
                navigate('/billing');
              }}>
                Checkout
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Logout Snackbar */}
      <Snackbar open={logoutMsgOpen} autoHideDuration={3000} onClose={() => setLogoutMsgOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setLogoutMsgOpen(false)} severity="success" sx={{ width: '100%' }}>
          Successfully logged out.
        </Alert>
      </Snackbar>
    </nav>
  );
}

export default Navbar;
import PropTypes from 'prop-types';

Navbar.propTypes = {
  cart: PropTypes.array,
  onRemoveFromCart: PropTypes.func,
  scrollToImageSection: PropTypes.func,
  onCategorySelect: PropTypes.func,
  search: PropTypes.string,
  setSearch: PropTypes.func
};
