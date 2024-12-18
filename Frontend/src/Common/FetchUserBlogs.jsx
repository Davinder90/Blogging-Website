import FilterData from "./FilterDataPagination";


const fetchUserBlogs = async(blogs, user_id, page) => {
    let formatedData;
    await fetch("http://localhost:3000/blog/search-bar-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({author : user_id , page})
    })
        .then((resp) => resp.json())
        .then(async (data) => {
            formatedData = await FilterData({state : blogs, data : data.blogs, page, countRoute : "/search-bar-count-blogs", data_to_send : {author : user_id}})
        })
        .catch(err => {
            console.log(err);
        })

    return formatedData;
}

export default fetchUserBlogs;