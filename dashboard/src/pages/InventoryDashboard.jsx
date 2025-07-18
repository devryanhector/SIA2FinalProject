import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Modal,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReportIcon from '@mui/icons-material/Report';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import axios from 'axios';
import API from './api';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
    const categories = [
        'All',
        'Books',
        'Arts & Crafts',
        'Coloring Supplies',
        'Filling Supplies',
        'Paper Supplies',
        'Writing Supplies',
        'School & Office Essentials'
    ];

    const [products, setProducts] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        productImage: null,
        productImageUrl: '',
        productCategory: '',
        productStock: ''
    });
    const [selectedProduct, setSelectedProduct] = useState({});
    const [values, setValues] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        setIsLoggedIn(false);
    };

    const filteredValues = selectedCategory === 'All' ? values : values.filter((p) => p.category === selectedCategory);

    useEffect(() => { fetchMenu(); }, []);
    const fetchMenu = async () => {
        try {
            const response = await axios.get(API.GET_ALL_PRODUCTS);
            setValues(response?.data?.data || []);
        } catch (err) { console.error('Error fetching menu:', err); }
    };

    const handleCategoryChange = (category) => setSelectedCategory(category);
    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'productImage' && files?.[0]) {
            const file = files[0];
            setProducts((prev) => ({ ...prev, productImage: file, productImageUrl: URL.createObjectURL(file) }));
        } else {
            setProducts((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleCancel = () => { setModalAddOpen(false); setProducts({ productName: '', productPrice: '', productDescription: '', productImage: null, productImageUrl: '', productCategory: '', productStock: '' }); };
    const handleAddProduct = async () => {
        const { productName, productPrice, productDescription, productImage, productCategory, productStock } = products;
        if (!productName || !productPrice || !productDescription || !productImage || !productCategory || !productStock) return alert('All fields are required!');
        try {
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('productPrice', productPrice);
            formData.append('productDescription', productDescription);
            formData.append('image', productImage);
            formData.append('category', productCategory);
            formData.append('productStock', productStock);
            await axios.post(API.ADD_PRODUCT, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            fetchMenu(); handleCancel();
        } catch (error) { alert('Error adding product!'); console.error(error); }
    };
    const handleOpenEditModal = (product) => { setSelectedProduct({ ...product, productName: product.name, productDescription: product.description, productPrice: product.price, productCategory: product.category, productStock: product.stock }); setModalEditOpen(true); };
    const handleCloseEditModal = () => { setModalEditOpen(false); setSelectedProduct({}); };
    const handleEditChange = (e) => { const { name, value } = e.target; setSelectedProduct((prev) => ({ ...prev, [name]: value })); };
    const handleUpdateProduct = async () => {
        const { _id, productName, productDescription, productPrice, productCategory, productStock } = selectedProduct;
        if (!_id || !productName || !productDescription || !productPrice || !productCategory || !productStock) return alert('All fields are required!');
        try {
            const payload = { productId: _id, productName, productPrice, productDescription, category: productCategory, productStock };
            const res = await axios.post(API.EDIT_PRODUCT, payload);
            if (res.data.success) { fetchMenu(); handleCloseEditModal(); } else { alert(res.data.message); }
        } catch (error) { alert('Error updating product!'); console.error(error); }
    };
    const handleDeleteProduct = async () => {
        try {
            await axios.post(API.DELETE_PRODUCT, { productId: selectedProduct._id });
            fetchMenu(); handleCloseEditModal();
        } catch (error) { alert('Error deleting product!'); console.error(error); }
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar: only show if logged in */}
            {isLoggedIn && (
                <div className="sidebar">
                    <Link to="/InventoryDashboard" className="sidebar-link">
                        <StorefrontIcon sx={{ marginRight: '10px' }} />
                        Manage Products
                    </Link>
                    <Link to="/Products" className="sidebar-link">
                        <StorefrontIcon sx={{ marginRight: '10px' }} />
                        Shop
                    </Link>
                    <Link to="/InventoryReport" className="sidebar-link">
                        <ReportIcon sx={{ marginRight: '10px' }} />
                        Reports
                    </Link>
                    <div className="spacer"></div>
                    <a href="#" className="sidebar-link logout-link" onClick={handleLogout}>
                        <ExitToAppIcon sx={{ marginRight: '10px' }} />
                        Logout
                    </a>
                </div>
            )}
            {/* Category Filter: only show if logged in */}
            {isLoggedIn && (
                <div className="category-list">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'contained' : 'outlined'}
                            onClick={() => handleCategoryChange(category)}
                            sx={{ marginRight: '10px', marginBottom: '10px' }}
                        >
                            {category}
                        </Button>
                    ))}
                    <Button variant="contained" color="primary" onClick={() => setModalAddOpen(true)}>
                        + Add Product
                    </Button>
                </div>
            )}
            {/* Add Product Modal */}
            {isLoggedIn && (
                <Modal open={modalAddOpen} onClose={handleCancel}>
                    <div className="view-modal">
                        <h1>Add Product</h1>
                        <div className="modal-forms">
                            <div className="image-container">
                                {products.productImageUrl ? (
                                    <img src={products.productImageUrl} alt="Preview" />
                                ) : (
                                    <h3>No Image</h3>
                                )}
                            </div>
                            <TextField label="Product Name" name="productName" value={products.productName} onChange={handleOnChange} />
                            <TextField label="Description" name="productDescription" value={products.productDescription} onChange={handleOnChange} />
                            <TextField label="Price" name="productPrice" type="number" value={products.productPrice} onChange={handleOnChange} />
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select name="productCategory" value={products.productCategory} onChange={handleOnChange}>
                                    {categories.slice(1).map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField label="Stock" name="productStock" type="number" value={products.productStock} onChange={handleOnChange} />
                            <input type="file" name="productImage" accept="image/*" onChange={handleOnChange} />
                            <div className="btn-add">
                                <Button onClick={handleAddProduct} variant="contained">Add</Button>
                                <Button onClick={handleCancel} variant="outlined">Cancel</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {/* Edit Product Modal */}
            {isLoggedIn && (
                <Modal open={modalEditOpen} onClose={handleCloseEditModal}>
                    <div className="view-modal">
                        <h1>Edit Product</h1>
                        <div className="modal-forms">
                            <div className="image-container">
                                {selectedProduct.image ? (
                                    <img src={`${API.UPLOADS}${selectedProduct.image}`} alt="Product" />
                                ) : (
                                    <h3>No Image</h3>
                                )}
                            </div>
                            <TextField name="productName" label="Product Name" value={selectedProduct.productName || ''} onChange={handleEditChange} />
                            <TextField name="productDescription" label="Description" value={selectedProduct.productDescription || ''} onChange={handleEditChange} />
                            <TextField name="productPrice" label="Price" type="number" value={selectedProduct.productPrice || ''} onChange={handleEditChange} />
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select name="productCategory" value={selectedProduct.productCategory || ''} onChange={handleEditChange}>
                                    {categories.slice(1).map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField name="productStock" label="Stock" type="number" value={selectedProduct.productStock || ''} onChange={handleEditChange} />
                            <div className="btn-add">
                                <Button onClick={handleUpdateProduct} variant="contained">Save Changes</Button>
                                <Button onClick={handleDeleteProduct} color="error" variant="contained" startIcon={<DeleteIcon />}>Delete</Button>
                                <Button onClick={handleCloseEditModal} variant="outlined">Cancel</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {/* Products List: only show if logged in */}
            {isLoggedIn && (
                <div className="edit-menu-container">
                    {filteredValues.map((pro) => (
                        <div key={pro._id} className="card-edit" onClick={() => handleOpenEditModal(pro)}>
                            <div className="image-container">
                                <img src={`${API.UPLOADS}${pro.image}`} alt={pro.name} />
                            </div>
                            <div className="label">
                                <h3>{pro.name}</h3>
                                <h3>₱ {pro.price}</h3>
                            </div>
                            <div className="description">
                                <h3>Stock: {pro.stock}</h3>
                                <p>{pro.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* If not logged in, show login prompt */}
            {!isLoggedIn && (
                <div style={{ margin: 'auto', textAlign: 'center', padding: '80px 0', color: '#7B1E3D', fontWeight: 600, fontSize: 28 }}>
                    Please log in to access the inventory dashboard.
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
