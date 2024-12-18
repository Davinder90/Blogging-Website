import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import blogger_logo from "../../assets/AppImages/blogger-logo.jpg";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import UserNavigationPanel from "../UserNavigation/UserNavigation";
import { useRef, useState } from "react";
import { TfiWrite } from "react-icons/tfi";
import { SearchBlogsDataActions } from "../../Store/searchBlogData.js";

const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(store => store.userData);
    const [userPanel, setUserPanel] = useState(false);
    const searchRef = useRef();
    const handleUserPanel = () => {
        setUserPanel(!userPanel);
    };

    const handleBlurUser = () => {
        setTimeout(() => {
            setUserPanel(false);
        }, 250);
    };

    const handleTagKeyDown = async (event) => {
        let tag = event.target.value.toLowerCase();
        if (tag.length && event.keyCode == 13) {
            navigate(`/search/${tag}`);
        }
    }

    const handleSearchClick = async () => {
        searchRef.current.value ? navigate(`/search/${searchRef.current.value}`) : null;
    }

    return <nav className={styles["container"]}>
        <div className={styles["nav-left"]}>
            <div className={styles["logo-container"]}>
                <Link to="/"> <img className={styles["logo"]} src={blogger_logo} /> </Link>
                <p className={styles["logo-name"]}>Blogger</p>
            </div>
            <div className={styles["input"]}>
                <input type="text" placeholder="Search here" ref={searchRef} onKeyDown={handleTagKeyDown} />
                <span onClick={handleSearchClick}><IoSearch /></span>
            </div>
        </div>
        <div className={styles["nav-right"]}>
            {
                userData.access_token ?
                    <div className={styles["user-block"]}>
                        <Link to="/editor" className={styles["write"]}>
                            <span><TfiWrite /></span>
                            Write
                        </Link>
                        <Link to="/dashboard/notification">
                            <button className={styles["notification-btn"]}>
                                <span><IoNotificationsOutline /></span>
                            </button>
                        </Link>
                        <button className={styles["profile-logo"]} onClick={handleUserPanel} onBlur={handleBlurUser}>
                            <img src={userData.profile_img} /> 
                        </button>
                    </div> :
                    <div className={styles["user-log"]}>
                        <Link to="/editor" className={styles["write"]}>
                            <span><TfiWrite /></span>
                            Write
                        </Link>
                        <Link to="/sign-in"><button className="dark-btn">sign-in</button></Link>
                        <Link to="/sign-up"><button className="light-btn sign-up">sign-up</button></Link>
                    </div>
            }
            {
                (userPanel && userData.access_token) ? <UserNavigationPanel /> : ""
            }

        </div>
    </nav>
}

export default Navbar;