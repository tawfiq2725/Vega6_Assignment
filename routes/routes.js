const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/userCtrl')
const upload = require('../helpers/multer')
const blogCtrl = require('../controllers/blogCtrl');
const verifyToken = require('../middleware/auth')


router.get('/',userCtrl.gotoLogin)
router.get('/sign-up',userCtrl.gotoSignup)
router.post('/new-register', upload.single('profileImage'), userCtrl.newRegister);
router.post('/user-login',userCtrl.userLogin)
router.get('/home',verifyToken,userCtrl.gotoHome)
router.get('/dashboard',verifyToken,userCtrl.gotoDashboard)
router.get('/logout',userCtrl.logout)

// Blog routes
router.get('/blogs',verifyToken, blogCtrl.getAllBlogs);
router.get('/blogs/add',verifyToken, blogCtrl.getAddBlogForm);
router.post('/blogs/add', verifyToken,upload.single('image'), blogCtrl.addBlog);
router.get('/blogs/edit/:id', verifyToken,blogCtrl.getEditBlogForm);
router.post('/blogs/edit/:id',verifyToken, upload.single('image'), blogCtrl.updateBlog);
router.get('/blogs/delete/:id',verifyToken, blogCtrl.deleteBlog);
router.get('/blogs/:id',verifyToken, blogCtrl.getBlogById);

module.exports = router