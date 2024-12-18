import { createSlice } from "@reduxjs/toolkit";

const userContext = createSlice({
    name : "userData",
    initialState : {
        username : "",
        fullname : "",
        profile_img : "",
        access_token : ""
    },
    reducers : {
        setUserAuth : (state,action) => {
            return action.payload
        }
    }
});

export default userContext;
export const userContextActions = userContext.actions;