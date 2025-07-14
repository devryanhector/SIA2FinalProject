import React from 'react';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
import {
    Button,
    // TextField,
    // RadioGroup,
    // FormControlLabel,
    // Radio,
    Modal,
    Backdrop,
    Fade,
    Paper,
    Typography                                          
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Billing.css';
import axios from 'axios';

const Billing = ({
    cart,
    setCart,
    // transactionMode,
    // // billingDetails,
    // handleTransactionModeChange,
    // handleBillingChange
}) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const navigate = useNavigate();

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    // Add/Minus quantity handlers
    const handleQuantityChange = (index, delta) => {
        setCart(prevCart => {
            return prevCart.map((item, i) => {
                if (i === index) {
                    let newQty = item.quantity + delta;
                    if (newQty < 1) newQty = 1;
                    if (newQty > item.stock) newQty = item.stock;
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    // Bank logic commented out for Ctrl + / toggle
    /*
    const handleBillingSubmit = async () => {
        try {
            // Send payment request to your classmate's bank API
            const bankResponse = await axios.post('https://your-classmate-bank-api.com/pay', {
                accountNumber: billingDetails.debitAccount,
                amount: getTotalPrice(),
                // ...other required fields
            });
            if (bankResponse.data.success) {
                // Proceed with your order logic
            } else {
                alert('Bank payment failed: ' + bankResponse.data.message);
            }
        } catch (error) {
            alert('Error connecting to bank: ' + error.message);
        }
    };
    */
    // Placeholder submit handler
    const handleBillingSubmit = async () => {
        try {
            const buyer = localStorage.getItem('username') || 'N/A';
            for (const product of cart) {
                // Save sales detail with buyer and productId
                await axios.post('http://localhost:3004/api/salesdetails', {
                    product: product.name,
                    productId: product._id,
                    quantity: product.quantity,
                    price: product.price,
                    date: new Date(),
                    buyer
                });
                const updatedStock = product.stock - product.quantity;
                await axios.post('http://localhost:3004/editproductstock', {
                    productId: product._id,
                    productStock: updatedStock
                });
            }
            navigate('/receipt', {
                replace: true,
                state: { 
                    cart,
                    total: getTotalPrice()
                }
            });
        } catch (error) {
            alert('Error updating stock: ' + error.message);
        }
    };

    return (
        <div className="billing-container">
            <h2>Billing</h2>
            {/*
            <RadioGroup value={transactionMode} onChange={handleTransactionModeChange} row>
                <FormControlLabel value="Union Bank" control={<Radio />} label="Union Bank" />
            </RadioGroup>
            */}
            {/*
            {transactionMode === 'Union Bank' && (
                <TextField
                    name="debitAccount"
                    label="Bank Account Number"
                    value={billingDetails?.debitAccount}
                    onChange={handleBillingChange}
                />
            )}
            */}

            {/* Cart items with add/minus buttons */}
            <div style={{ margin: '20px 0' }}>
                {cart.map((item, idx) => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <Typography style={{ flex: 1 }}>{item.name}</Typography>
                        <Button onClick={() => handleQuantityChange(idx, -1)} variant="outlined" size="small" style={{ minWidth: 32, marginRight: 4 }}>-</Button>
                        <Typography style={{ width: 32, textAlign: 'center' }}>{item.quantity}</Typography>
                        <Button onClick={() => handleQuantityChange(idx, 1)} variant="outlined" size="small" style={{ minWidth: 32, marginLeft: 4 }}>+</Button>
                        <Typography style={{ marginLeft: 12, color: '#b8860b' }}> Stock: {item.stock}</Typography>
                    </div>
                ))}
            </div>

            <h3>Total: ₱ {getTotalPrice()}</h3>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Button variant="contained" onClick={handleBillingSubmit}>
                    Submit Payment
                </Button>
                <Button variant="outlined" style={{ background: '#fff', color: '#b8860b', border: '1.5px solid #b8860b' }} onClick={() => navigate('/dashboard')}>
                    Cancel
                </Button>
            </div>

            {/* Just to use Modal, Backdrop, Fade, Typography, Paper */}
            <Button onClick={handleOpen} style={{ marginTop: '1rem' }}>Open Info</Button>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={modalOpen}>
                    <Paper className="modal-paper" sx={{ padding: 3, margin: 'auto', maxWidth: 400, mt: 10 }}>
                        <Typography variant="h6">Billing Notice</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Please ensure all details are accurate before submitting.
                        </Typography>
                        <Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">Close</Button>
                    </Paper>
                </Fade>
            </Modal>
        </div>
    );
};

Billing.propTypes = {
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            quantity: PropTypes.number.isRequired,
            stock: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            _id: PropTypes.string.isRequired
        })
    ).isRequired,
    setCart: PropTypes.func.isRequired,
    // transactionMode: PropTypes.string.isRequired,
    // billingDetails: PropTypes.shape({
    //     debitAccount: PropTypes.string
    // }),
    // handleTransactionModeChange: PropTypes.func.isRequired,
    // handleBillingChange: PropTypes.func.isRequired
};

export default Billing;
