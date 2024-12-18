import { useDispatch, useSelector } from "react-redux";
import styles from "./BlogInteraction.module.css";
import { FiHeart } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { blogDataActions } from "../../Store/blogData";
import { blogsDataActions } from "../../Store/blogsData";

const BlogInteraction = ({commentWrapper, setCommentWrapper}) => {

    const { blog, isLiked } = useSelector(store => store.blogData);
    const userData = useSelector(store => store.userData);
    const { username, access_token } = userData;

    const dispatch = useDispatch();
    let { _id, activity, activity: { total_likes, total_reads, total_comments }, title, des, banner, publishedAt, content, tags, blog_id, author: { personal_info: { username: author_username } } } = blog;

    const handleLike = async () => {
        if (access_token) {

            !isLiked ? total_likes++ : total_likes--;
            dispatch(blogDataActions.setBlog({ ...blog, activity: { ...activity, total_likes } }));
            await fetch("http://localhost:3000/blog/update-like", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json", "authorization": `Bearer ${access_token}` },
                body: JSON.stringify({ isLiked, _id })
            })
                .then(resp => resp.json())
                .then(data => {
                    dispatch(blogDataActions.setIsLiked(data.like_by_user));
                })
                .catch(err => {
                    console.log(err);
                })
        }
        else {
            return toast.error("Please login to like the blog");
        }
    }

    const handleIsLiked = async () => {
        dispatch(blogDataActions.setIsLiked(false));
        if (access_token) {
            await fetch("http://localhost:3000/blog/check-islike", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json", "authorization": `Bearer ${access_token}` },
                body: JSON.stringify({ _id })
            })
                .then((resp) => resp.json())
                .then(data => {
                    if (data.result) {
                        dispatch(blogDataActions.setIsLiked(true));
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    useState(() => {
        handleIsLiked()
    }, [isLiked])

    return <div className={styles["container"]}>
        <Toaster />
        <hr />
        <div className={styles["sub-container-1"]}>
            <div className={styles["btns-block"]}>
                <div className={styles["btn-container"]}>
                    <button onClick={handleLike} className={isLiked == true ? `${styles["heart"]}` : `${styles["nt-heart"]}`}>
                        {
                            isLiked == true ? <FaHeart />
                                : < FiHeart />
                        }
                    </button>
                    <p>{total_likes}</p>
                </div>

                <div className={styles["btn-container"]}>
                    <button onClick = {() => {setCommentWrapper(!commentWrapper)}}>
                        <FaRegCommentDots />
                    </button>
                    <p>{total_comments}</p>
                </div>
            </div>

            <div className={styles["btns-block"]}>
                {
                    username === author_username ? <Link to={`/editor/${blog_id}`} className={styles["edit-link"]}>Edit</Link> : ""
                }
                <Link to={`http://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} className={styles["twitter-link"]}><FaTwitter /></Link>
            </div>
        </div>
        <hr />
    </div>
}

export default BlogInteraction;