require('dotenv').config()
const User = require('../models/userSchema');
const Blog = require('../models/blogSchema'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Render the login page
const gotoLogin = (req, res) => {
    res.render('user/login', { title: "Login" });
};

// Render the sign-up page
const gotoSignup = (req, res) => {
    res.render('user/signup', { title: "Sign Up" });
};

// Handle new registration
const newRegister = async (req, res) => {
    const { name, email, password } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "Profile image is required" });
    }

    console.log("Profile image:", req.file);

    // Password encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        profileImage: req.file.filename
    });

    try {
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(400).json({ error: "Failed to register user" });
    }
};

// Handle user login
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email:email});
        if (!user) {
            console.log("No user found with that email:", email);
            return res.status(401).json({ message: "Please signup first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/home');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
};


// Render the Dashboard page

const gotoHome = async (req, res) => {
    try {
        const blogs = await Blog.find({ display: true }).lean();
        res.render('user/home', { title: "Home", blogs });
    } catch (error) {
        console.error("Error loading home page:", error);
        res.status(500).json({ error: "Failed to load home page" });
    }
};

const gotoDashboard = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).lean();  

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.render('user/dashboard', { title: "Dashboard", user });
    } catch (error) {
        console.error("Error loading dashboard:", error);
        res.status(500).json({ error: "Failed to load dashboard" });
    }
};


const logout = async(req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
}

module.exports = {
    gotoLogin,
    gotoSignup,
    newRegister,
    userLogin,
    gotoHome,
    gotoDashboard,
    logout
};
