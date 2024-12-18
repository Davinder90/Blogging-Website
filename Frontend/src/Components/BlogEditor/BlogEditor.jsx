import styles from "./BlogEditor.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import blogger_logo from "../../assets/AppImages/blogger-logo.jpg";
import { FaImage } from "react-icons/fa";
import AnimationWrapper from "../../SmallComponents/Animation/Animation"
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../../Pages/Editor-Page/Editor";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../../SmallComponents/EditorTools/tools";
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const BlogEditor = () => {
    const navigate = useNavigate();
    const { blog, blog: { title, banner, content, tags, des }, blogState, setBlogState, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
    const {access_token}  = useSelector(store => store.userData);
    const {blog_id} = useParams();

    useEffect(() => {
        setTextEditor(new EditorJS({
            holderId: "textEditor",
            data: Array.isArray(content) ? content[0] : content,
            placeholder: "Let's write an awsome story",
            tools: tools
        }))
    }, [])

    const handleImageSelector = async (event) => {
        let img = event.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...")
            let formData = new FormData();
            formData.append("post_image",img);
            const image_link = await fetch("http://localhost:3000/upload-image/image-link", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData
            })
                .then(resp => resp.json())
                .then(data => data)

            if (image_link.success === 1) {
                toast.dismiss(loadingToast);
                setBlog({ ...blog, banner: image_link.file.url })
                toast.success("Uploaded 👍")
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    }

    const handleTitleChange = (event) => {
        let input = event.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value })
    }

    const handlePublishForm = () => {
        if (banner.length == 0) {
            return toast.error("Upload blog banner to publish it")
        }

        if (title.length == 0) {
            return toast.error("Write blog title to publish it")
        }

        if (textEditor.isReady) {
            textEditor.save()
                .then(data => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data})
                        setBlogState("publish")
                    }
                    else {
                        return toast.error("Write something in your blog to publish it")
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleSaveDraft = async(event) => {
        event.preventDefault();
        if(event.target.className.includes("disable")){
            return
        }

        if(title.length == 0){
            return toast.error("You must provide a title to save as draft");
        }

        let loadingToast = toast.loading("saving draft....");
        event.target.classList.add("disable");
        
        if(textEditor.isReady){
            textEditor.save().then(async() => {
                await fetch("http://localhost:3000/blog/create-blog",{
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json", "authorization" : `Bearer ${access_token}`},
                    body : JSON.stringify({title, des, tags, banner, content, draft : true, id : blog_id})
                })
                .then(() => {
                    event.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    toast.success("saved 👍");
        
                    setTimeout(() => {
                        navigate("/");
                    },500)
                })
                .catch((err) => {
                    event.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    toast.error(err.data.error);
                })
            })
        }
        
    }

    return <>
        <nav className={styles["navbar"]}>
            <Link to="/">
                <img src={blogger_logo} />
            </Link>
            <p>{title ? title : "New Blog"}</p>
            <div className={styles["btns-block"]}>
                <button className="dark-btn" onClick={handlePublishForm}>Publish</button>
                <button className="light-btn" onClick = {handleSaveDraft}>Save Draft</button>
            </div>
        </nav>

        <AnimationWrapper>
            <section className={styles["main"]}>
                <Toaster />
                <div className={styles["post-body"]}>
                    <div className="image-body">
                        <label htmlFor="uploadBanner">
                            {banner ? <img src={banner} /> : <span><FaImage /></span>}
                            <input
                                id="uploadBanner"
                                type="file"
                                accept=".png, .jpg, .jpeg, .webp"
                                hidden
                                onChange={handleImageSelector}
                            />
                        </label>
                    </div>
                    <textarea
                        defaultValue = {title}
                        placeholder="Blog Title"
                        className={styles["blog-title"]}
                        onKeyDown={handleKeyDown}
                        onChange={handleTitleChange}
                    />

                    <hr style={{ margin: "2px 0 15px 0", opacity: "0.4" }} />
                    <div className={styles["post-body-content"]} id="textEditor"></div>
                </div>
            </section>
        </AnimationWrapper>
    </>
}

export default BlogEditor;