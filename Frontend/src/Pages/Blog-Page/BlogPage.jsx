import { createContext, useContext, useEffect, useState } from "react";
import styles from "./BlogPage.module.css";
import { Link, useParams } from "react-router-dom";
import fetchBlog from "../../Common/FetchBlog.jsx";
import Loader from "../../SmallComponents/Loader/Loader.jsx";
import AnimationWrapper from "../../SmallComponents/Animation/Animation.jsx";
import { getFullDay } from "../../Common/getDate.jsx";
import { useDispatch, useSelector } from "react-redux";
import { blogDataActions } from "../../Store/blogData.js";
import BlogInteraction from "../../Components/BlogInteraction/BlogInteraction.jsx";
import fetchCategoryBlogs from "../../Common/FetchCategoryBlogs.jsx";
import PostBlog from "../../Components/PostBlog/PostBlog.jsx";
import NoBlogs from "../../SmallComponents/NoBlogsPublished/NoBlogs.jsx";
import BlogContent from "../../Components/BlogContent/BlogContent.jsx";
import CommentWrapper from "../../Components/CommentWrapper/CommentWrapper.jsx";
import { fetchComments } from "../../Common/FetchComments.jsx";

export const blogStructure = {
    title: "",
    des: "",
    banner: "",
    publishedAt: "",
    author: { personal_info: {} },
    content: [{ blocks: [] }],
    tags: [],
    activity: {}
}
export const commentContext = createContext();

const BlogPage = () => {

    const { blog_id } = useParams();

    const dispatch = useDispatch();

    const userData = useSelector(store => store.userData);
    const { access_token } = userData;

    const blogData = useSelector(store => store.blogData);
    const { blog, similarBlogs } = blogData;

    const [loading, setLoading] = useState(true);
    let { _id, title, des, banner, publishedAt, content, tags, author: { personal_info: { fullname, username, profile_img } } } = blog;

    const [commentWrapper, setCommentWrapper] = useState(false);
    const [comments, setComments] = useState({results : null});
    const [totalParentComment, setTotalParentComment] = useState(0);

    const handleComments = async () => {
        let data = await fetchComments(0, _id);
        setTotalParentComment(data.length);
        setComments({results : data})
    }

    const handleBlog = async () => {
        dispatch(blogDataActions.setBlog(blogStructure));
        await fetchBlog(blog_id)
            .then(async (data) => {

                await handleComments();
                dispatch(blogDataActions.setBlog(data));
                dispatch(blogDataActions.setSimilarBlogs(null));
                setLoading(false)
                handleSimilarBlogs();
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }

    const handleSimilarBlogs = async () => {
        let create_new_arr = false;
        let formatedData = await fetchCategoryBlogs(1, tags, similarBlogs, blog_id, create_new_arr);
        dispatch(blogDataActions.setSimilarBlogs(formatedData));
    }

    useEffect(() => {
        handleBlog();
    }, [blog_id, loading]);


    return <AnimationWrapper>
        
        <commentContext.Provider value = {{comments, setComments, totalParentComment, setTotalParentComment}} >
            {
            loading ? <div className="loader-container"><Loader /></div> :
                <div className={styles["main-container"]}>
                    <div className={styles["container"]}>
                        <img src={banner} className={styles["banner"]} />
                        <div className={styles["blog-content-container"]}>
                            <h2>{title}</h2>
                            <div>
                                <div className={styles["user-container"]}>
                                    <img src={profile_img} className={styles["profile-img"]} />
                                    <p>
                                        {fullname}
                                        <br />
                                        @ <Link to={`/user/${username}`} style={{ color: "black" }}>{username}</Link>
                                    </p>
                                </div>
                                <p className={styles["date"]}>Published on {getFullDay(publishedAt)}</p>
                            </div>
                        </div>
                        <BlogInteraction commentWrapper={commentWrapper} setCommentWrapper={setCommentWrapper} />
                        <div className={styles["content-container"]}>
                            {
                                content[0].blocks.map((block, index) => {
                                    return <div className={styles["content-block"]}>
                                        <BlogContent block={block} />
                                    </div>
                                })
                            }
                        </div>
                        <BlogInteraction commentWrapper={commentWrapper} setCommentWrapper={setCommentWrapper} />
                        <div className={styles["similar-container"]}>
                            {
                                similarBlogs != null ? <div >
                                    <h1 className={styles["head"]}>Similar Blogs</h1>
                                    {
                                        similarBlogs.results.length != 0 ? similarBlogs.results.map((blog, index) => {
                                            return <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.08 }}>
                                                <PostBlog content={blog} author={blog.author.personal_info} postindex={index} />
                                            </AnimationWrapper>
                                        }) : <NoBlogs message="No similar blogs published" />
                                    }
                                </div> : ""
                            }
                        </div>
                    </div>
                    <CommentWrapper commentWrapper={commentWrapper} setCommentWrapper={setCommentWrapper} />
                </div>
}
                </commentContext.Provider>
    </AnimationWrapper>
}

export default BlogPage;