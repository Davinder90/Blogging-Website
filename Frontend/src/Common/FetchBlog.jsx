
const fetchBlog = async(blog_id) => {
    let blog;
    await fetch("http://localhost:3000/blog/get-blog",{
        method : "POST",
        headers : {"Content-Type": "application/json", Accept: "application/json"},
        body : JSON.stringify({blog_id, draft : true, mode : "edit"})
    })
    .then(resp => resp.json())
    .then(data => {
        blog = data.blog;
    })
    .catch(err => {
        console.log(err);
    });
    return blog;
}

export default fetchBlog;