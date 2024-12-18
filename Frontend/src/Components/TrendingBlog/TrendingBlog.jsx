import styles from "./TrendingBlog.module.css";
import { Link } from "react-router-dom";
import { getDay } from "../../Common/getDate";

const TrendingBlog = ({ content, author, blogindex }) => {

    const { fullname, username, profile_img } = author;
    const { title, publishedAt, blog_id: id } = content;

    return <Link to={`/blog/${id}`} className={styles["post-container"]}>
        <h1 className={styles["post-index"]} data-text={blogindex < 10 ? "0" + (blogindex + 1) : blogindex + 1}>{blogindex < 10 ? "0" + (blogindex + 1) : blogindex + 1}</h1>
        <div className={styles["body"]}>
            <div className={styles["author-block"]}>
                <img src={profile_img} />
                <p className={styles["author-name"]}>{fullname} @{username}</p>
                <p style={{ minWidth: "fit-content" }}>{getDay(publishedAt)}</p>
            </div>
            <h1 className={styles["title"]}>{title}</h1>
        </div>
    </Link>
}

export default TrendingBlog;