import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const searchBlogsData = createSlice({
    name : "SearchBlogsData",
    initialState : {
        searchBlogs : null,
        searchUsers : null
    },
    reducers : {
        setSearchBlogs : (state, action) => {
            state.searchBlogs = action.payload;
            return state
        },
        setSearchUsers : (state, action) => {
            state.searchUsers = action.payload;
            return state
        }
    }
});

export default searchBlogsData;
export const SearchBlogsDataActions = searchBlogsData.actions;