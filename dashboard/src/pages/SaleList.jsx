import { useEffect, useState } from 'react';
import axios from 'axios';
import API from './api';
import './SaleList.css';

export default function SaleList() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get(API.SALES_DETAIL);
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  return (
    <div className="sales-list-container">
      <h1 className="sales-list-title">Sales</h1>
      <div className="sales-list-header">
        <div className="sales-list-column">Product</div>
        <div className="sales-list-column">Quantity</div>
        <div className="sales-list-column">Price</div>
        <div className="sales-list-column">Date</div>
      </div>
      {sales.map((sale) => (
        <div className="sales-list-item" key={sale._id}>
          <div className="sales-list-column">{sale.product}</div>
          <div className="sales-list-column">{sale.quantity}</div>
          <div className="sales-list-column">₱{sale.price}</div>
          <div className="sales-list-column">{new Date(sale.date).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}
