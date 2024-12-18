import { useDispatch, useSelector } from "react-redux";
import styles from "./CommentWrapper.module.css";
import { redirect } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import CommentField from "../../SmallComponents/CommentField/CommentField";
import NoBlogs from "../../SmallComponents/NoBlogsPublished/NoBlogs";
import AnimationWrapper from "../../SmallComponents/Animation/Animation";
import CommentCard from "../CommentCard/CommentCard";
import { fetchComments } from "../../Common/FetchComments";
import { blogDataActions } from "../../Store/blogData";
import { useContext, useEffect, useState } from "react";
import { commentContext } from "../../Pages/Blog-Page/BlogPage";

const CommentWrapper = ({ commentWrapper, setCommentWrapper }) => {

    const dispatch = useDispatch();
    const {comments,comments : {results : commentsArr}, setComments, totalParentComment, setTotalParentComment} = useContext(commentContext);

    const blogData = useSelector(store => store.blogData);
    const {blog} = blogData;
    const { activity : {total_parent_comments},title, _id} = blog;
    

    const handleLoadMoreComments = async () =>{
        let data = await fetchComments(totalParentComment, _id)
        let newCommentsArr = { results: [...commentsArr,...data]}
        setTotalParentComment(newCommentsArr.length);
        setComments(newCommentsArr)
        // dispatch(blogDataActions.setBlog({...blog, comments : newCommentArr}));
    } 

    useEffect(() => {
    },[comments]);

    return <>
        {
            commentWrapper ?
                < div className={`${styles["container"]}`} >
                    <div style={{position : "relative", width : "100%"}}>
                        <h1>Comment</h1>
                        <p className={styles["title"]}>{title}</p>
                        
                        <button className = {styles["close"]} onClick = {() => {setCommentWrapper(!commentWrapper)}}><RxCross1 /></button>
                    </div>
                    <hr />
                    <CommentField action = {"comment"} />

                    {
                        commentsArr && commentsArr.length ? commentsArr.map((comment, index) => {
                            return <AnimationWrapper key = {index}>
                                <CommentCard index = {index} leftVal = {comment.childrenLevel * 4} commentData = {comment}/>
                            </AnimationWrapper>
                        }) : <NoBlogs message = "No comments" />
                        
                    }

                    {
                        total_parent_comments > totalParentComment ?
                        <button className = {styles["load-more"]} onClick = {handleLoadMoreComments}>Load More</button>
                        : null
                    }

                </div >
                : null
        }
    </>
}

export default CommentWrapper;