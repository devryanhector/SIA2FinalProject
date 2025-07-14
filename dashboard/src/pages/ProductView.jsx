import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductView.css';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3004/getproduct/${id}`);
        setProduct(res.data?.data);
      } catch (err) {
        setError('Product not found.');
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <div className="product-view-error">{error}</div>;
  if (!product) return <div className="product-view-loading">Loading...</div>;

  return (
    <div className="product-view-container">
      <button className="product-view-back" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="product-view-card">
        <div className="product-view-image">
          <img src={`http://localhost:3004/uploads/${product.image}`} alt={product.name} />
        </div>
        <div className="product-view-details">
          <h2>{product.name}</h2>
          <h3>₱ {product.price}</h3>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
