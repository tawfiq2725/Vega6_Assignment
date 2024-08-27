// Environment
require('dotenv').config();
require('./config/db')

// Modules
const express = require('express');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const { engine } = require('express-handlebars');
const app = express();
const Port = process.env.APP_PORT;

// Routes
const router = require('./routes/routes')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views/layout/'),
    partialsDir: path.join(__dirname, 'views/partials/'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
   }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/',router)
// Server listen
app.listen(Port,()=>{
    console.log(`Your server is running on http://localhost:${Port}`);
})