import { useState, useRef, useEffect } from "react";
import styles from "./InPageNavigation.module.css";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({ routes, defaultHidden = ["trending blogs"], defaultActiveIndex = 0, children }) => {
    // const windowWidth = useRef(window.innerWidth);

    // hr tag
    activeTabLineRef = useRef();
    // bydefault button reference 
    activeTabRef = useRef();
    // index state for color change
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const handleNavChange = (btn, index) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
        setInPageNavIndex(index);
    }

    useEffect(() => {
        handleNavChange(activeTabRef.current, defaultActiveIndex)
    }, [])

    return <>
        <div className={styles["navs-container"]}>
            {routes.map((route, index) => {
                return (
                    <button
                        key={index}
                        ref={index == defaultActiveIndex ? activeTabRef : null}
                        className={`${styles["nav-btn"]} ${index == inPageNavIndex ? "text-black" : "text-grey"} ${defaultHidden.includes(route) ? "nav-display" : ""}`}
                        onClick={(event) => { handleNavChange(event.target, index) }}
                    >{route}</button>
                )
            })}
            <hr ref={activeTabLineRef} />
        </div>
        {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
}

export default InPageNavigation;