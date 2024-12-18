import styles from "./UserNavigation.module.css";
import AnimationWrapper from "../../SmallComponents/Animation/Animation";
import { TfiWrite } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromSession } from "../../Common/Session";
import { userContextActions } from "../../Store/userContext";

const UserNavigationPanel = () => {

    const userData = useSelector(store => store.userData);
    const dispatch = useDispatch();

    const handleLogOut = () => {
        removeFromSession("user");
        dispatch(userContextActions.setUserAuth({access_token : null}))
    }

    return <AnimationWrapper duration={0.2} className="user-panel">
        <div className={styles['user-nav-panel']}>
            <Link to="/editor" className={styles["write"]}>
                 <span><TfiWrite /></span> 
                 Write
            </Link>

            <Link to = {`/user/${userData.username}`} className = {styles["profile"]}>Profile</Link>
            <Link to = "/dashboard/blogs" className = {styles["dash-b"]}>Dashboard</Link>
            <Link to = "/settings/edit-profile" className = {styles["settings"]}>Settings</Link>

            <div className = {styles["log-out"]} onClick = {handleLogOut}>
                <span>Sign Out</span>
                <span>@{userData.username}</span>
            </div>
        </div>
    </AnimationWrapper>
}

export default UserNavigationPanel;