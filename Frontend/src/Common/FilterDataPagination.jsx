
const FilterData = async({create_new_arr,state,data,page,countRoute,data_to_send, eliminated_blog}) => {
    let obj;
    if(create_new_arr != false && state != null){
        obj = { ...state, results : [...state.results,...data],page};
    }
    else{
        await fetch("http://localhost:3000/blog/" + countRoute,{
            method : "POST",
            headers : {"Content-Type": "application/json", Accept: "application/json"},
            body : JSON.stringify({data_to_send, eliminated_blog})
        })
        .then((resp) => resp.json())
        .then(docs => {
            let {total_docs} = docs;
            obj = {results : data, page, total_docs};
        }) 
    }
    return obj;
}


export default FilterData;