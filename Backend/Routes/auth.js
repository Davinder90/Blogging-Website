import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import regix from "../regix.js";
import User from "../Database-Setup/userSchema.js";
import admin from "firebase-admin";
import {getAuth} from "firebase-admin/auth";
import serviceAccountKey from "../react-js-blog-website-47934-firebase-adminsdk-g4yza-37c5c883d4.json" with {type : "json"};

const router = express.Router();

admin.initializeApp({
    credential : admin.credential.cert(serviceAccountKey)
});

// functions
const generateUserName = async (email) => {
    let username = email.split("@")[0];

    let isUserNameNotUnique = await User.exists({ "personal_info.username": username }).then(result => result);

    isUserNameNotUnique ? username += nanoid().substring(0, 5) : ""

    return username
}

const formatDataToSend = (user) => {

    let access_token = jwt.sign({ id: user._id }, "secret_ecom");
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

router.post("/sign-up", (req, resp) => {
    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return resp.status(403).json({ "error": "Fullname length must be atleast of 3 letters long" });
    }
    if (!email.length) {
        return resp.status(403).json({ "error": "Enter Email" });
    }
    if (!regix.email_regix.test(email)) {
        return resp.status(403).json({ "error": "Email is Invalid" });
    }
    if (!regix.password_regix.test(password)) {
        return resp.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUserName(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })
        user.save().then((u) => {
            return resp.status(200).json(formatDataToSend(u));
        })
            .catch((err) => {
                if (err.code == 11000) {
                    return resp.status(500).json({ "error": "Email already exists" });
                }
                return resp.status(500).json({ "error ": err.message });
            })
    })
})


router.post("/sign-in", async (req, resp) => {
    let { email, password } = req.body;
    await User.findOne({ "personal_info.email": email }).then((user) => {
        if(!user){
            return resp.status(403).json({"error" : "Email not found"});
        }

        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err) {
                return resp.status(403).json({ "error": "Error occured while login please try again" });
            }
            if (!result) {
                return resp.status(403).json({ "error": "Incorrect password" });
            }
            else {
                return resp.status(200).json(formatDataToSend(user))
            }
        })
    });
})

router.post("/google-auth",(req,resp) => {
    const {access_token} = req.body;
    getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
        let {email, name} = decodedUser;
                
        let user = await User.findOne({"personal_info.email" : email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
        .then((user) => {
            return user || null
        })

        if(user){
            if(!user.google_auth){
                return resp.status(403).json({"error" : "This email was signed up without google. Please log in with password to access the account"});
            }
            else{
                return resp.status(200).json(formatDataToSend(user));
            }
        }
        else{
            let username = await generateUserName(email);
            user = new User({
                personal_info : {
                    fullname : name,
                    email,
                    username
                },
                google_auth : true
            });
            user.save()
            .then((u) => {
                return resp.status(200).json(formatDataToSend(user));
            })
            .catch((err) => {
                return resp.status(500).json({"error" : err.message});
            })
        }
    })
    .catch((err) => {
        return resp.status(500).json({"error" : "Faild to authenticate you with google. try with some other google account"})
    })
})

export default router;
