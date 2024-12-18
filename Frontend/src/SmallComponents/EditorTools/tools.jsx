
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

const uploadeImageByUrl = async (e) => {
    let link = new Promise((resolve,reject) => {
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })

    return link.then((url) => {
        return {
            success : 1,
            file : {url}
        }
    })
}

const uploadImageByFile = async(file) => {
    let formData = new FormData();
    formData.append("post_image",file);

    const image_link = await fetch("http://localhost:3000/upload-image/image-link", {
        method: "POST",
        headers: { Accept: "application/json" },
        body : formData
    })
    .then(resp => resp.json())
    .then(data => data)

    if(image_link.success === 1){
        return image_link;
    }
}

export const tools = {
    embed : Embed,
    list : {
        class : List,
        inlineToolbar : true
    },
    image : {
        class : Image,
        config : {
            uploader : {
                uploadByUrl : uploadeImageByUrl,
                uploadByFile : uploadImageByFile
            }
        }
    },
    header : {
        class : Header,
        config : {
            placeholder : "Type Heading...",
            levels : [2,3],
            defaultLevel : 2
        }
    },
    inlineCode : InlineCode,
    quote : Quote,
    marker : Marker
}