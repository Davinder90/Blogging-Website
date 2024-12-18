import styles from "./ProfileBlogs.module.css";
import PostBlog from "../PostBlog/PostBlog";
import LoadMore from "../../SmallComponents/LoadMore/LoadMore";
import Loader from "../../SmallComponents/Loader/Loader";
import AnimationWrapper from "../../SmallComponents/Animation/Animation";
import InPageNavigation from "../../SmallComponents/InPageNavigation/InPageNavigation";
import fetchSearchBarBlogs from "../../Common/FetchSearchBarBlogs";
import AboutUser from "../About-User/AboutUser";
import { useDispatch, useSelector } from "react-redux";
import fetchUserBlogs from "../../Common/FetchUserBlogs";
import NoBlogs from "../../SmallComponents/NoBlogsPublished/NoBlogs.jsx";
import { useEffect } from "react";
import { userProfileDataActions } from "../../Store/userProfileData.js";

const ProfileBlogs = () => {

    const dispatch = useDispatch();
    const userProfileData = useSelector(store => store.userProfileData);
    const { blogs, userProfileInfo, user_id, userProfileInfo: { personal_info: { fullname, username, profile_img, bio }, account_info: { total_posts, total_reads }, joinedAt, social_links } } = userProfileData;

    const handleUserBlogs = async (user_id) => {
        dispatch(userProfileDataActions.setBlogs(null));
        let formatedData = await fetchUserBlogs(blogs, user_id, 1);
        dispatch(userProfileDataActions.setBlogs(formatedData));
        dispatch(userProfileDataActions.setUserId(user_id));
    }

    useEffect(() => {
        if (userProfileInfo._id != user_id) {
            handleUserBlogs(userProfileInfo._id);
        }
    }, [userProfileInfo._id, blogs])

    return <div className={styles["blog-container"]}>
        <InPageNavigation routes={["publish blogs", "about"]} defaultHidden={["about"]}>

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
                <LoadMore state={blogs} author={userProfileInfo._id} loadBlogFun={fetchUserBlogs} />
            </>

            <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
        </InPageNavigation>
    </div>
}

export default ProfileBlogs;