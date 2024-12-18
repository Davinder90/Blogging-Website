import { useParams } from "react-router-dom";
import styles from "./SearchPage.module.css";
import InPageNavigation from "../../SmallComponents/InPageNavigation/InPageNavigation";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../SmallComponents/Loader/Loader";
import AnimationWrapper from "../../SmallComponents/Animation/Animation.jsx";
import PostBlog from "../../Components/PostBlog/PostBlog.jsx";
import NoBlogs from "../../SmallComponents/NoBlogsPublished/NoBlogs.jsx";
import { useState } from "react";
import { useEffect } from "react";
import fetchSearchBarBlogs from "../../Common/FetchSearchBarBlogs.jsx";
import { activeTabRef } from "../../SmallComponents/InPageNavigation/InPageNavigation";
import LoadMore from "../../SmallComponents/LoadMore/LoadMore.jsx";
import { SearchBlogsDataActions } from "../../Store/searchBlogData.js";
import UserCard from "../../Components/UserCard/UserCard.jsx";
import { FaRegUser } from "react-icons/fa6";

const SearchPage = () => {
    const { query } = useParams();
    const { searchBlogs, setSearchBlogs, searchUsers, setSearchUsers } = useSelector(store => store.searchBlogsData);

    const dispatch = useDispatch();

    const handleSearchBlogs = async () => {
        dispatch(SearchBlogsDataActions.setSearchBlogs(null));
        let formatedData = await fetchSearchBarBlogs(1, query, true, setSearchBlogs);
        dispatch(SearchBlogsDataActions.setSearchBlogs(formatedData));
    }

    const fetchSearchUser = async () => {
        dispatch(SearchBlogsDataActions.setSearchUsers(null));
        await fetch("http://localhost:3000/user/search-users", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ query })
        })
            .then((resp) => resp.json())
            .then((data) => {
                let users = data.users;
                dispatch(SearchBlogsDataActions.setSearchUsers(users));
            })
    }

    useEffect(() => {
        activeTabRef.current.click();
        
        handleSearchBlogs();
        fetchSearchUser();
    }, [query])

    const UserCardsWrapper = () => {
        return <>
            {
                searchUsers == null ? (<div className="loader-container"><Loader /></div>)
                    : (searchUsers.length ? searchUsers.map((user, index) => {
                        return <AnimationWrapper transition={{ duration: 1, delay: index * 0.08 }}>
                            <UserCard user={user} />
                        </AnimationWrapper>
                    }) : <NoBlogs message="No user found" />)
            }
        </>
    }

    return <section className="container">
        <div className={styles["search-blogs-block"]}>
            <InPageNavigation routes={[`Search Results From "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                <>
                    {
                        searchBlogs == null ? (<div className="loader-container"><Loader /></div>)
                            : (
                                searchBlogs.results.length ?
                                    searchBlogs.results.map((blog, index) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: index * .1 }}>
                                            <PostBlog content={blog} author={blog.author.personal_info} postindex={index} />
                                        </AnimationWrapper>
                                    })
                                    : <NoBlogs message="No blogs published" />)
                    }
                    <LoadMore state={searchBlogs} setSearchBlogs={setSearchBlogs} query={query} loadBlogFun={fetchSearchBarBlogs} />
                </>
                <UserCardsWrapper />
            </InPageNavigation>
        </div>

        <div className={styles["users-container"]}>
            <h1 style={{ marginBottom: "20px" }}>Users related to Search  <span><FaRegUser /></span></h1>
            <UserCardsWrapper />
        </div>
    </section>
}

export default SearchPage;