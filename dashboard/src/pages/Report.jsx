import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from './api';
import './Report.css';

function Report() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [bestSeller, setBestSeller] = useState('');
  const [salesDetails, setSalesDetails] = useState([]);

  useEffect(() => {
    fetchReportsData();
    fetchSalesDetails();
  }, []);

  const fetchReportsData = async () => {
    try {
      const response = await axios.get(API.GET_INVENTORY_REPORT);
      const reports = response.data; // Assuming response.data directly contains the array of reports

      if (reports && reports.length > 0) {
        // Initialize counters
        let totalSalesCounter = 0;
        let totalOrdersCounter = 0;
        const productCounts = {};

        reports.forEach(report => {
          totalSalesCounter += report.totalSales;
          totalOrdersCounter += report.totalOrders;

          if (productCounts[report.bestSeller]) {
            productCounts[report.bestSeller] += 1;
          } else {
            productCounts[report.bestSeller] = 1;
          }
        });

        // Determine best seller
        const bestSellerProduct = Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b);

        setTotalSales(totalSalesCounter);
        setTotalOrders(totalOrdersCounter);
        setBestSeller(bestSellerProduct);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchSalesDetails = async () => {
    try {
      const response = await axios.get(API.SALES_DETAIL);
      const sales = response.data;
      console.log('Sales details:', sales); // Check what 'sales' contains
      setSalesDetails(sales);
    } catch (error) {
      console.error('Error fetching sales details:', error);
    }
  };

  return (
    <div className="view-logs-container">
      <div className="sidebar">
        <Link to="/ManageProduct" className="sidebar-link">Back</Link>
      </div>
      <div className="content">
        <h1>Reports</h1>

        <div className="report-container">
          <div className="report-summary">
            <div className="summary-item">
              <h2>Total Sales</h2>
              <p>₱ {totalSales}</p>
            </div>
            <div className="summary-item">
              <h2>Total Orders</h2>
              <p>{totalOrders}</p>
            </div>
            <div className="summary-item">
              <h2>Best Seller</h2>
              <p>{bestSeller}</p>
            </div>
          </div>
          <div className="report-details">
            <h2>Sales Details</h2>
            <div className="details-header">
              <div className="details-column">Product</div>
              <div className="details-column">Quantity</div>
              <div className="details-column">Price</div>
              <div className="details-column">Date</div>
            </div>
            {salesDetails && salesDetails.length > 0 ? (
              salesDetails.map((sale) => (
                <div key={sale._id} className="details-item">
                  <div className="details-column">{sale.product}</div>
                  <div className="details-column">{sale.quantity}</div>
                  <div className="details-column">₱ {sale.price}</div>
                  <div className="details-column">{new Date(sale.date).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <p>No sales details available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
