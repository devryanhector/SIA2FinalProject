import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Dashboard.css';
import Navbar from './Navbar';
import PropTypes from 'prop-types';
import ManageProduct from './ManageProduct';
import { useNavigate } from 'react-router-dom';
import API from './api';

function Dashboard({ user, cart, setCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Remove product from cart by id
  const handleRemoveFromCart = (id) => {
    const newCart = cart.filter(item => item._id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const imageSectionRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API.GET_ALL_PRODUCTS);
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    }
  };

  const openModal = (product) => {
    // navigate to product view page
    navigate(`/product/${product._id}`);
  };

  const addToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setCart(prevCart => {
      const existing = prevCart.find(item => item._id === product._id);
      if (existing) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    alert(`${product.name} added to cart!`);
  };

  const scrollToMenu = () => {
    if (menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToImageSection = () => {
    if (imageSectionRef.current) {
      imageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!user) return <div>Please log in.</div>;

  return (
    <div className="dashboard">
      <Navbar
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        scrollToImageSection={scrollToImageSection}
        onCategorySelect={setSelectedCategory}
        search={searchTerm}
        setSearch={setSearchTerm}
      />
      {user.role === 'buyer' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
          {/* Removed Dashboard button for buyer */}
        </div>
      )}

      <div className="image-section" ref={imageSectionRef}>
        <Slider {...settings} afterChange={scrollToMenu}>
          <div><img src="/homepage_standard_1920x.jpg" alt="Slide 1" /></div>
          <div><img src="/515091812_1257302482713820_6347707086264455510_n.png" alt="Slide 2" /></div>
          <div><img src="/513742376_1341673777579540_6777621102215699768_n.png" alt="Slide 3" /></div>
          <div><img src="/513887849_747829294487602_8840850345417571571_n.png" alt="Slide 3" /></div>
          <div><img src="/513875411_1073710680873615_4252149083480135960_n.png" alt="Slide 4" /></div>
          <div><img src="/511289215_4356202001279335_7289149741542506002_n.png" alt="Slide 5" /></div>
          <div><img src="/516039807_1045705001021558_4025584833444277380_n.png" alt="Slide 6" /></div>
        </Slider>
      </div>

      <div className="main-section">
        <h2>Welcome to Bookly!</h2>
        <p>
          Bookly is a digital library platform that provides easy access to a wide collection of e-books.
        </p>
      </div>

      <div className="menu" ref={menuRef}>
        <h1>Books</h1>
        {error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="menu-container">
            {products
              .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
              .filter(product =>
                searchTerm.trim() === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((product) => (
                <div
                  key={product._id}
                  className="card"
                  onClick={() => openModal(product)}
                >
                  <div className="image-container">
                    <img src={API.UPLOADS + product.image} alt={product.name} />
                  </div>
                  <div className="label">
                    <h3>{product.name}</h3>
                  </div>
                  <div className="price">
                    <p style={{ fontWeight: 600, color: '#B85C38', fontSize: 18, margin: 0 }}>₱{product.price}</p>
                  </div>
                  <div className="description">
                    <p style={{ fontSize: 14, color: '#444', margin: '8px 0 0 0', minHeight: 36 }}>{product.description}</p>
                  </div>
                  {Number(product.stock) <= 0 ? (
                    <button
                      style={{
                        marginTop: 10,
                        background: '#aaa',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 16px',
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'not-allowed',
                        transition: 'background 0.2s',
                      }}
                      disabled
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      style={{
                        marginTop: 10,
                        background: '#B85C38',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 16px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: 15,
                        transition: 'background 0.2s',
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {user.role === 'admin' && (
        <div>
          <h2>Admin Panel</h2>
          <ul>
            <li>Manage Users (feature coming soon)</li>
            <li><ManageProduct /></li>
            <li>View Sales (feature coming soon)</li>
          </ul>
        </div>
      )}
      {user.role === 'seller' && (
        <div>
          <h2>Seller Panel</h2>
          <ul>
            <li><ManageProduct /></li>
            <li>View Sales (feature coming soon)</li>
          </ul>
        </div>
      )}
      {/* Only show Buyer Panel for buyers, no manage product/account */}
      {/* {user.role === 'buyer' && (
        // <div>
        //   <h2>Buyer Panel</h2>
        //   <ul>
        //     <li>Add to Cart</li>
        //     <li>Purchase</li>
        //     <li>Check Details</li>
        //   </ul>
        // </div>
      )} */}
      {/* Footer */}
      <footer style={{ background: '#7B1E3D', color: 'white', marginTop: 48, fontFamily: 'inherit', boxShadow: '0 -2px 16px #0002', width: '100%' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 48,
          padding: '40px 24px 16px 24px',
          width: '100%',
        }}>
          <div style={{ minWidth: 200, flex: 1 }}>
            <h4 style={{ color: '#FFD9B7', marginBottom: 16, letterSpacing: 1 }}>About Bookly</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, columnCount: 2, columnGap: 24 }}>
              <li className="footer-link">About Us</li>
              <li className="footer-link">Blog</li>
              <li className="footer-link">Mission and Vision</li>
              <li className="footer-link">Events</li>
              <li className="footer-link">Careers</li>
              <li className="footer-link">Product Index</li>
            </ul>
          </div>
          <div style={{ minWidth: 200, flex: 1 }}>
            <h4 style={{ color: '#FFD9B7', marginBottom: 16, letterSpacing: 1 }}>Customer Service</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, columnCount: 2, columnGap: 24 }}>
              <li className="footer-link">FAQ</li>
              <li className="footer-link">Shipping and Delivery</li>
              <li className="footer-link">Help Center</li>
              <li className="footer-link">Payment Method</li>
              <li className="footer-link">Exchange and Return</li>
              <li className="footer-link">Contact Us</li>
              <li className="footer-link">How to Buy</li>
            </ul>
          </div>
          <div style={{ minWidth: 200, flex: 1 }}>
            <h4 style={{ color: '#FFD9B7', marginBottom: 16, letterSpacing: 1 }}>Contact & Info</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>Bayombong, Nueva Vizcaya, Philippines</li>
              <li style={{ marginBottom: 8 }}>Email: info@bookly.com</li>
              <li style={{ marginBottom: 8 }}>Phone: (078) 123-4567</li>
              <li style={{ marginBottom: 8 }}>Mon-Fri: 8am - 6pm</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #fff3', marginTop: 32, padding: '18px 0 8px 0', textAlign: 'center', fontSize: 15, background: 'rgba(0,0,0,0.04)' }}>
          <div style={{ fontWeight: 500, letterSpacing: 1 }}>© 2025 Bookly. All Rights Reserved.</div>
        </div>
        <style>{`
          .footer-link {
            margin-bottom: 8px;
            transition: color 0.2s;
            cursor: pointer;
            display: block;
          }
          .footer-link:hover {
            color: #FFB84C;
            text-decoration: underline;
          }
        `}</style>
      </footer>
    </div>
  );
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  cart: PropTypes.array.isRequired,
  setCart: PropTypes.func.isRequired,
};

export default Dashboard;
