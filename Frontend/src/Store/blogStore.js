import { configureStore } from "@reduxjs/toolkit";
import userContext from "./userContext";
import blogsData from "./blogsData";
import searchBlogsData from "./searchBlogData";
import userProfileData from "./userProfileData";
import blogData from "./blogData";

export const store = configureStore({
    reducer : {
        userData : userContext.reducer,
        blogsData : blogsData.reducer,
        searchBlogsData : searchBlogsData.reducer,
        userProfileData : userProfileData.reducer,
        blogData : blogData.reducer
    }
}) 