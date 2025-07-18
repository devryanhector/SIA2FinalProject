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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import axios from 'axios';
import API from './api';
import './ManageProduct.css';

const ManageProduct = () => {
    const [products, setProducts] = useState({
        productName: '',
        productDescription: '',
        productImage: null,
        productCategory: '',
        productImageUrl: '',
        price: '',
        stock: ''
    });
    const [selectedProduct, setSelectedProduct] = useState({
        _id: '',
        productName: '',
        productDescription: '',
        productCategory: '',
        image: null,
        price: '',
        stock: ''
    });
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [values, setValues] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchMenu();
    }, []);

    // const categories = ['All', 'Books', 'Arts & Crafts', 'Coloring Supplies', 'Filling Supplies', 'Paper Supplies', 'Writing Supplies', 'School & Office Essentials'];
    const categories = ['All', 'Manga', 'Action', 'Horror'];
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredValues = selectedCategory === 'All' ? values : values.filter(product => product.category === selectedCategory);

    const handleOpenAddModal = () => {
        setModalAddOpen(true);
    };

    const handleCloseAddModal = () => {
        setModalAddOpen(false);
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct({
            _id: product?._id,
            productName: product?.name,
            productDescription: product?.description,
            productCategory: product?.category,
            image: product?.image,
            price: product?.price,
            stock: product?.stock
        });
        setModalEditOpen(true);
    };

    const handleCloseEditModal = () => {
        setModalEditOpen(false);
        setSelectedProduct({
            _id: '',
            productName: '',
            productDescription: '',
            productCategory: '',
            image: null,
            price: '',
            stock: ''
        });
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'productImage' && files && files[0]) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);

            setProducts((prev) => ({
                ...prev,
                productImage: file,
                productImageUrl: imageUrl
            }));
        } else {
            setProducts((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCancel = () => {
        setModalAddOpen(false);
        setProducts({
            productName: '',
            productDescription: '',
            productImageUrl: '',
            productImage: null,
            productCategory: '',
            price: '',
            stock: ''
        });
    };

    const handleAddProduct = async () => {
        try {
            const { name, description, productImage, productCategory, price, stock } = products;
            if (!name || !description || !productImage || !productCategory || price === '' || stock === '') {
                return alert('All fields must not be empty!');
            }
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('image', productImage);
            formData.append('category', productCategory);
            formData.append('price', price.toString());
            formData.append('stock', stock.toString());
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            await axios.post(API.ADD_PRODUCT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts({
                productName: '',
                productDescription: '',
                productImageUrl: '',
                productImage: null,
                productCategory: '',
                price: '',
                stock: '',
                name: '',
                description: ''
            });
            fetchMenu();
        } catch (error) {
            alert('Error adding product! ' + (error?.response?.data?.message || error.message || error));
        } finally {
            setModalAddOpen(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.post(API.DELETE_PRODUCT, { productId: selectedProduct._id });
            setValues((prev) => prev.filter((product) => product._id !== selectedProduct._id));
            handleCloseEditModal();
        } catch (error) {
            alert('Error deleting product!', error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProduct = async () => {
        try {
            const { _id, productName, productDescription, productCategory, price, stock } = selectedProduct;

            if (!_id || !productName || !productDescription || !productCategory) {
                return alert('Fields must not be empty!');
            }

            const data = {
                productId: _id, // MongoDB _id
                productName,
                productDescription,
                price, // send price
                stock: Number(stock), // ensure stock is a number
                category: productCategory
            };

            const response = await axios.post(API.EDIT_PRODUCT, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                handleCloseEditModal();
                fetchMenu();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product!');
        }
    };

    const fetchMenu = async () => {
        const menu = await axios.get(API.GET_ALL_PRODUCTS);
        setValues(menu?.data?.data);
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <Link to="/ManageProduct" className="sidebar-link">
                    <DashboardIcon sx={{ marginRight: '10px' }} />
                    Manage Books
                </Link>
                {localStorage.getItem('userRole') === 'admin' && (
                    <Link to="/ManageAccount" className="sidebar-link">
                        <AccountBoxIcon sx={{ marginRight: '10px' }} />
                        Manage Users
                    </Link>
                )}
                <Link to="/ViewSales" className="sidebar-link">
                    <DashboardIcon sx={{ marginRight: '10px' }} />
                    View Sales
                </Link>
                <Link to="/" className="sidebar-link logout-link">
                    <ExitToAppIcon sx={{ marginRight: '10px' }} />
                    Logout
                </Link>
            </div>

            {/* Header */}
            <div className="header">
                <h2>Manage Books</h2>
            </div>

            {/* Category Filter */}
            <div className="category-list">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'contained' : 'outlined'}
                        onClick={() => handleCategoryChange(category)}
                        sx={{ marginRight: '10px', marginBottom: '10px', minWidth: 120 }}
                        className="category-button"
                    >
                        {category}
                    </Button>
                ))}
                <Button variant="contained" onClick={handleOpenAddModal} style={{ marginLeft: 16, minWidth: 120, marginBottom: '10px' }}>Add</Button>
            </div>

            {/* Add Product Modal */}
            <Modal open={modalAddOpen} onClose={handleCloseAddModal}>
                <div className="view-modal">
                    <h1>Add</h1>
                    <div className="modal-forms">
                        <div className="image-container">
                            {products.productImageUrl ? (
                                <img src={products.productImageUrl} alt="Product" />
                            ) : (
                                <h1>No image</h1>
                            )}
                        </div>
                        <TextField
                            name="name"
                            label="Title"
                            value={products.productName}
                            onChange={e => setProducts(prev => ({ ...prev, productName: e.target.value, name: e.target.value }))}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={products.productDescription}
                            onChange={e => setProducts(prev => ({ ...prev, productDescription: e.target.value, description: e.target.value }))}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="productCategory"
                                value={products.productCategory}
                                onChange={handleOnChange}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            name="price"
                            label="Price"
                            type="number"
                            value={products.price}
                            onChange={handleOnChange}
                        />
                        <TextField
                            name="stock"
                            label="Stock"
                            type="number"
                            value={products.stock}
                            onChange={handleOnChange}
                        />
                        <input
                            name="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleOnChange}
                        />
                        <div className='btn-add'>
                            <Button variant="contained" onClick={handleAddProduct}>Add</Button>
                            <Button variant="contained" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Product Modal */}
            <Modal open={modalEditOpen} onClose={handleCloseEditModal}>
                <div className="view-modal">
                    <h1>Edit</h1>
                    {selectedProduct && (
                        <div className="modal-forms">
                            <div className="image-container">
                                {selectedProduct.image ? (
                                    <img src={`${API.UPLOADS}${selectedProduct.image}`} alt="Product" />
                                ) : (
                                    <h1>No image</h1>
                                )}
                            </div>
                            <TextField
                                name="productName"
                                label="Book Name"
                                value={selectedProduct.productName}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="productDescription"
                                label="Book Description"
                                value={selectedProduct.productDescription}
                                onChange={handleEditChange}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="productCategory"
                                    value={selectedProduct.productCategory}
                                    onChange={handleEditChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                value={selectedProduct.price}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="stock"
                                label="Stock"
                                type="number"
                                value={selectedProduct.stock}
                                onChange={handleEditChange}
                            />
                            <div className='btn-add'>
                                <Button variant="contained" onClick={handleUpdateProduct}>Save Changes</Button>
                                <Button variant="contained" onClick={handleDeleteProduct} startIcon={<DeleteIcon />}>Delete</Button>
                                <Button variant="contained" onClick={handleCloseEditModal}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Product Table */}
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table style={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: 80 }}>Image</TableCell>
                            <TableCell style={{ width: 120 }}>Title</TableCell>
                            <TableCell style={{ width: 350 }}>Description</TableCell>
                            <TableCell style={{ width: 120 }}>Category</TableCell>
                            <TableCell style={{ width: 100 }}>Price</TableCell>
                            <TableCell style={{ width: 100 }}>Stock</TableCell>
                            <TableCell style={{ width: 180 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredValues?.map((pro) => (
                            <TableRow key={pro?._id}>
                                <TableCell>
                                    <img src={`${API.UPLOADS}${pro?.image}`} alt='' style={{ width: 60, height: 60, objectFit: 'cover' }} />
                                </TableCell>
                                <TableCell>{pro?.name}</TableCell>
                                <TableCell style={{ maxWidth: 350, minWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={pro?.description}>
                                    {pro?.description && pro.description.length > 90
                                        ? pro.description.slice(0, 90) + '...'
                                        : pro?.description}
                                </TableCell>
                                <TableCell>{pro?.category}</TableCell>
                                <TableCell>{pro?.price}</TableCell>
                                <TableCell>{pro?.stock}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleOpenEditModal(pro)} style={{ marginRight: 8 }}>Edit</Button>
                                    <Button variant="outlined" color="error" onClick={() => {
                                        setSelectedProduct({
                                            _id: pro?._id,
                                            productName: pro?.name,
                                            productDescription: pro?.description,
                                            productCategory: pro?.category,
                                            image: pro?.image,
                                            price: pro?.price,
                                            stock: pro?.stock
                                        }); setModalEditOpen(true);
                                    }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Product Cards (hidden, replaced by table) */}
            {/* <div className="edit-menu-container">
                {filteredValues?.map((pro) => (
                    <div key={pro?._id} className="card-edit" onClick={() => handleOpenEditModal(pro)}>
                        <div className="image-container">
                            <img src={`http://localhost:3004/uploads/${pro?.image}`} alt='' />
                        </div>
                        <div className='label'>
                            <h3>{pro?.name}</h3>
                        </div>
                        <div className='description'>
                            <p>{pro?.description}</p>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default ManageProduct;