import styles from "./UserCard.module.css";
import { Link } from "react-router-dom";

const UserCard = ({user}) => {

    let {personal_info : {fullname , username, profile_img}} = user;

    return <Link to = {`/user/${username}`} className = {styles["container"]}>
        <img src = {profile_img}/>
        <div>
            <h1>{fullname}</h1>
            <p>@{username}</p>
        </div>
    </Link>
}

export default UserCard;