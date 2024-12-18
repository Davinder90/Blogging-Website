import styles from "./HomePage.module.css";
import AnimationWrapper from "../../SmallComponents/Animation/Animation.jsx";
import InPageNavigation from "../../SmallComponents/InPageNavigation/InPageNavigation.jsx";
import { useEffect, useState } from "react";
import Loader from "../../SmallComponents/Loader/Loader.jsx";
import PostBlog from "../../Components/PostBlog/PostBlog.jsx";
import TrendingBlog from "../../Components/TrendingBlog/TrendingBlog.jsx";
import { FaArrowTrendUp } from "react-icons/fa6";
import { activeTabRef } from "../../SmallComponents/InPageNavigation/InPageNavigation.jsx";
import NoBlogs from "../../SmallComponents/NoBlogsPublished/NoBlogs.jsx";
import FilterData from "../../Common/FilterDataPagination.jsx";
import LoadMore from "../../SmallComponents/LoadMore/LoadMore.jsx";
import { useDispatch, useSelector } from "react-redux";
import { blogsDataActions } from "../../Store/blogsData.js";
import fetchLatestBlogs from "../../Common/FetchLatestBlogs.jsx";
import fetchTrendingBlogs from "../../Common/FetchTrendingBlogs.jsx";
import fetchCategoryBlogs from "../../Common/FetchCategoryBlogs.jsx";

const HomePage = () => {

    const { blogs, trendingBlogs, pageState} = useSelector(store => store.blogsData);
    const dispatch = useDispatch();

    let categories = ["programming", "bollywood", "film making", "social media", "cooking", "tech", "finance", "travel"];
    let create_new_arr = false;

    const handleCategory = async (event) => {
        let category = event.target.innerText.toLowerCase();

        dispatch(blogsDataActions.setBlogs(null))

        if (pageState == category) {
            await dispatch(blogsDataActions.setPageState("home"));
        }
        else {
            await dispatch(blogsDataActions.setPageState(category));
        }
    }

    const handleLatestBlogs = async () => {
        let formatedData = await fetchLatestBlogs(1, blogs, create_new_arr);
        dispatch(blogsDataActions.setBlogs(formatedData))
    }

    const handleCategoryBlogs = async () => {
        let formatedData = await fetchCategoryBlogs(1, pageState, blogs, create_new_arr);
        dispatch(blogsDataActions.setBlogs(formatedData));
    }

    const handleTrendingBlogs = async () => {
        let data = await fetchTrendingBlogs(create_new_arr);
        dispatch(blogsDataActions.setTrendingBlogs(data));
    }

    useEffect(() => {
        activeTabRef.current.click();
            if (pageState == "home") {
                handleLatestBlogs();
            }
            else {
                handleCategoryBlogs();
        }

        if (!trendingBlogs) {
            handleTrendingBlogs();
        }
    }, [pageState])


    return <AnimationWrapper>
        <section className="container">
            {/* latest blogs */}
            <div className={styles["latest-blogs-block"]}>
                <InPageNavigation routes={[pageState, "trending blogs"]}>

                    <>
                        {
                            blogs == null ? (<div className={styles["loader-container"]}><Loader /></div>)
                                : (
                                    blogs.results.length ?
                                        blogs.results.map((blog, index) => {
                                            return <AnimationWrapper transition={{ duration: 1, delay: index * .1 }}>
                                                <PostBlog content={blog} author={blog.author.personal_info} postindex={index} />
                                            </AnimationWrapper>
                                        })
                                        : <NoBlogs message="No blogs published" />)
                        }
                        <LoadMore state={blogs} loadBlogFun={(pageState == "home" ? fetchLatestBlogs : fetchCategoryBlogs)} />
                    </>

                    {
                        trendingBlogs == null ? (<div className={styles["loader-container"]}><Loader /></div>)
                            : (
                                trendingBlogs.length ?
                                    trendingBlogs.map((blog, index) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: index * .1 }}>
                                            <TrendingBlog content={blog} author={blog.author.personal_info} blogindex={index} />
                                        </AnimationWrapper>
                                    })
                                    : <NoBlogs message="No trending blogs" />)
                    }
                </InPageNavigation>
            </div>

            {/* filters and trending blogs */}
            <div className={styles["filter-trend-block"]}>
                <div className={styles["area"]}>
                    <h1 className={styles["head"]}>Stories form all interests</h1>
                    <div className={styles["tags"]}>
                        {
                            categories.map((category, index) => {
                                return <button className={`${styles["cat-btn"]} ${pageState == category ? styles["btn-sel"] : ""}`} key={index} onClick={handleCategory}>{category}</button>
                            })
                        }
                    </div>
                </div>
                <div>
                    <h1 className={styles["head"]} style={{ marginBottom: "20px" }}>Trending <FaArrowTrendUp /></h1>
                    {
                        trendingBlogs == null ? (<div className={styles["loader-container"]}><Loader /></div>)
                            : (
                                trendingBlogs.length ?
                                    trendingBlogs.map((blog, index) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: index * .1 }}>
                                            <TrendingBlog content={blog} author={blog.author.personal_info} blogindex={index} />
                                        </AnimationWrapper>
                                    })
                                    : <NoBlogs message="No trending blogs" />)
                    }
                </div>
            </div>
        </section>
    </AnimationWrapper>
}

export default HomePage;





// const [blogs, setBlogs] = useState(null);
// const [trendingBlogs, setTrendingBlogs] = useState(null);
// const [pageState, setPageState] = useState("home");
// setBlogs(formatedData);
// setTrendingBlogs(data.blogs);
