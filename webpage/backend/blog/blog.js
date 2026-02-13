"use strict";
const { Router } = require("express");
const app = Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
 });

module.exports = (conn, r) => {
    app.get("/blogs", async (req, res) => {
        try {
            const blogs = await r.table("Data").filter({ type: "blog" }).run(conn);
            const blogsArray = await blogs.toArray();
            res.render("html/blog/blogs.html", { token: req.cookies.token, blogs: blogsArray });
        } catch (err) {
            res.status(500).send("Błąd bazy danych");
        }
    });

    app.get("/makeblog", (req, res) => {
        res.render("html/blog/makeBlog.html", { token: req.cookies.token });
    });

    app.get("/blog/:id", async (req, res) => {
        try {
            const blog = await r.table("Data").get(req.params.id).run(conn);
            if (!blog || blog.type !== "blog") return res.status(404).send("Nie znaleziono posta");

            res.render("html/blog/blog.html", { 
                token: req.cookies.token, 
                blog: blog
            });
        } catch (err) {
            res.status(500).send("Błąd bazy danych");
        }
    });

    app.post('/makeblog/upload/:blogId', upload.single('upload'), async (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'Błąd pliku' });

        try {
            const imageData = {
                type: "image",
                blogId: req.params.blogId,
                data: req.file.buffer,
                mimetype: req.file.mimetype,
                createdAt: r.now()
            };

            const result = await r.table("Data").insert(imageData).run(conn);
            const imageId = result.generated_keys[0];

            req.file.buffer = null; 
            
            res.json({ url: `/blog/image/${imageId}` });
        } catch (err) {
            res.status(500).json({ error: "Błąd zapisu obrazu" });
        }
    });

    app.get('/blog/image/:id', async (req, res) => {
        try {
            const image = await r.table("Data").get(req.params.id).run(conn);
            
            if (image && image.type === "image") {
                res.set('Content-Type', image.mimetype);
                res.send(image.data);
            } else {
                res.status(404).send('Nie znaleziono');
            }
        } catch (err) {
            res.status(500).send("Błąd serwera");
        }
    });

    app.post('/blog/save', upload.single('thumbnail'), async (req, res) => {
        const { title, description, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Tytuł i treść są wymagane.' });
        }

        try {
            let thumbnailUrl = '/images/default-blog.png';

            if (req.file) {
                const thumbResult = await r.table("Data").insert({
                    type: "image",
                    blogId: req.body.blogId,
                    data: req.file.buffer,
                    mimetype: req.file.mimetype,
                    createdAt: r.now()
                }).run(conn);
                
                thumbnailUrl = `/blog/image/${thumbResult.generated_keys[0]}`;
                req.file.buffer = null;
            }

            const userCursor = await r.table("Users").getAll(req.cookies.token, { index: "token" }).run(conn);
            const user = await userCursor.toArray();

            if (!user.length) return res.status(401).json({ error: "Nieautoryzowany" });

            const newBlog = {
                type: "blog",
                title,
                image: thumbnailUrl,
                blogId: req.body.blogId,
                description: description || (title.substring(0, 50) + "..."),
                content,
                author: user[0].username,
                createdAt: new Date().toISOString().split('T')[0]
            };

            const result = await r.table("Data").insert(newBlog).run(conn);
            const blogId = result.generated_keys[0];

            console.log(`Zapisano blog w RethinkDB: ${blogId}`);
            res.status(200).json({ id: blogId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Błąd zapisu posta" });
        }
    });

    app.get('/blog/delete/:id', async (req, res) => {
        const user = await r.table("Users").getAll(req.cookies.token, { index: "token" }).coerceTo("array").run(conn);
        console.log(user);
        const status = await r.table("Data").getAll(req.params.id, { index: "blogId" }).filter({ type: "blog" }).coerceTo('array').run(conn);
        console.log(status);
        if (!status.length) return res.json({ error: "Nie znaleziono bloga" });
        if (status[0].author !== user[0].username) return res.json({ error: "Nie masz uprawnień do usunięcia tego bloga" });
        await r.table("Data").getAll(req.params.id, { index: "blogId" }).delete().run(conn);

        res.json({ status: "Usunięto blog" });
    });

    return app;
}