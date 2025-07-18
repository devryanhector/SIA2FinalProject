import { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from './api';

const ViewSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalesAndProducts = async () => {
            try {
                const [salesRes, productsRes] = await Promise.all([
                    axios.get(API.SALES_DETAIL),
                    axios.get(API.GET_ALL_PRODUCTS)
                ]);
                setSales(salesRes.data);
                setProducts(productsRes.data.data || []);
            } catch (err) {
                setError('Failed to fetch sales or product data');
            } finally {
                setLoading(false);
            }
        };
        fetchSalesAndProducts();
    }, []);

    // Helper to get stock for a productId
    const getStock = (productId) => {
        const prod = products.find(p => p._id === productId);
        return prod ? prod.stock : 'N/A';
    };

    // Delete sale handler
    const handleDeleteSale = async (saleId) => {
        if (!window.confirm('Are you sure you want to delete this sale record?')) return;
        try {
            await axios.delete(`${API.SALES_DETAIL}/${saleId}`);
            setSales(prev => prev.filter(s => s._id !== saleId));
        } catch (err) {
            alert('Failed to delete sale record.');
        }
    };

    return (
        <Paper style={{ padding: 32, margin: '32px auto', maxWidth: 1100 }}>
            <Typography variant="h4" gutterBottom>Sales Records</Typography>
            <Button variant="outlined" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</Button>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Buyer</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No sales found.</TableCell>
                                </TableRow>
                            ) : (
                                sales.map((sale, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{sale.buyer || 'N/A'}</TableCell>
                                        <TableCell>{sale.product}</TableCell>
                                        <TableCell>{sale.quantity}</TableCell>
                                        <TableCell>{getStock(sale.productId)}</TableCell>
                                        <TableCell>₱{sale.price}</TableCell>
                                        <TableCell>{sale.date ? new Date(sale.date).toLocaleString() : ''}</TableCell>
                                        <TableCell>
                                            <Button color="error" variant="contained" size="small" onClick={() => handleDeleteSale(sale._id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default ViewSales;
