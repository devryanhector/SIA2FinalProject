// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Products.css';

// const PublicProductList = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const res = await axios.get('http://localhost:3004/getallproducts');
//                 setProducts(res.data?.data || []);
//             } catch (err) {
//                 setError('Failed to load products.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, []);

//     if (loading) return <div className="products-list-loading">Loading products...</div>;
//     if (error) return <div className="products-list-error">{error}</div>;

//     return (
//         <div className="app-container">
//             <h1>All Products</h1>
//             <div className="products-list">
//                 {products.length === 0 ? (
//                     <div>No products found.</div>
//                 ) : (
//                     products.map(product => (
//                         <div className="product-card" key={product._id}>
//                             <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} className="product-image" />
//                             <h2>{product.name}</h2>
//                             <p>{product.description}</p>
//                             <div className="product-meta">
//                                 <span>₱ {product.price}</span>
//                                 <span>Stock: {product.stock}</span>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PublicProductList;