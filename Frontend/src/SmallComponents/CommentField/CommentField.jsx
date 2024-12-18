import styles from "./CommentField.module.css";
import { useContext, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast, Toaster} from "react-hot-toast";
import { blogDataActions } from "../../Store/blogData";
import { commentContext } from "../../Pages/Blog-Page/BlogPage";

const CommentField = ({ action, index = undefined, replying_to = undefined, setReplying = undefined }) => {

    const dispatch = useDispatch();
    const [comment, setComment] = useState("");
    const userData = useSelector(store => store.userData);
    const blogData = useSelector(store => store.blogData);
    let {access_token, fullname, profile_img, username} = userData;
    let {blog} = blogData;
    let {activity, activity : {total_comments, total_parent_comments},author : {_id : blog_author}, _id : blog_id} = blog;

    const {comments ,comments : {results : commentsArr}, setComments, totalParentComment, setTotalParentComment} = useContext(commentContext);
 
    const handleComment = async () => {
        if(!access_token){
            return toast.error("Login first to leave a comment");
        }

        if(!comment){
            return toast.error("Write something to leave a comment")
        }     
        
        let childrenLevel;
        
        if(action == "reply"){
            childrenLevel = commentsArr[index].childrenLevel + 1;
        }
        else{
            childrenLevel = 0;
        }

        await fetch("http://localhost:3000/comment/add-comment", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json", "authorization": `Bearer ${access_token}`},
            body: JSON.stringify({ comment, blog_author, blog_id, replying_to, childrenLevel})
        })
        .then((resp) => resp.json())
        .then((data) => {
            setComment("");
            let newCommentArr;
            let parentCommentIncrementVal = replying_to ? 0 : 1;
            data.commented_by = {personal_info : {fullname, username, profile_img}};

            if(replying_to){
                commentsArr[index].children = [...commentsArr[index].children, data.comment_id]
                data.isReplyLoaded = true;
                data.childrenLevel = childrenLevel;
                data.parentIndex = index;
                commentsArr.splice(index + 1,0, data);
                newCommentArr = commentsArr;
            }
            else{
                newCommentArr = [data, ...commentsArr];
            }

            if(setReplying){
                setReplying(false);
            }
            setComments({results : newCommentArr});
            dispatch(blogDataActions.setBlog({...blog,activity : {...activity, total_comments : total_comments + 1}}));
            setTotalParentComment(totalParentComment + parentCommentIncrementVal);
            console.log(comments,totalParentComment);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return <div className = {styles["container"]}>
        <Toaster />
        <textarea value={comment} placeholder="Leave a comment..." className={styles["input-text"]} onChange={(event) => { setComment(event.target.value) }}></textarea>
        <button className = {styles["action-btn"]} onClick = {handleComment} >{action}</button>
    </div>
}

export default CommentField;