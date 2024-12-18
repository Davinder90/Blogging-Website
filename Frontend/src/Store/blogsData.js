import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const blogsData = createSlice({
    name : "blogsData",
    initialState : {
        blogs : null,
        trendingBlogs : null,
        pageState : "home",
    },
    reducers : {
        setBlogs : (state, action) => {
            state.blogs = action.payload;
            return state
        },
        setTrendingBlogs : (state, action) => {
            state.trendingBlogs = action.payload;
            return state
        },
        setPageState : (state, aciton) => {
            state.pageState = aciton.payload;
            return state
        },
    }
});

export default blogsData;
export const blogsDataActions = blogsData.actions;