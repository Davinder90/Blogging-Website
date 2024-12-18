import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination : "./Image-Storage-Setup/Upload_Images/Post_Images",
    filename : (req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage : storage});
export default upload;

