// login.js

const express = require('express');
const router = express.Router();
const collection = require("./config");
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

// Convert data into json format
app.use(express.json());

// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set("view engine", "ejs");

// Initialize session middleware
app.use(session({
    secret: 'your_secret_key', // Replace 'your_secret_key' with a random string
    resave: false,
    saveUninitialized: false
}));

// Temporary username and password for testing
const tempUsername = 'user';
const tempPassword = 'pass';

// Login Route
router.get('/', (req, res) => {
    res.render('login', { error: null ,session: req.session,user: req.query.username});
});

router.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

// Register User
router.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
        likedposts: [], // Initialize likedposts array with an empty array
        dislikedposts: [] // Initialize dislikedposts array with an empty array
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        try {
            await collection.insertMany(data);
            console.log("User registered successfully:", data);
            res.redirect('/');
        } catch (error) {
            console.error("Error inserting user data:", error);
            res.status(500).send("Error registering user. Please try again later.");
        }
    }
});

// Login user 
router.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }

        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        } else {
            req.session.user = req.body.username; // Set the session user
            res.cookie('user', req.body.username);
            
               // Access the selected categories if they exist
               let selectedCategories = req.body.category || [];
               if (!Array.isArray(selectedCategories)) {
                selectedCategories = [selectedCategories];
            }
               // Now you can use the selectedCategories array as needed
               console.log("Selected Categories:", selectedCategories);
            //res.redirect('/news');
              // Redirect to the news page with selected categories as query parameters
              
              res.cookie('link', `/news?categories=${selectedCategories.join(',')}&user=${req.body.username}`);
        res.redirect(`/news?categories=${selectedCategories.join(',')}&user=${req.body.username}`);
        }
    } catch {
        res.send("wrong Details");
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(); // Destroy the session
    res.redirect('/'); // Redirect to the login page
});


module.exports = router;
