
const fetchTrendingBlogs = async (create_new_arr) => {
    let blogs;
    await fetch("http://localhost:3000/blog/trending-blogs")
        .then(resp => resp.json())
        .then(data => {
            blogs = data.blogs;
        })
        .catch(err => {
            console.log(err);
        })
    return blogs;
}

export default fetchTrendingBlogs;