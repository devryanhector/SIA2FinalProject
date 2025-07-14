import { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import '../pages/ManageProduct.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({ totalSales: 0, totalOrders: 0, bestSeller: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:3004/api/reports');
        if (res.data && res.data.length > 0) {
          const latest = res.data[res.data.length - 1];
          setAnalytics(latest);
        }
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Typography>Loading analytics...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <Link to="/ManageProduct" className="sidebar-link">
          <DashboardIcon sx={{ marginRight: '10px' }} />
          Manage Books
        </Link>
        <Link to="/ManageAccount" className="sidebar-link">
          <AccountBoxIcon sx={{ marginRight: '10px' }} />
          Manage Users
        </Link>
        <Link to="/ViewSales" className="sidebar-link">
          <DashboardIcon sx={{ marginRight: '10px' }} />
          View Sales
        </Link>
        <Link to="/" className="sidebar-link logout-link">
          <ExitToAppIcon sx={{ marginRight: '10px' }} />
          Logout
        </Link>
      </div>
      <div style={{ width: '100%' }}>
        <Paper style={{ padding: 24, margin: '24px 0' }}>
          <Typography variant="h5" gutterBottom>Data Analytics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Sales</Typography>
                  <Typography variant="h4">₱{analytics.totalSales}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">{analytics.totalOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Best Seller</Typography>
                  <Typography variant="h4">{analytics.bestSeller || 'N/A'}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default AdminAnalytics;
