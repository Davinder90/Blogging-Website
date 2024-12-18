import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import key from "./Database-Setup/databasekey.js";
import auth from "./Routes/auth.js";
import image_link from "./Routes/image_link.js";
import blog from "./Routes/blog.js";
import user from "./Routes/user.js";
import comment from "./Routes/comment.js";

const PORT = 3000;
const app = express();


app.use(express.json());
app.use(cors());
app.use("/auth",auth);
app.use("/upload-image",image_link);
app.use("/blog",blog);
app.use("/user/",user);
app.use("/comment/",comment);
app.use('/Post_Images',express.static('Image-Storage-Setup/Upload_Images/Post_Images'));
mongoose.connect(key, { autoIndex: true });


app.listen(PORT, err => {
    if (!err) {
        console.log("connection is succesfull")
    }
})
