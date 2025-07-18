import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Products';
import Login from './pages/Login';
import ManageProduct from './pages/ManageProduct';
import Register from './pages/Register';
import ManageAccount from './pages/ManageAccount';
import Inventory from './pages/InventoryDashboard';
import Report from './pages/Report';
import SaleList from './pages/SaleList';
import InventoryReport from './pages/InventoryReport';
import ShoppingList from './pages/ShoppingList';
import BackupAndRestore from './pages/BackupAndRestore';
import ProtectedRoute from './components/ProtectedRoute';
import Receipt from './pages/Receipt';
import ViewSales from './pages/ViewSales';
import ProductView from './pages/ProductView';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import './App.css';
import Billing from './pages/Billing';
// import PublicProductList from './pages/publicproductlist';

function App() {
  // Get userRole from localStorage
  const userRole = localStorage.getItem('userRole');
  const user = {
    name: 'John Doe',
    role: userRole || 'buyer',
  };

  // Cart state (shared)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} cart={cart} setCart={setCart} />} />
        <Route path="/Products" element={<Menu />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ManageProduct" element={
          <ProtectedRoute allowedRoles={['admin', 'seller']}>
            <ManageProduct />
          </ProtectedRoute>
        } />
        <Route path="/ManageAccount" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageAccount />
          </ProtectedRoute>
        } />
        <Route path="/InventoryDashboard" element={<Inventory />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/SaleList" element={<SaleList />} />
        <Route path="/InventoryReport" element={<InventoryReport />} />
        <Route path="/ShoppingList" element={<ShoppingList />} />
        <Route path="/BackupAndRestore" element={<BackupAndRestore />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/dashboard" element={<Dashboard user={user} cart={cart} setCart={setCart} />} />
        <Route path="/ViewSales" element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <ViewSales />
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/billing" element={<Billing cart={cart} setCart={setCart} />} />
        {/* <Route path="/public-products" element={<PublicProductList />} />
        <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
      {/* Pass cart to Navbar globally if needed */}
      {/* <Navbar cart={cart} setCart={setCart} /> */}
    </BrowserRouter>
  );
}

export default App;
