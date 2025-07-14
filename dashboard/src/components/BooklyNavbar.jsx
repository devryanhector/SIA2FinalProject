import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { ShoppingCart, Person, ExpandMore } from '@mui/icons-material';

const categories = ['Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Sci-Fi', 'Manga', 'Horror'];

export default function BooklyNavbar({ cartCount = 0 }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleCategoryClick = (event) => setAnchorEl(event.currentTarget);
  const handleCategoryClose = () => setAnchorEl(null);

  return (
    <nav className="w-full bg-[#7B1E3D] text-white shadow-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-bold text-2xl tracking-wide">Bookly</span>
          <form className="hidden md:flex" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search books or authors..."
              className="w-56 px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-[#7B1E3D] font-sans"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link to="/" className="hover:text-[#FCDB00] transition-colors font-medium font-sans">Home</Link>
          <Link to="/products" className="hover:text-[#FCDB00] transition-colors font-medium font-sans">Books</Link>
          <div>
            <button
              className="flex items-center gap-1 hover:text-[#FCDB00] transition-colors font-medium font-sans"
              onClick={handleCategoryClick}
              type="button"
            >
              Categories <ExpandMore fontSize="small" />
            </button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCategoryClose}>
              {categories.map((cat) => (
                <MenuItem key={cat} onClick={handleCategoryClose}>{cat}</MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* Right: Cart & Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <IconButton component={Link} to="/cart" className="text-white">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton component={Link} to="/profile" className="text-white">
            <Person />
          </IconButton>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex flex-col gap-1 focus:outline-none ml-2"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <span className="w-6 h-0.5 bg-white rounded"></span>
            <span className="w-6 h-0.5 bg-white rounded"></span>
            <span className="w-6 h-0.5 bg-white rounded"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#7B1E3D] px-4 pb-4 flex flex-col gap-2 animate-fade-in-down font-sans">
          <form className="flex w-full mb-2" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search books or authors..."
              className="w-full px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-[#7B1E3D] font-sans"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <Link to="/" className="hover:text-[#FCDB00] transition-colors font-medium font-sans">Home</Link>
          <Link to="/products" className="hover:text-[#FCDB00] transition-colors font-medium font-sans">Books</Link>
          <button
            className="flex items-center gap-1 hover:text-[#FCDB00] transition-colors font-medium font-sans"
            onClick={handleCategoryClick}
            type="button"
          >
            Categories <ExpandMore fontSize="small" />
          </button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCategoryClose}>
            {categories.map((cat) => (
              <MenuItem key={cat} onClick={handleCategoryClose}>{cat}</MenuItem>
            ))}
          </Menu>
          <div className="flex gap-2 mt-2">
            <IconButton component={Link} to="/cart" className="text-white">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/profile" className="text-white">
              <Person />
            </IconButton>
          </div>
        </div>
      )}
    </nav>
  );
}
