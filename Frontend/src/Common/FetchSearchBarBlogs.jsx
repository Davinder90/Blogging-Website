import FilterData from "./FilterDataPagination";

const fetchSearchBarBlogs = async(page, query, create_new_arr, blogs) => {
    let formatedData;
    await fetch("http://localhost:3000/blog/search-bar-blogs",{
        method : "POST",
        headers : {"Content-Type": "application/json", Accept: "application/json"},
        body : JSON.stringify({query : query.toLowerCase(), page})
    })
    .then((resp) => resp.json())
    .then(async (data) => {
        formatedData = await FilterData({create_new_arr, state : blogs, data : data.blogs, page, countRoute : "/search-bar-count-blogs", data_to_send : query.toLowerCase()})
    })
    .catch(err => {
        console.log(err.message);
    })
    return formatedData;
}

export default fetchSearchBarBlogs;