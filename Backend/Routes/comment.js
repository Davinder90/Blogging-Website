import express from "express";
import jwt from "jsonwebtoken";
import User from "../Database-Setup/userSchema.js";
import Blog from "../Database-Setup/blogSchema.js";
import Notification from "../Database-Setup/notificationSchema.js";
import Comment from "../Database-Setup/commentSchema.js";

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

router.post("/add-comment", verifyJWT,(req, resp) => {
    let user_id = req.user.id;

    let {blog_id, comment, blog_author, replying_to, childrenLevel} = req.body;
    
    if(!comment){
        return resp.status(403).json({error : "Write something to leave a comment"});
    }

    console.log(childrenLevel);
    let commentOBJ = {
        blog_id,
        comment,
        blog_author,
        commented_by : user_id,
    };
    
    if(replying_to){
        commentOBJ.isReply = true;
        commentOBJ.parent = replying_to;
        commentOBJ.childrenLevel = childrenLevel
    }
    else{
        commentOBJ.childrenLevel = 0
    }

    new Comment(commentOBJ).save().then(async (commentFile) => {
        // console.log(commentFile);
        let {_id : comment_id, comment, commentedAt, children, } = commentFile;

        Blog.findByIdAndUpdate({_id : blog_id},{
            $push : {comments : comment_id},
            $inc : {"activity.total_comments" : 1, "activity.total_parent_comments" : replying_to ? 0 : 1}
        }).then(() => {console.log("new comment created")});

        let notificationOBJ = {
            type : replying_to ? "reply" : "comment",
            blog : blog_id,
            notification_for : blog_author,
            user : user_id,
            comment : comment_id
        }

        if(replying_to){
            notificationOBJ.replied_on_comment = replying_to;

            await Comment.findOneAndUpdate({_id : replying_to},{$push : {children : comment_id}})
            .then(((replying_to_comment) => {
                notificationOBJ.notification_for = replying_to_comment.commented_by;
            }))
        }

        new Notification(notificationOBJ).save().then(() => {
            console.log("notification is created for comment");
        })

        return resp.status(200).json({comment, commentedAt, comment_id, user_id, children})
    })
})

router.post("/get-blog-comments",(req, resp) => {
    let {blog_id, skip} = req.body;
    let maxLength = 5;

    Comment.find({blog_id, isReply : false})
    .populate("commented_by","personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(maxLength)
    .sort({"commentedAt" : -1})
    .then((comment) => {
        return resp.status(200).json(comment);
    })
    .catch(err => {
        return resp.status(500).json({error : err.message});
    })
})

router.post("/get-replies",(req, resp) => {
    let {_id ,skip} = req.body;

    let maxlimit = 5;

    Comment.findOne({_id})
    .populate({
        path : "children",
        options : {
            skip : skip,
            limit : maxlimit,
            sort : {"commentedAt" : -1}
        },
        populate : {
            path : "commented_by",
            select : "personal_info.username personal_info.fullname personal_info.profile_img",
        },
        select : "-blog_id -updatedAt"
    })
    .select("children")
    .then(doc => {
        resp.status(200).json({replies : doc.children});
    })
    .catch((err) => {
        resp.status(500).json({error : err.message});
    })
})

const deleteComment = (_id) => {
    Comment.findOneAndDelete({_id})
    .then(comment => {
        if(comment.parent){
            Comment.findOneAndUpdate({_id : comment.parent},{$pull : {children : _id}})
            .then(data => {console.log("comment deleted from parent")})
            .catch(err => {console.log(err.message)});
        }

        Notification.findOneAndDelete({comment : _id}).then(notification => {console.log("comment notification deleted")});
        Notification.findOneAndDelete({reply : _id}).then(reply => {console.log("reply notification deleted")});

        Blog.findOneAndUpdate({_id : comment.blog_id}, {$pull : {comments : _id}, $inc : {"activity.total_comments" : -1, "activity.total_parent_comments" : comment.parent ? 0 : -1}})
        .then(blog => {
            if(comment.children.length){
                comment.children.map(reply => {
                    deleteComment(reply)
                })
            }
        })        
    })
    .catch(err => {
        console.log(err.message);
    })
}

router.post("/delete-comment",verifyJWT,(req,resp) => {
    let user_id = req.user.id;
    let {_id} = req.body;

    Comment.findOne({_id})
    .then(comment => {
        if(user_id == comment.commented_by || user_id == comment.blog_author){
            deleteComment(_id);
            resp.status(200).json({status : "done"});
        }
        else{
            resp.status(403).json({error : "You can not delete this comment"});
        }
    })
})

export default router;






