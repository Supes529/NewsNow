// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const loginRouter = require('./src/routes/login');
const newsRouter = require('./src/routes/news'); // Import the news router
const busiRouter = require('./src/routes/business');
const sportsRouter = require('./src/routes/sports')
const entertainmentRouter = require('./src/routes/entertainment')
const scienceRouter = require('./src/routes/science')
const technologyRouter = require('./src/routes/technology')
const favRouter = require('./src/routes/favourites')
//const navigationRouter = require('./src/routes/navbar')
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;
app.use(cookieParser());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use(express.json());

// Templating Engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// Include the login router
app.use('/', loginRouter);

// Include the news router
app.use('/news', newsRouter);
app.use('/business', busiRouter);
app.use('/entertainment', entertainmentRouter);
app.use('/science', scienceRouter);
app.use('/sports', sportsRouter);
app.use('/technology', technologyRouter);
app.use('/favourites', favRouter);
//app.use('/technology', navigationRouter);

// Redirect root route to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});
//Logout route
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// Listen on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));
