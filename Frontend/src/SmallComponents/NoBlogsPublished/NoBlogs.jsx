import styles from "./NoBlogs.module.css";

const NoBlogs = ({message}) => {
    return <div className = {styles["container"]}>
        <p>{message}</p>
    </div>
}

export default NoBlogs;