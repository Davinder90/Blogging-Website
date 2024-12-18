import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Editor.module.css";
import BlogEditor from "../../Components/BlogEditor/BlogEditor";
import PublishForm from "../../Components/PublishForm/PublishForm";
import UserAuthForm from "../../Components/UserAuthForm/UserAuthForm"
import { Navigate, useParams } from "react-router-dom";
import { createContext } from "react";
import Loader from "../../SmallComponents/Loader/Loader";
import fetchBlog from "../../Common/FetchBlog";

const BlogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} }
}

export const EditorContext = createContext({});

const Editor = () => {

    const {blog_id} = useParams();
    const [blogState, setBlogState] = useState("editor");
    const [blog, setBlog] = useState(BlogStructure);
    const [textEditor,setTextEditor] = useState({isReady : false});
    const userData = useSelector(store => store.userData);
    const [loading, setLoading] = useState(true);

    const handleBlog = async () => {
        setBlog(BlogStructure);
        await fetchBlog(blog_id)
            .then(data => {
                setBlog(data);
                setLoading(false)
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }

    useEffect(() => {
        if(!blog_id){
            setLoading(false);
        }
        else{
            handleBlog()
        }
    },[])
    
    return <>
        <EditorContext.Provider value = {{blogState,setBlogState,blog,setBlog,textEditor,setTextEditor}}>
            {userData.access_token == null ?
                <Navigate to="/sign-in" /> :
                loading ? <div className="loader-container"><Loader /></div> : <div className={styles["container"]}>
                    {
                        blogState === "editor" ? <BlogEditor /> : <PublishForm />
                    }
                </div>
            }
        </EditorContext.Provider>
    </>
}

export default Editor;