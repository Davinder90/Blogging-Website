import { useContext, useState } from "react";
import { getDay } from "../../Common/getDate";
import styles from "./CommentCard.module.css";
import { Link } from "react-router-dom";
import CommentField from "../../SmallComponents/CommentField/CommentField";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { commentContext } from "../../Pages/Blog-Page/BlogPage";
import { RiArrowUpWideLine, RiArrowDownWideLine, RiDeleteBin5Line } from "react-icons/ri";
import { blogDataActions } from "../../Store/blogData";

const CommentCard = ({ index, leftVal, commentData }) => {
    // console.log(index, leftVal, commentData);

    const userData = useSelector(store => store.userData);
    const { access_token } = userData;
    const dispatch = useDispatch();

    const blogData = useSelector(store => store.blogData);
    // console.log(blogData);
    const {blog ,blog : {author : {personal_info : {username : blog_author_username}}, activity, activity : {total_parent_comments,total_comments}}} = blogData;
    const {comments,comments : {results : commentsArr}, setComments, setTotalParentComment} = useContext(commentContext);
    let { comment, _id, commented_by: { personal_info: { profile_img, username, fullname } }, commentedAt } = commentData;
    const [isReply, setIsReply] = useState(false);
    const [isReplyLoaded, setIsReplyLoaded] = useState(false);
    const handleReplyBox = async () => {
        if (!access_token) {
            return toast.error("Login first to leave a reply");
        }
        setIsReply(!isReply);
    }

    const getParentIndex = () => {
        let startingPoint = index - 1;
        try{
            while(commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel){
                startingPoint--;
            }
        }
        catch{
            startingPoint = undefined;
        }
        return startingPoint;
    }

    const removeCommentsCards = (startingPoint, isdelete = false) => {
        if(commentsArr[startingPoint]){
            while(commentsArr[index].childrenLevel < commentsArr[startingPoint].childrenLevel){
                commentsArr.splice(startingPoint, 1);
                if(!commentsArr[startingPoint]){
                    break;
                }
            }
        }

        if(isdelete){
            let parentIndex = getParentIndex();
            if(parentIndex != undefined){
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id);

                if(!commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }
            commentsArr.splice(index,1);
        }

        if(commentData.childrenLevel == 0 && isdelete){
            setTotalParentComment(preVal => preVal - 1);   
        }

        setComments({results : commentsArr});
        dispatch(blogDataActions.setBlog({...blog,activity : {...activity, total_parent_comments : total_parent_comments - (commentData.childrenLevel == 0 && isdelete ? 1 : 0),total_comments : total_comments - 1}}))
    }

    const hideReply = () => {
        setIsReplyLoaded(!isReplyLoaded);
        removeCommentsCards(index + 1)
    }
    
    const fetchReply = async ({skip = 0, subReplies = false,parent_index}) => {
        if(!subReplies){
            hideReply();
        }

        if(commentData.children.length || subReplies == true){
            await fetch("http://localhost:3000/comment/get-replies",{
                method : "POST",
                headers : {"Content-Type": "application/json", Accept: "application/json"},
                body : JSON.stringify({_id : subReplies ? commentsArr[parent_index]._id : commentData._id, skip})
            })
            .then(resp => resp.json())
            .then(data => {
                let replies = data.replies;

                for(let i = 0; i < replies.length; i++){
                    if(subReplies){
                        commentsArr.splice(parent_index + 1 + i + skip,0,replies[i]);
                    }
                    else{
                        commentsArr.splice(index + 1 + i + skip,0,replies[i]);
                    }
                }
                setComments({results : commentsArr});
            })
        }
    }

    const deleteComment = async (event) => {
        event.target.setAttribute = ("disabled",true);

        await fetch("http://localhost:3000/comment/delete-comment",{
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json", "authorization" : `Bearer ${access_token}`},
            body : JSON.stringify({_id})
        })
        .then(resp => resp.json())
        .then( () => {
            event.target.removeAttribute("disabled");
            removeCommentsCards(index + 1, true)
        })
    }

    const LoadMoreReplyBtn = () => {
        let parentIndex = getParentIndex();
        let btn = <button className = {`${styles["load-more-btn"]}`} onClick = {() => {fetchReply({skip : index - parentIndex, subReplies : true, parent_index : parentIndex})}}>Load More Reply</button>;

        if(commentsArr[index + 1] && parentIndex && commentsArr[parentIndex].children.length != index - parentIndex){
            if(commentsArr[index].childrenLevel > commentsArr[index + 1].childrenLevel){
                return btn;
            }
        }
        else if(parentIndex && commentsArr[parentIndex].children.length != index - parentIndex){
            return btn;
        }
    }

    return <div style={{ paddingLeft: `${leftVal * 10}px`, marginBottom: "12px" }}>
        <div className={styles["comment-info"]}>
            <div className={styles["user-info"]}>
                <img style={{ width: "30px", height: "30px", borderRadius: "50px", marginTop: "5px" }} src={profile_img} />
                <p style={{ fontSize: "15px", width: "50%" }} className="line-clame-1">{fullname} <Link style={{ color: "black" }} to={`/user/${username}`}>@{username}</Link></p>
                <p style={{ color: "grey", fontSize: "14px" }}>{getDay(commentedAt)}</p>
            </div>
            <p className={styles["comment"]}>{comment}</p>

            <div className={styles["reply-box"]}>
                <div className={styles["sub-reply-box"]}>
                    {
                      commentData.children.length ? isReplyLoaded ? <button className={styles["btn"]} onClick = {hideReply}>Hide Reply <span><RiArrowUpWideLine /></span></button> : <button className={styles["btn"]} onClick = {fetchReply}>{commentData.children.length}Reply <span><RiArrowDownWideLine /></span></button> : null
                    }
                    <button className={styles["reply-btn"]} onClick={handleReplyBox}>Reply</button>
                </div>
                {
                    isReply ? <CommentField action={"reply"} setReplying={setIsReply} index={index} replying_to={_id} /> : null
                }
            </div>
            {
            userData.username == username || userData.username == blog_author_username ? <button className = {styles["delete-btn"]} onClick = {deleteComment}><RiDeleteBin5Line /></button> : null
        }
        </div>
        <LoadMoreReplyBtn />
    </div>
}

export default CommentCard;