const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
const bodyParser = require('body-parser')
const path = require('path');
const methodOverride = require('method-override'); 
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");


// database connect
connectDB();

// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
})

// rest object
const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(methodOverride('_method'));


// route
const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes.js")
const orderRoutes = require("./routes/orderRoutes.js")

app.use('/api/v1', testRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/order', orderRoutes);



app.get('/', (req, res) => {
    return res.status(200).send('Hello World');
});

// Routes to render the EJS forms
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/update-password', (req, res) => res.render('updatePassword'));
app.get('/update-profile', (req, res) => res.render('updateProfile'));
app.get('/update-profile-pic', (req, res) => res.render('updateProfilePic'));


// port
const PORT = process.env.PORT || 3000;

// listen
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT} on ${process.env.NODE_ENV}`.bgMagenta.white);
});
