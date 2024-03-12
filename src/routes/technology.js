const express = require('express')
const technologyRouter = express.Router()
const axios = require('axios')

technologyRouter.get('', async (req, res) => {
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=technology&apiKey=83053b6ff6a1455f8a869459fe7d9a77`);
        const user = req.cookies.user;
        const link = req.cookies.link||'';
        res.render('news', { articles: newsAPI.data.articles,user:user,link:link });
        
    } catch (err) {
        if (err.response) {
            res.render('news', { articles: null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if (err.request) {
            res.render('news', { articles: null })
            console.log(err.requiest)
        } else {
            res.render('news', { articles: null })
            console.error('Error', err.message)
        }
    }
})
technologyRouter.get('/:id', async (req, res) => {
    let articleID = req.params.id

    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=technology&apiKey=83053b6ff6a1455f8a869459fe7d9a77`)
        res.render('newsSingle', { article: newsAPI.data })
    } catch (err) {
        if (err.response) {
            res.render('newsSingle', { article: null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if (err.requiest) {
            res.render('newsSingle', { article: null })
            console.log(err.requiest)
        } else {
            res.render('newsSingle', { article: null })
            console.error('Error', err.message)
        }
    }
})
module.exports = technologyRouter