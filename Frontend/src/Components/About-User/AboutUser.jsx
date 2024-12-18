import styles from "./AboutUser.module.css";
import {Link} from "react-router-dom";
import { FaYoutube, FaInstagram, FaGithub, FaFacebook, FaTwitter} from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { getFullDay } from "../../Common/getDate";

export const LogoComponent = ({brand}) => {

    if(brand == "youtube"){
        return <FaYoutube />
    }

    else if(brand == "instagram"){
        return <FaInstagram />
    }

    else if(brand == "github"){
        return <FaGithub />
    }

    else if(brand == "website"){
        return <IoIosGlobe />
    }

    else if(brand == "facebook"){
        return <FaFacebook />
    }

    else if(brand == "twitter"){
        return <FaTwitter />
    }    
}

const AboutUser = ({ bio, social_links, joinedAt }) => {
    return <div className={styles["container"]}>
        <p className={styles["bio"]}>{bio.length ? bio : "Nothing to read here"}</p>

        <div className={styles["social-links"]}>
            {
                Object.keys(social_links).map((key) => {
                    let link = social_links[key];
                    return <Link to={link} key = {key} className = {styles["link"]}>
                        <LogoComponent brand = {key}/>
                    </Link>
                })
            }
        </div>
        <p className = {styles["date"]}>Joined on {getFullDay(joinedAt)}</p>
    </div>
}

export default AboutUser;