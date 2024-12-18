// import { useEffect } from "react";
// import styles from "./SimilarBlogs.module.css";
// import AnimationWrapper from "../../SmallComponents/Animation/Animation";
// import PostBlog from "../PostBlog/PostBlog";
// import NoBlogs from "../../SmallComponents/NoBlogsPublished/NoBlogs.jsx";
// import { useDispatch, useSelector } from "react-redux";
// import { blogDataActions } from "../../Store/blogData.js";
// import fetchCategoryBlogs from "../../Common/FetchCategoryBlogs.jsx";

// const SimilarBlogs = ({blog_id}) => {

//     const blogData = useSelector(store => store.blogData);
//     const { similarBlogs, blog } = blogData;
//     const {tags} = blog;

//     return <div className={styles["similar-container"]}>
//         {
//             similarBlogs != null ? (<div >
//                 <h1 className={styles["head"]}>Similar Blogs</h1>
//                 {
//                     similarBlogs.results.length != 0 ? similarBlogs.results.map((blog, index) => {
//                         return <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.08 }}>
//                             <PostBlog content={blog} author={blog.author.personal_info} postindex={index} />
//                         </AnimationWrapper>
//                     }) : <NoBlogs message = "No similar Blogs Published" />
//                 }
//             </div>) : ""
//         }
//     </div>
// }

// export default SimilarBlogs;