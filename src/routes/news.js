const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')
const collection = require("./config");


async function fetchNewsByCategory(category) {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=83053b6ff6a1455f8a869459fe7d9a77`);
        const articles = response.data.articles;
        // Add category to each article object
        articles.forEach(article => {
            article.category = category;
        });
        return articles;
    } catch (error) {
        console.error(`Error fetching news for ${category}:`, error.message);
        return [];
    }
}

// Function to fetch news articles from multiple categories
async function fetchNewsFromMultipleCategories(categories) {
    try {
        const newsByCategory = await Promise.all(categories.map(category => fetchNewsByCategory(category)));
        const mergedNews = [];
        const maxLength = Math.max(...newsByCategory.map(news => news.length));

        for (let i = 0; i < maxLength; i++) {
            for (const news of newsByCategory) {
                if (news[i]) {
                    mergedNews.push(news[i]);
                }
            }
        }
            //console.log(mergedNews);
        return mergedNews;
    } catch (error) {
        console.error('Error fetching news from multiple categories:', error.message);
        return [];
    }
}
newsRouter.get('', async (req, res) => {
    try {
        // Extract selected categories from query parameters
        const selectedCategories = req.query.categories ? req.query.categories.split(',') : [];
        const user = req.cookies.user||'';
        const link = req.cookies.link||'';

        let apiUrl = 'https://newsapi.org/v2/top-headlines?country=in&';

        // If no categories are selected, add 'country=in' to the API URL
        // if (selectedCategories.length === 0) {
        //     apiUrl += 'country=in&';
        // }

        // Fetch news articles from multiple categories if categories are selected
        if (selectedCategories.length > 0) {
            const mergedNews = await fetchNewsFromMultipleCategories(selectedCategories);
            res.render('news', { articles: mergedNews ,user:user,link:link});
            return;
        }

        // Append the API key to the URL
        apiUrl += 'apiKey=83053b6ff6a1455f8a869459fe7d9a77';

        // Fetch news articles using the constructed API URL
        const response = await axios.get(apiUrl);
        res.render('news', { articles: response.data.articles,user:user,link:"/news" });
        
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

newsRouter.get('/:id', async (req, res) => {
    let articleID = req.params.id

    try {
        let apiUrl = 'https://newsapi.org/v2/top-headlines?country=in&';

        // Check if categories are selected
        if (req.query.categories && req.query.categories.length > 0) {
            const selectedCategories = req.query.categories.split(',');
 // Construct the query parameter to group categories
 const queryParam = selectedCategories.join(",");

 // Append the constructed query parameter to the API URL
 apiUrl += `category=(${queryParam})`;
        }

        // Append the API key to the URL
        apiUrl += '&apiKey=83053b6ff6a1455f8a869459fe7d9a77';

        // Fetch news articles based on the constructed API URL
        const newsAPI = await axios.get(apiUrl);
        console.log(newsAPI);
        res.render('news', { articles: newsAPI.data.articles });
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


newsRouter.post('/like', async (req, res) => {
    const { user, article } = req.body;
  
    console.log(article);
    try {
      const updatedUser = await collection.findOneAndUpdate(
        { name: user },
        { $addToSet: { likedposts: JSON.parse(article) } },
        { new: true }
      );   
        const category = article.category;
        //console.log(category);
        await collection.updateOne({ name: user }, { $inc: { ['categoryCounts.' + category]: 1 } });

 
    //   await collection.updateOne({ name: user }, { $inc: { ['categoryCounts.' + category]: 1 } });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  });


// newsRouter.post('', async (req, res) => {
//     let search = req.body.search
//     try {
//         const newsAPI = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&pageSize=100&apiKey=83053b6ff6a1455f8a869459fe7d9a77`)
//         // ... code fetching articles using the search query ...

// res.render('newsSearch', { articles: newsAPI.data.articles || [] }); // Handle potential 'articles' being undefined or empty

//     } catch (err) {
//         if (err.response) {
//             res.render('newsSearch', { articles: null })
//             console.log(err.response.data)
//             console.log(err.response.status)
//             console.log(err.response.headers)
//         } else if (err.requiest) {
//             res.render('newsSearch', { articles: null })
//             console.log(err.requiest)
//         } else {
//             res.render('newsSearch', { articles: null })
//             console.error('Error', err.message)
//         }
//     }
// })

// Function to update likedposts or dislikedposts in the database

module.exports = newsRouter 
