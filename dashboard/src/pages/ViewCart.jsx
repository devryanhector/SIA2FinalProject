// import { useEffect, useState } from 'react';
// import { Button, Typography, Paper } from '@mui/material';

// const ViewCart = () => {
//     const [cart, setCart] = useState([]);

//     useEffect(() => {
//         const savedCart = localStorage.getItem('cart');
//         if (savedCart) {
//             setCart(JSON.parse(savedCart));
//         }
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cart));
//     }, [cart]);

//     // ✅ Simplified and accurate ID-based removal
//     const handleRemoveFromCart = (productId, name, price) => {
//         const newCart = cart.filter((item) => {
//             if (item._id && productId) return item._id !== productId;
//             if (item.id && productId) return item.id !== productId;
//             return !(item.name === name && item.price === price);
//         });
//         setCart([...newCart]);
//         localStorage.setItem('cart', JSON.stringify(newCart));
//     };

//     const getTotalPrice = () => {
//         return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//     };

//     return (
//         <Paper style={{ padding: 32, margin: '32px auto', maxWidth: 600 }}>
//             <Typography variant="h4" gutterBottom>My Cart</Typography>
//             {cart.length === 0 ? (
//                 <Typography>No items in cart.</Typography>
//             ) : (
//                 <>
//                     {cart.map((item) => (
//                         <div
//                             key={item._id || item.id || item.name}
//                             style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
//                         >
//                             <Typography style={{ flex: 1 }}>{item.name} (x{item.quantity})</Typography>
//                             <Typography style={{ marginRight: 16 }}>₱{item.price}</Typography>
//                             <Button
//                                 variant="contained"
//                                 color="error"
//                                 onClick={() => handleRemoveFromCart(item._id || item.id, item.name, item.price)}
//                             >
//                                 Remove
//                             </Button>
//                         </div>
//                     ))}
//                     <Typography variant="h6" style={{ marginTop: 24 }}>
//                         Total: ₱{getTotalPrice()}
//                     </Typography>
//                 </>
//             )}
//         </Paper>
//     );
// };

// export default ViewCart;
