import styles from "./PublishForm.module.css";
import AnimationWrapper from "../../SmallComponents/Animation/Animation.jsx";
import { toast, Toaster } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useContext } from "react";
import { EditorContext } from "../../Pages/Editor-Page/Editor.jsx";
import Tag from "../../SmallComponents/Tag/Tag.jsx";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


const PublishForm = () => {
    let characterLimit = 200;
    let tagLimit = 10;

    const navigate = useNavigate();
    const { blog_id } = useParams();

    const { access_token } = useSelector(store => store.userData);
    console.log(access_token);
    const { blog, blog: { title, banner, content, tags, des }, blogState, setBlogState, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
    const handleCloseEvent = () => {
        setBlogState("editor");
    }

    const handelBlogTitleChange = (event) => {
        setBlog({ ...blog, title: event.target.value })
    }

    const handelBlogDesChange = (event) => {
        setBlog({ ...blog, des: event.target.value })
    }

    const handleKeyDown = (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    }

    const handleNewTag = (event) => {
        if (event.keyCode == 13 || event.keyCode == 188) {
            event.preventDefault();

            let tag = event.target.value;
            tag = tag.trim();
            if (tags.length < tagLimit) {
                if (!tags.includes(tag.toLowerCase()) && tag.length) {
                    setBlog({ ...blog, tags: [...tags, tag.toLowerCase()] })
                }
            }
            else {
                toast.error("Tag limit exceeds")
            }
            event.target.value = "";
        }
    }

    const handlePublishForm = async (event) => {
        event.preventDefault();
        if (event.target.className.includes("disable")) {
            return
        }

        if (title.length == 0) {
            return toast.error("You must provide a title to publish the blog");
        }

        if (des.length == 0 || des.length > characterLimit) {
            return toast.error("You must provide a description under 200 characters");
        }

        if (tags.length == 0 || tags.length > tagLimit) {
            return toast.error("Enter at least 1 tag to help us rank your blog");
        }

        let loadingToast = toast.loading("Publishing....");
        event.target.classList.add("disable");

        await fetch("http://localhost:3000/blog/create-blog", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json", "authorization": `Bearer ${access_token}` },
            body: JSON.stringify({ title, des, tags, banner, content, draft: false, id: blog_id })
        })
            .then(() => {
                if (blog_id) {
                    event.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    toast.success("Updated 👍");
                }
                else {
                    event.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    toast.success("Published 👍");
                }

                setTimeout(() => {
                    navigate("/");
                }, 500)
            })
            .catch((err) => {
                event.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                toast.error(err.data.error);
            })
    }

    return <AnimationWrapper>
        <section className={styles["container"]}>
            <Toaster />
            <button className={styles["close"]} onClick={handleCloseEvent}>
                <span><MdClose /></span>
            </button>
            <div className={styles["publish-container-1"]}>
                <p className={styles["preview"]}>Preview</p>
                <div className={styles["ic"]} >
                    <div className="image-body-show">
                        <img src={banner} />
                    </div>
                </div>
                <h1>
                    {title}
                </h1>

                <p className={styles["des"]}>{des}</p>
            </div>

            <div className={styles["publish-container-2"]}>
                <p className={styles["blog-t"]}>Blog Title</p>
                <input
                    className={styles["blog-t-input"]}
                    placeholder="Blog Title"
                    defaultValue={title}
                    type="text"
                    onChange={handelBlogTitleChange}
                />

                <p className={styles["blog-sd"]}>Short description about your blog</p>
                <textarea
                    maxLength={characterLimit}
                    className={styles["blog-sd-input"]}
                    defaultValue={des}
                    onChange={handelBlogDesChange}
                    onKeyDown={handleKeyDown}
                />
                <p className={styles["ch-limit"]}>{characterLimit - des.length} characters left</p>

                <p style={{ marginTop: "30px" }}>Topics - (Helps is searching and ranking your blog post)</p>

                <div className={styles["tag-area"]} style={{ position: "relative", padding: "10px 15px" }}>
                    <input
                        type="text"
                        placeholder="Topic"
                        className={styles["tags-input"]}
                        onKeyDown={handleNewTag}
                    />
                    {
                        tags.map((tag, i) => {
                            return <Tag tag={tag} tagIndex={i} key={i} />
                        })
                    }
                </div>
                <p className={styles["ch-limit"]} style={{ marginTop: "5px" }}>{tagLimit - tags.length} tags left</p>

                <button className="dark-btn" style={{ marginTop: "50px" }} onClick={handlePublishForm}>Publish</button>
            </div>
        </section>
    </AnimationWrapper>
}

export default PublishForm;