import { getDay } from "../../Common/getDate";
import styles from "./PostBlog.module.css";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const PostBlog = ({ content, postindex, author }) => {

    const { fullname, username, profile_img } = author;
    const { title, tags, des, banner, publishedAt, activity: { total_likes }, blog_id: id } = content;

    return <Link to = {`/blog/${id}`} className={styles["post-container"]}>
        <div className={styles["post-content-block"]}>
            <div className={styles["author-block"]}>
                <img src={profile_img} />
                <p className={styles["author-name"]}>{fullname} @{username}</p>
                <p style={{ minWidth: "fit-content" }}>{getDay(publishedAt)}</p>
            </div>
            <h1 className={styles["title"]}>{title}</h1>
            <p className={styles["des"]}>{des}</p>

            <div className={styles["activity-container"]}>
                <div className={styles["tags"]} >
                    {tags.length > 1 ? <><span>{tags[0]}</span> ....</>: <span>{tags[0]}</span>}
                </div>
                <span className={styles["like-btn"]}><FaHeart /> {total_likes}</span>
            </div>
        </div>
        <div className = {styles["post-content-block2"]}>
            <div>
                <img src={banner} style={{ height: "100%", width: "100%" , marginTop : "-1px"}} alt="" />
            </div>
        </div>
    </Link>
}

export default PostBlog;