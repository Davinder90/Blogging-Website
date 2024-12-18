import { useEffect, useState } from "react";
import styles from "./UserProfilePage.module.css";
import { Link, useParams } from "react-router-dom";
import PageNotFound from "../../Components/PageNotFound404/PNF404.jsx";
import Loader from "../../SmallComponents/Loader/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import compressValue from "../../Common/CompressValue.jsx";
import AboutUser from "../../Components/About-User/AboutUser.jsx";
import fetchUserBlogs from "../../Common/FetchUserBlogs.jsx";
import { userProfileDataActions } from "../../Store/userProfileData.js";
import InPageNavigation from "../../SmallComponents/InPageNavigation/InPageNavigation.jsx";
import AnimationWrapper from "../../SmallComponents/Animation/Animation.jsx";
import fetchSearchBarBlogs from "../../Common/FetchSearchBarBlogs.jsx";
import ProfileBlogs from "../../Components/Profile-Blogs/ProfileBlogs.jsx";

const UserProfilePage = () => {

    let { id: profileId } = useParams();

    const dispatch = useDispatch();
    const userData = useSelector(store => store.userData);
    const userProfileData = useSelector(store => store.userProfileData);
    const { blogs, userProfileInfo, userProfileInfo: { personal_info: { fullname, username, profile_img, bio }, account_info: { total_posts, total_reads }, joinedAt, social_links } } = userProfileData;
    const [loading, setLoading] = useState(true);

    const profileDataStructure = {
        personal_info: {
            fullname: "",
            username: "",
            profile_img: "",
            bio: ""
        },
        account_info: {
            total_posts: 0,
            total_reads: 0
        },
        social_links: {},
        joinedAt: "",
    }

    const fetchUserInfo = async () => {
        setLoading(true);
        dispatch(userProfileDataActions.setUserProfileInfo(profileDataStructure))

        await fetch("http://localhost:3000/user/get-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ username: profileId })
        })
            .then((resp) => resp.json())
            .then((data) => {
                dispatch(userProfileDataActions.setUserProfileInfo(data.user));
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchUserInfo();
    }, [profileId]);

    return <>
        {
            // username.length ? <div>{profileId}</div> : <PageNotFound />
            loading ? <div className="loader-container"><Loader /></div>
                : <section className={styles["container"]}>
                    <div className={styles["profile-container"]}>
                        <img src={profile_img} className={styles["profile-container-img"]} />
                        <h1>@{username}</h1>
                        <p className={styles["f-name"]}>{fullname}</p>
                        <div className={styles["blog-info-con"]}>
                            <div>
                                <p>{compressValue(parseInt(total_posts))}</p>
                                <p>Blogs</p>
                            </div>
                            <div>
                                <p>{compressValue(parseInt(total_reads))}</p>
                                <p>Reads</p>
                            </div>
                        </div>
                        {
                            userData.username === profileId ? <div className={styles["edit-pr-btn-container"]}>
                                <Link to={`/settings/edit-profile`} className={styles["edit-pr-btn"]}>
                                    Edit Profile
                                </Link>
                            </div> : ""
                        }
                        <div className={styles["about-block"]}>
                            <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        </div>
                    </div>
                    <ProfileBlogs />
                </section>
        }
    </>
}

export default UserProfilePage;