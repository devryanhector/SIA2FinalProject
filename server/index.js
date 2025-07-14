require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const os = require('os');
const app = express();

// const PORT = process.env.PORT || 3004;
const HOST = 'localhost'

const adminModel = require('./models/adminData.js');
const Products = require('./models/productModel.js');
const userRoutes = require('./routes/userRoutes');

const userModel = require('./models/userModel.js');

const salesDetailRoutes = require('./routes/salesDetailRoutes');
const reportRoutes = require('./routes/reportRoutes.js');
const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./controllers/userControllers.js')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});



const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api/salesdetails', salesDetailRoutes);
app.use('/api/reportdetails', reportRoutes);
app.use('/', productRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const ConnectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to the database!')
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

function getLocalIP() { 
    const nets = os.networkInterfaces(); 
    for (const name of Object.keys(nets)) { 
    for (const net of nets [name]) {
         if (net.family === "IPv4" && !net.internal) { 
            return net.address;
         } 
        } 
    } 
     return "localhost";
     } 
     // Start server 
const PORT = process.env.PORT || 3004; 
const IP = getLocalIP(); 

// Export for use in controllers 
module.exports.SERVER_PORT - PORT; 
module.exports.SERVER_IP - IP; 

app.listen(PORT, '0.0.0.0', () => {
     console.log(' Server running at:'); 
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://${IP}:${PORT}`);
});

ConnectToDatabase()




app.post('/adduser', upload.single('image'), async (req, res) => {
    try {
        const values = req.body

        await adminModel.create(values)
        res.json({ success: true, message: 'User added successfully!' })
    } catch (error) {
        res.json({ success: false, message: `Error adding user controller: ${error}` })
    }
});

app.post('/addproduct', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, price, stock } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !description || !category || !price || !stock || !image) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const productId = Math.floor(Math.random() * 100000).toString();
        const newProduct = new Products({
            productId,
            name,
            description,
            price,
            category,
            image,
            stock
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, message: 'Product added!', data: savedProduct });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.get('/getallproducts', async (req, res) => {
    try {
        const data = await Products.find()

        res.json({ success: true, message: 'All products fetched successfully!', data: data })
    } catch (error) {
        res.json({ success: false, message: `Error fetching products: ${error}` })
    }
})

app.post('/deleteproduct', async (req, res) => {
    try {
        const { productId } = req.body;

        const data = await Products.findByIdAndDelete(productId);
        if (data) {
            res.json({ success: true, message: 'Product deleted successfully!' });
        } else {
            res.json({ success: false, message: 'Failed to delete product!' });
        }
    } catch (error) {
        res.json({ success: false, message: `Error deleting product: ${error}` })
    }
})

app.post('/editproduct', async (req, res) => {
    try {
        // Accept both old and new field names for compatibility
        const {
            productId,
            productName,
            productDescription,
            productPrice,
            category,
            productStock,
            price,
            stock
        } = req.body;

        // Use new values if provided, else fallback to old
        const updateFields = {
            ...(productName && { name: productName }),
            ...(productDescription && { description: productDescription }),
            ...(category && { category }),
            // Accept either productPrice or price
            ...(productPrice !== undefined ? { price: productPrice } : {}),
            ...(price !== undefined ? { price } : {}),
            // Accept either productStock or stock
            ...(productStock !== undefined ? { stock: productStock } : {}),
            ...(stock !== undefined ? { stock } : {})
        };

        const updatedProduct = await Products.findByIdAndUpdate(productId, updateFields, { new: true });

        if (updatedProduct) {
            res.json({ success: true, message: 'Product updated successfully!', data: updatedProduct });
        } else {
            res.json({ success: false, message: 'Failed to update product!' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/edituser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, userRole } = req.body;

        console.log('Received data for updating user:', userId, username, email, userRole);

        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            username,
            email,
            userRole
        }, { new: true });

        if (updatedUser) {
            res.json({ success: true, message: 'User updated successfully!', data: updatedUser });
        } else {
            res.json({ success: false, message: 'Failed to update user!' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/editproductstock', async (req, res) => {
    try {
        const { productId, productStock } = req.body;

        console.log('Received data for updating product stock:', productId, productStock);

        const updatedProduct = await Products.findByIdAndUpdate(productId, {
            stock: productStock
        }, { new: true });

        if (updatedProduct) {
            res.json({ success: true, message: 'Product stock updated successfully!', data: updatedProduct });
        } else {
            res.json({ success: false, message: 'Failed to update product stock!' });
        }
    } catch (error) {
        console.error('Error updating product stock:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

