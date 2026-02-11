"use strict";
const { Router } = require("express");
const app = Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const imageDatabase = new Map();
const blogDatabase = new Map();

module.exports = () => {
    app.get("/blogs", (req, res) => {
        const blogs = Array.from(blogDatabase.values());
        res.render("html/blog/blogs.html", { token: req.cookies.token, blogs: blogs });
    });
    app.get("/makeblog", (req, res) => {
        res.render("html/blog/makeBlog.html", { token: req.cookies.token });
    });
    app.get("/blog/:id", (req, res) => {
        const blog = blogDatabase.get(req.params.id);
        if (!blog) return res.status(404).send("Nie znaleziono posta");

        res.render("html/blog/blog.html", { 
            token: req.cookies.token, 
            blog: blog
        });
    });

    app.post('/makeblog/upload', upload.single('upload'), (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'Błąd pliku' });

        const imageId = 'img-' + Date.now();

        imageDatabase.set(imageId, {
            data: req.file.buffer,
            mimetype: req.file.mimetype
        });

        res.json({ url: `/blog/image/${imageId}` });
    });

    app.get('/blog/image/:id', (req, res) => {
        const image = imageDatabase.get(req.params.id);
        
        if (image) {
            res.set('Content-Type', image.mimetype);
            res.send(image.data);
        } else {
            res.status(404).send('Nie znaleziono');
        }
    });

    app.post('/blog/save', (req, res) => {
        const { title, description, content } = req.body;
        const blogId = 'blog-' + Date.now();

        const image = Array.from(imageDatabase.keys());

        const newBlog = {
            id: blogId,
            title,
            image: `/blog/image/${image[0]}`,
            description: description || title.substring(0, 50) + "...",
            content,
            author: "Patryk",
            createdAt: new Date().toISOString().split('T')[0]
        };

        blogDatabase.set(blogId, newBlog);

        console.log(newBlog);
        console.log(`Zapisano blog: ${blogId}`);
        res.status(200).json({ id: blogId });
    });

    return app;
}