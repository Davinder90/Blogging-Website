import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { blogStructure } from "../Pages/Blog-Page/BlogPage";

const blogData = createSlice({
    name : "blogData",
    initialState : {
        blog : blogStructure,
        similarBlogs : null,
        isLiked : false,
    },
    reducers : {
        setBlog : (state, action) => {
            state.blog = action.payload;
            return state;
        },
        setSimilarBlogs : (state, action) => {
            state.similarBlogs = action.payload;
            return state;
        },
        setIsLiked : (state,action) => {
            state.isLiked = action.payload;
            return state;
        }
    }
});

export default blogData;
export const blogDataActions = blogData.actions;