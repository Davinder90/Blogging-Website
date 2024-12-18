import { Outlet } from "react-router-dom";
import styles from "./SideNav.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SideNav = () => {

    const userData = useSelector(store => store.userData);
    const { access_token } = userData;

    return <>
        {
            access_token == null ? <Navigate to={"/sign-in"} /> :
                <section className = {styles["container"]}>
                    <div className = {styles["side-navbar"]}>

                    </div>
                    <Outlet />
                </section>
        }
    </>
}

export default SideNav; 