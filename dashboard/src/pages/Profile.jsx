import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import API from './api';

function Profile() {
  const [user, setUser] = useState({ username: '', email: '' });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch user info from backend using token
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(API.GET_USER('me'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile.jsx user response:', res.data); // Debug log
        setUser({ username: res.data.username || res.data.email || 'Unknown', email: res.data.email });
      } catch (err) {
        setUser({ username: '', email: '' });
        console.error('Profile.jsx fetchUser error:', err);
      }
    };
    fetchUser();
    // Fetch purchase history from backend (replace endpoint as needed)
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API.SALES_DETAIL + '/user/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data.history || []);
      } catch (err) {
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="primary.main">
          Profile
        </Typography>
        <Typography variant="h6">
          Username: {user.username}
        </Typography>
        {user.email && <Typography variant="body1">Email: {user.email}</Typography>}
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2} color="primary.main">
          Purchase History
        </Typography>
        {history.length === 0 ? (
          <Typography color="text.secondary">No purchases yet.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Product</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Price</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Quantity</th>
                  <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.product}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>₱{item.price}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{new Date(item.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Profile;
