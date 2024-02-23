import express from "express";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;


// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/') // Uploads will be stored in the 'public/uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Appending extension to filename
    }
});

const upload = multer({ storage: storage });

// In-memory array to store posts
let posts = [];

// Render the home page with posts
app.get('/', (req, res) => {
    res.render('index.ejs', { posts: posts });
});

app.get('/about', (req, res) => {
    res.render('aboutme.ejs', { posts: posts });
});

app.get('/travel', (req, res) => {
    res.render('travel.ejs', { posts: posts });
});

app.get('/eat', (req, res) => {
    res.render('eat.ejs', { posts: posts });
});

app.get('/relax', (req, res) => {
    res.render('relax.ejs', { posts: posts });
});

// Create a new post
app.post('/post', upload.single('image'), (req, res) => {
    const { title, username, content } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '/default-image.jpg'; // Default image if no image uploaded
    const newPost = { title, username, content, image: imagePath };
    posts.push(newPost);
    res.redirect('/');
});

// Delete a post
app.post('/delete', (req, res) => {
    const index = req.body.index;
    posts.splice(index, 1);
    res.redirect('/');
});

// Update a post
app.post('/update', (req, res) => {
    const { index, title, content } = req.body;
    posts[index].title = title;
    posts[index].content = content;
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
