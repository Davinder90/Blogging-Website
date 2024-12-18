import express from "express";
import jwt from "jsonwebtoken";
import User from "../Database-Setup/userSchema.js";
import Blog from "../Database-Setup/blogSchema.js";
import { nanoid } from "nanoid";
import Notification from "../Database-Setup/notificationSchema.js";
const router = express.Router();

const verifyJWT = (req, resp, next) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return resp.status(403).json({ "error": "No Access token" });
    }
    else {
        try {
            let data = jwt.verify(token, "secret_ecom");
            req.user = data;
            next();
        }
        catch (err) {
            return resp.status(403).json({ "error": "Access token is invalid" });
        }
    }
}

router.post("/create-blog", verifyJWT, (req, resp) => {

    let author_id = req.user.id;

    let { title, des, banner, tags, content, draft, id } = req.body;

    if (title.length == 0) {
        return resp.status(403).json({ "error": "You must provide a title" });
    }

    let dp = draft == true ? "draft" : "publish";

    if (!draft) {
        if (des.length == 0 || des.length > 200) {
            return resp.status(403).json({ "error": "You must provide a description under 200 characters" });
        }

        if (banner.length == 0) {
            return resp.status(403).json({ "error": `You must provide a blog banner to ${dp} it` });
        }

        if (content.blocks.length == 0) {
            return resp.status(403).json({ "error": `There must be a blog content to ${dp} it` });
        }

        if (tags.length == 0 || tags.length > 10) {
            return resp.status(403).json({ "error": "Provide tags in order to publish the blog, Maximum 10" });
        }
    }
    tags = tags.map((tag) => tag.toLowerCase());

    let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, "-").trim()
    if (!id) {
        blog_id += nanoid();
    }

    if (id) {
        Blog.findOneAndUpdate({ blog_id }, { title, des, content, tags, banner, draft: Boolean(draft) })
            .select("title des content banner tags activity publishedAt ")
            .then((blog) => {
                return resp.status(200).json({ id: blog_id });
            })
            .catch((err) => {
                return resp.status(500).json({ error: err.message });
            })
    }
    else {
        let blog = new Blog({ title, des, content, tags, banner, blog_id, author: author_id, draft: Boolean(draft) });

        blog.save().then(async (blog) => {
            let incrementVal = draft ? 0 : 1;
            await User.findByIdAndUpdate({ _id: author_id }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } })
                .then((user) => {
                    return resp.status(200).json({ id: blog.blog_id })
                })
                .catch(err => {
                    return resp.status(500).json({ "error": "Failed to update total number of posts" });
                })
        })
            .catch(err => {
                return resp.status(500).json({ "error": err.message });
            })
    }
});

router.post("/latest-blogs", async (req, resp) => {

    let { page } = req.body;
    let maxLength = 5;

    await Blog.find({ draft: false })
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des tags activity banner publishedAt -_id")
        .skip((page - 1) * maxLength)
        .limit(maxLength)
        .then(blogs => {
            return resp.status(200).json({ blogs });
        })
        .catch(err => {
            return resp.status(500).json({ "error": err.message });
        });
})

router.get("/trending-blogs", async (req, resp) => {
    let maxLength = 5;

    await Blog.find({ draft: false })
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(maxLength)
        .then(blogs => {
            return resp.status(200).json({ blogs });
        })
        .catch(err => {
            return resp.status(500).json({ "error": err.message });
        });
})

router.post("/all-latest-count-blogs", (req, resp) => {
    Blog.countDocuments({ draft: false })
        .then(count => {
            return resp.status(200).json({ total_docs: count });
        })
        .catch(err => {
            return resp.status(500).json({ error: err.message });
        });
})

router.post("/search-blogs", async (req, resp) => {
    let { tags, page, eliminated_blog } = req.body;
    let findQuery = { tags: { $in: tags }, "draft": false, blog_id: { $ne: eliminated_blog } };
    let maxLength = 5;

    await Blog.find(findQuery)
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des tags activity banner publishedAt -_id")
        .skip((page - 1) * maxLength)
        .limit(maxLength)
        .then(blogs => {
            return resp.status(200).json({ blogs });
        })
        .catch(err => {
            console.log(err);
            return resp.status(500).json({ "error": err.message });
        });
})

router.post("/search-count-blogs", (req, resp) => {
    let { data_to_send, eliminated_blog } = req.body;
    Blog.countDocuments({ draft: false, "tags": { $in: data_to_send }, blog_id: { $ne: eliminated_blog } })
        .then(count => {
            return resp.status(200).json({ total_docs: count });
        })
        .catch(err => {
            return resp.status(500).json({ error: err.message });
        });
})

router.post("/search-bar-blogs", async (req, resp) => {
    let { query, page, author } = req.body;

    let findQuery;
    if (query) {
        findQuery = { "title": new RegExp(query, 'i'), "draft": false };
    }
    else if (author) {
        findQuery = { "author": author, "draft": false };
    }
    let maxLength = 2;

    if (findQuery) {
        await Blog.find(findQuery)
            .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
            .sort({ "publishedAt": -1 })
            .select("blog_id title des tags activity banner publishedAt -_id")
            .skip((page - 1) * maxLength)
            .limit(maxLength)
            .then(blogs => {
                return resp.status(200).json({ blogs });
            })
            .catch(err => {
                return resp.status(500).json({ "error": err.message });
            });
    }
    else {
        return resp.status(200).json({ blogs: [] });
    }

});

router.post("/search-bar-count-blogs", (req, resp) => {
    let findQuery;
    let { data_to_send } = req.body;

    if (data_to_send.author) {
        findQuery = { draft: false, author: data_to_send.author };
    }
    else {
        findQuery = { draft: false, "title": new RegExp(data_to_send, 'i') };
    }

    if (findQuery) {
        Blog.countDocuments(findQuery)
            .then(count => {
                return resp.status(200).json({ total_docs: count });
            })
            .catch(err => {
                return resp.status(500).json({ error: err.message });
            });
    }
});

router.post("/get-blog", (req, resp) => {

    let { blog_id, draft, mode } = req.body;
    let incrementVal = mode == "edit" ? 0 : 1;

    Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_reads": incrementVal } })
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
        .select("title des content banner tags activity blog_id publishedAt ")
        .then((blog) => {
            User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } })
                .catch(err => {
                    resp.status(500).json({ "error": err.message });
                });

            if (blog.draft && !draft) {
                return resp.status(500).json({ "error": "you can not access the draft blogs" });
            }
            // console.log(blog);
            resp.status(200).json({ blog });
        })
        .catch(err => {
            resp.status(500).json({ "error": err.message });
        });
});

router.post("/check-islike", verifyJWT, async (req, resp) => {
    let user_id = req.user.id;

    let { _id } = req.body;
    // console.log(_id, user_id);

    Notification.exists({user : user_id, type : "like", blog : _id})
    .then(result => {
        // console.log(result);
        resp.status(200).json({result});
    })
    .catch(err => {
        resp.status(500).json({error : err.message});
    });
});

router.post("/update-like", verifyJWT,(req, resp) => {
    let user_id = req.user.id;
    let {isLiked, _id } = req.body;
    let incrementVal = !isLiked ? 1 : -1;

    Blog.findOneAndUpdate({_id}, {$inc : {"activity.total_likes" : incrementVal}})
    .then((blog) => {

        if(!isLiked){
            let like = new Notification({
                type : "like",
                blog : _id,
                notification_for : blog.author,
                user : user_id
            })

            like.save().then(() => {
                console.log("hi");
                return resp.status(200).json({like_by_user  : true})
            })
        }
        else{
            Notification.findOneAndDelete({user : user_id, type : "like", blog : _id})
            .then(() => {
                return resp.status(200).json({like_by_user  : false})
            })
        }
    })
})

export default router;
