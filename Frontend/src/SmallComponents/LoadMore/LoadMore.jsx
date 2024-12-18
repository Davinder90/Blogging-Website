import { useDispatch } from "react-redux";
import styles from "./LoadMore.module.css";
import { blogsDataActions } from "../../Store/blogsData";
import { SearchBlogsDataActions } from "../../Store/searchBlogData";
import { userProfileDataActions } from "../../Store/userProfileData";

const LoadMore = ({state, loadBlogFun, author, query}) => {

    const dispatch = useDispatch();

    const handlefun = async () => {
        if(query){
            let formatedData = await loadBlogFun(state.page + 1,query, false,state);
            dispatch(SearchBlogsDataActions.setSearchBlogs(formatedData));
        }
        
        else if(author){
            let formatedData = await loadBlogFun(state,author, state.page + 1);
            dispatch(userProfileDataActions.setBlogs(formatedData));
        }

        else{
            let formatedData = await loadBlogFun(state.page + 1, state);
            dispatch(blogsDataActions.setBlogs(formatedData));
        }
    }

    if(state != null && state.total_docs > state.results.length){
        return <button className = {styles["load-mr"]} onClick = {handlefun}>Load More</button>
    }
}

export default LoadMore;