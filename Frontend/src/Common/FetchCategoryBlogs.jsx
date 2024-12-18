import FilterData from "./FilterDataPagination";

const fetchCategoryBlogs = async(page, pageState, blogs, eliminated_blog, create_new_arr) => {
    let formatedData;
    await fetch("http://localhost:3000/blog/search-blogs",{
        method : "POST",
        headers : {"Content-Type": "application/json", Accept: "application/json"},
        body : JSON.stringify({tags : pageState, page, eliminated_blog})
    })
    .then((resp) => resp.json())
    .then(async (data) => {
        formatedData = await FilterData({ create_new_arr, state : blogs, data : data.blogs, page, countRoute : "/search-count-blogs", data_to_send : pageState, eliminated_blog})
    })
    .catch(err => {
        console.log(err.message);
    })
    return formatedData;
}

export default fetchCategoryBlogs;