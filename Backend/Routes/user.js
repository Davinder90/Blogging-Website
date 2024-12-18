import express from "express";
import jwt from "jsonwebtoken";
import User from "../Database-Setup/userSchema.js";

const router = express.Router();

const verifyJWT = (req, resp, next) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return resp.status(403).json({ "error": "No Access token" });
    }
    else {
        try {
            let data = jwt.verify(token, "secret_ecom");
            req.user = data;
            next();
        }
        catch (err) {
            return resp.status(403).json({ "error": "Access token is invalid" });
        }
    }
}

router.post("/search-users",(req, resp) => {
    
    let {query} = req.body;
    User.find({"personal_info.username" : new RegExp(query, 'i')})
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then((users) => {
        resp.status(200).json({users})
    })
    .catch((err) => {
        resp.status(500).json({"error" : err.message});
    });
});

router.post("/get-profile",(req, resp)  => {
    let {username} = req.body;

    User.findOne({"personal_info.username" : username})
    .select("-personal_info.password -google_auth -updatedAt -blogs")
    .then((user) => {
        resp.status(200).json({user})
    })
    .catch((err) => {
        resp.status(500).json({"error" : err.message});
    });
})

export default router;
