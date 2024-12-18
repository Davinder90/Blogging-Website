import express from "express";
const router = express.Router();
import upload from "../Image-Storage-Setup/Image_storage_engine.js";

router.post("/image-link", upload.single('post_image'), (req, resp) => {
    return resp.json({
        success: 1,
        file: {
            url: `http://localhost:3000/Post_Images/${req.file.filename}`
        }
    })
})

export default router;






