const Blog = require('../models/blogSchema');

// Display all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().lean();
        res.render('blogs/list', { title: "All Blogs", blogs });
    } catch (error) {
        console.error("Error retrieving blogs:", error);
        res.status(500).json({ error: "Failed to retrieve blogs" });
    }
};

// Render the form to create a new blog
const getAddBlogForm = (req, res) => {
    res.render('blogs/addBlogForm', { title: "Add New Blog" });
};

// Handle the creation of a new blog
const addBlog = async (req, res) => {
    const { title, description, display } = req.body;

    const newBlog = new Blog({
        title,
        description,
        display: display === 'on', // Checkbox value
        image: req.file ? req.file.filename : null,
    });

    try {
        await newBlog.save();
        res.redirect('/blogs');
    } catch (error) {
        console.error("Error adding blog:", error);
        res.status(400).json({ error: "Failed to add blog" });
    }
};

// Render the form to edit an existing blog
const getEditBlogForm = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean();
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.render('blogs/editBlogForm', { title: "Edit Blog", blog });
    } catch (error) {
        console.error("Error retrieving blog:", error);
        res.status(500).json({ error: "Failed to retrieve blog for editing" });
    }
};

// Handle updating an existing blog
const updateBlog = async (req, res) => {
    const { title, description, display } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        blog.title = title;
        blog.description = description;
        blog.display = display === 'on'; // Checkbox value
        if (req.file) {
            blog.image = req.file.filename;
        }

        await blog.save();
        res.redirect('/blogs');
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(400).json({ error: "Failed to update blog" });
    }
};

// Handle deleting a blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.redirect('/blogs');
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Failed to delete blog" });
    }
};

// Handle displaying a single blog's full content
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean();
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.render('blogs/blogDetail', { title: blog.title, blog });
    } catch (error) {
        console.error("Error retrieving blog:", error);
        res.status(500).json({ error: "Failed to retrieve blog" });
    }
};

module.exports = {
    getAllBlogs,
    getAddBlogForm,
    addBlog,
    getEditBlogForm,
    updateBlog,
    deleteBlog,
    getBlogById
};
