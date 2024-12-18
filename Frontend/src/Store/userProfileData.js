import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: ""
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: {},
    joinedAt: "",
}

const userProfileData = createSlice({
    name : "userProfileData",
    initialState : {
        userProfileInfo : profileDataStructure,
        blogs : null,
        user_id : ""
    },
    reducers : {
        setBlogs : (state, action) => {
            state.blogs = action.payload;
            return state;
        },
        setUserProfileInfo : (state, action) => {
            state.userProfileInfo = action.payload;
            return state;
        },
        setUserId : (state,action) => {
            state.user_id = action.payload;
            return state;
        }
    }
});

export default userProfileData;
export const userProfileDataActions = userProfileData.actions;