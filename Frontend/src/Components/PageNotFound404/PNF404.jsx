import styles from "./PNF404.module.css";
import pnf from "../../assets/AppImages/PNF.png";
import { Link } from "react-router-dom";
import logo from "../../assets/AppImages/blogger-logo.jpg";

const PageNotFound = () => {
    return <div className={styles["container"]}>
        <div className = {styles["first-blk"]}>
            <img src={pnf} />
            <h1>Page not found</h1>
            <p>The page you are looking for does not exists. Need back to the <Link to="/" className = {styles["link"]}>home page</Link></p>
        </div>
        <div className = {styles["second-blk"]}>
            <div className = {styles["logo-container"]}><img src = {logo} alt="" /> blogger</div>
            <p>Read millions of stories around the world</p>
        </div>
    </div>
}

export default PageNotFound;