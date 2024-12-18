
export const fetchComments = async(skip, blog_id) => {
    let res;

    await fetch("http://localhost:3000/comment/get-blog-comments",{
        method : "POST",
        headers : {"Content-Type": "application/json", Accept: "application/json"},
        body : JSON.stringify({blog_id, skip})
    })
    .then(resp => resp.json())
    .then(data => {
        res = data;
    }) 
    return res;
}
