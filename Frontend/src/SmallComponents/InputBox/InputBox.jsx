import styles from "./InputBox.module.css";
import { IoIosPerson } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa6";
import { useRef } from "react";

const InputBox = ({name,value,type,icon,placeholder,id}) => {
    return <div className = {styles["input-box"]}>
         <i>
        {icon === "name" ? <IoIosPerson/> : ""}
        {icon === "email" ? <MdOutlineEmail /> : ""}
        {icon === "password" ? <FaKey /> : ""}
        </i>
        <input type = {type}
        name = {name}
        placeholder = {placeholder}
        defaultValue = {value}/>
    </div>
}

export default InputBox;