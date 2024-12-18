import { useContext } from "react";
import styles from "./Tag.module.css";
import { IoIosClose } from "react-icons/io";
import { EditorContext } from "../../Pages/Editor-Page/Editor";

const Tag = ({tag,tagIndex}) => {
    const {blog,blog : {tags},setBlog} = useContext(EditorContext);

    const handleDeleteTag = () => {
        let arr = tags.filter((t) => t != tag);
        setBlog({...blog,tags : arr})
    }

    const handelTagChange = (event) => {
        if (event.keyCode == 13  || event.keyCode == 188) {
            event.preventDefault();
            
            let currentData = event.target.innerText;
            tags[tagIndex] = currentData;
            setBlog({...blog,tags})
            event.target.setAttribute("contentEditable",false);
        }
    }

    const handleOnClick = (event) => {
        event.target.setAttribute("contentEditable",true);
        event.target.focus();
    }

    return <div className={styles["container"]}>
        <p className={styles["name"]} onClick = {handleOnClick} onKeyDown = {handelTagChange}>{tag}</p>
        <button className={styles["del"]} onClick = {handleDeleteTag}>
            <IoIosClose />
        </button>
    </div>
}

export default Tag;