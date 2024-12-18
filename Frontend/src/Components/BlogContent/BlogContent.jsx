import styles from "./BlogContent.module.css";

const Img = ({url, caption}) => {

    return <div className = {styles["img-component"]}>
        <img src = {url} className = "image-body-show"/>
        {
            caption ? <p className = {styles["img-caption"]}>{caption}</p> : ""
        }
    </div>
}

const Quote = ({quote, caption}) => {
    return <div className = {styles["quote-container"]}>
        <p className = {styles["quote"]} dangerouslySetInnerHTML={{__html : quote}}></p>
        {
            caption ? <p className = {styles["quote-caption"]}>{caption}</p> : ""
        }
    </div>
}

const List = ({style, items}) => {
    return <ul>
        {
            items.map((item,index) => {
                return <li key = {index} dangerouslySetInnerHTML={{__html : item}} className = {`${styles["list-dec"]}`}></li>
            })
        }
    </ul>
} 

const BlogContent = ({block}) => {
    const {type, data} = block;

    if(type == "paragraph"){
        return <p dangerouslySetInnerHTML={{__html : data.text}}></p>
    }

    if(type == "header"){
        if(data.level == 3){
            return <h3 dangerouslySetInnerHTML={{__html : data.text}}></h3>
        }
        return <h2 dangerouslySetInnerHTML={{__html : data.text}}></h2>
    }

    if(type == "image"){
        return <Img url = {data.file.url} caption = {data.caption}/>
    }

    if(type == "quote"){
        return <Quote quote = {data.text} caption = {data.caption}/>
    }

    if(type == "list"){
        return <List style = {data.style} items = {data.items}/>
    }
}

export default BlogContent;