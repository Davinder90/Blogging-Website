import FilterData from "./FilterDataPagination";

const fetchLatestBlogs = async (page,blogs,create_new_arr) => {
    let formatedData;
    await fetch("http://localhost:3000/blog/latest-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ page })
    })
        .then(resp => resp.json())
        .then(async data => {
            formatedData = await FilterData({create_new_arr, state: blogs, data: data.blogs, page, countRoute: "/all-latest-count-blogs" });
        })
        .catch(err => {
            console.log(err);
        })
    return formatedData;
}

export default fetchLatestBlogs;