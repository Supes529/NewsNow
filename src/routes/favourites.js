// const express = require('express');
// const favRouter = express.Router();
// const axios = require('axios')
// const collection = require('./config');

// favRouter.get('', async (req, res) => {
//   try {
//     const user = req.cookies.user || '';
//     const likedposts = await collection.findOne({ name: user }).select('likedposts');
//     const link = req.cookies.link||'/news';
//     res.render('news', { articles: JSON.parse(likedposts), user:user, link:link });
//   } catch (err) {
//     if (err.response) {
//         res.render('news', { articles: null })
//         console.log(err.response.data)
//         console.log(err.response.status)
//         console.log(err.response.headers)
//     } else if (err.request) {
//         res.render('news', { articles: null })
//         console.log(err.requiest)
//     } else {
//         res.render('news', { articles: null })
//         console.error('Error', err.message)
//     }
//   }
// });

// module.exports = favRouter;
const express = require('express')
const favRouter = express.Router()
const axios = require('axios')
const collection = require('./config');

favRouter.get('', async (req, res) => {
    try {
        //const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=science&apiKey=83053b6ff6a1455f8a869459fe7d9a77`);
        const user = req.cookies.user;
        const link1 = req.cookies.link || '/news';
        console.log(link1);
        const likedposts = await collection.findOne({ name: user }).select('likedposts');
        //console.log(likedposts.likedposts);
        res.render('news', { articles:likedposts.likedposts,user:user,link:link1});
        
    } catch (error) {
        console.error(error);
    res.redirect('/');
    }
})

module.exports = favRouter