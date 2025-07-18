// ...existing code...
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Products.css';
import ProductInfoModal from '../components/ProductInfoModal';
import API from './api';

const Products = () => {
    // Debug: Log all products and their stock values
    useEffect(() => {
        if (products && products.length > 0) {
            console.log('Products and stock:', products.map(p => ({ name: p.name, stock: p.stock })));
        }
    }, [products]);
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [setValues] = useState({
        debitAccount: '',
        creditAccount: '',
        amount: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    },);

    // Load cart from localStorage on mount ONLY if logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } else {
            setCart([]);
            localStorage.removeItem('cart');
        }
    }, []);
    // Save cart to localStorage whenever it changes, ONLY if logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const routingNumber = "000000010";
            const response = await axios.get(API.GET_ALL_PRODUCTS);
            setProducts(response?.data?.data || []);
            setValues((prev) => ({ ...prev, creditAccount: routingNumber }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find(item => item._id === product._id);
            const stockNum = Number(product.stock);
            if (existing) {
                if (existing.quantity < stockNum) {
                    // Add one more to cart
                    return prevCart.map(item =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    alert('Not enough stock available');
                    return prevCart;
                }
            } else {
                if (stockNum > 0) {
                    return [...prevCart, { ...product, quantity: 1 }];
                } else {
                    alert('Not enough stock available');
                    return prevCart;
                }
            }
        });
        // After adding to cart, update the products state to reflect new stock
        setProducts((prevProducts) => prevProducts.map(p => {
            if (p._id === product._id) {
                const stockNum = Number(p.stock);
                return { ...p, stock: stockNum > 0 ? stockNum - 1 : 0 };
            }
            return p;
        }));
    };


    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        setView('billing');

        // Add a callback to update stock after payment
        window.onPaymentComplete = (purchasedCart) => {
            setProducts((prevProducts) => prevProducts.map(p => {
                const purchased = purchasedCart.find(item => item._id === p._id);
                if (purchased) {
                    return { ...p, stock: 0 };
                }
                return p;
            }));
        };
    };


    const categories = ['All', 'Anime', 'Action', 'Horror'];

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Show all products, including out-of-stock
    const filteredValues = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('userRole');
    //     setCart([]);
    //     localStorage.removeItem('cart');
    //     navigate('/Login');
    // };


    return (
        <div className="app-container">

            <div className="category-list">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'contained' : 'outlined'}
                        onClick={() => handleCategoryChange(category)}
                        sx={{ marginRight: '10px', marginBottom: '10px' }}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {view === 'shop' && (
                <div className="shop-container">
                    <h2>Books</h2>
                    <div className="products-list">
                        {filteredValues.map(product => {
                            const stockNum = Number(product.stock);
                            const isOutOfStock = !product.stock || isNaN(stockNum) || stockNum <= 0;
                            return (
                                <div key={product._id} className="product-card">
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setModalOpen(true);
                                        }}
                                    >
                                        <img src={API.UPLOADS + product.image} alt={product.name} />
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                        <h4>₱ {product.price}</h4>
                                        <h4>Stock: {product.stock}</h4>
                                        {/* Rating UI removed */}
                                    </div>
                                    <Button
                                        variant="contained"
                                        disabled={isOutOfStock}
                                        style={isOutOfStock ? { backgroundColor: '#aaa', cursor: 'not-allowed' } : {}}
                                        onClick={() => {
                                            if (isOutOfStock) return;
                                            const token = localStorage.getItem('token');
                                            if (token) {
                                                addToCart(product);
                                            } else {
                                                alert('Please log in to add items to your cart.');
                                                navigate('/Login');
                                                // Do NOT add to cart
                                            }
                                        }}
                                    >
                                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                    <ProductInfoModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        product={selectedProduct}
                        onAddToCart={(product) => {
                            if (localStorage.getItem('token')) {
                                addToCart(product);
                                setModalOpen(false);
                            } else {
                                alert('Please log in to add items to your cart.');
                                setModalOpen(false);
                                navigate('/Login');
                                // Do NOT add to cart
                            }
                        }}
                    // ...rating props removed...
                    />
                    {/* View Cart button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setView('cart')}
                        disabled={cart.length === 0}
                        style={{ marginTop: '20px' }}
                    >
                        View Cart ({cart.length})
                    </Button>
                </div>
            )}

            {view === 'cart' && (
                <div className="cart-container">
                    <h2>Cart</h2>
                    {cart.map((item, index) => (
                        <div key={item._id} className="cart-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h3 style={{ flex: 1 }}>{item.name}</h3>
                            <Button onClick={() => {
                                setCart(prevCart => prevCart.map((c, i) => i === index ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c));
                            }} variant="outlined" size="small" style={{ minWidth: 32 }}>-</Button>
                            <span style={{ width: 32, textAlign: 'center' }}>{item.quantity}</span>
                            <Button onClick={() => {
                                setCart(prevCart => prevCart.map((c, i) => i === index ? { ...c, quantity: Math.min(c.stock, c.quantity + 1) } : c));
                            }} variant="outlined" size="small" style={{ minWidth: 32 }}>+</Button>
                            <span style={{ color: '#b8860b', marginLeft: 8 }}>Stock: {item.stock}</span>
                            {/* Delete button removed as requested */}
                        </div>
                    ))}
                    <h3 className="total-price">Total: ₱ {getTotalPrice()}</h3>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <Button variant="contained" onClick={handleCheckout}>Checkout</Button>
                        <Button variant="outlined" style={{ background: '#fff', color: '#b8860b', border: '1.5px solid #b8860b' }} onClick={() => setView('shop')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
