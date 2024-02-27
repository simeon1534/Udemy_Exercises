import posts from "../data.js";
import express from "express";

const postRouter = express.Router();


postRouter.get('/:post_id', (req, res) => {
    let post_id = req.params.post_id;

    if (post_id in posts) {
        let title = posts[post_id]['title'];
        let content = posts[post_id]['content'];
        
        res.render('post.ejs',{title: title, content: content});

    } else {
        res.render('error404.ejs');
    }
    
});

postRouter.post('/:post_id', (req, res) => {
    let post_id = req.params.post_id;

    if ('edit_button' in req.body) {
        posts[post_id]['title'] = req.body['title'];
        posts[post_id]['content'] = req.body['content'];

        res.redirect(`/posts/${post_id}`);

    } else if ('delete_button' in req.body) {
        delete posts[post_id];
        res.redirect('/');
    }

    
   
    
});



export default postRouter;