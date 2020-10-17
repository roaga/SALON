import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import {IoMdCall, IoMdBook, IoMdCloseCircle} from "react-icons/io";

import '../App.css';
import {colors} from '../App.js'

export default function TopicView() {
    const [posts, setPosts] = useState([]);

    const location = useLocation();
    const history = useHistory();
    const topicName = location.pathname.split("/")[2];

    useEffect(() => {
        if (firebase.auth().currentUser != null) {
            const fetchData = async() => {
                await firebase.firestore().collection('posts').where("topic", "==", topicName).get().then(query => {
                    let arr = posts;
                    query.forEach(doc => {
                        arr.push(doc.data());
                    });
                    setPosts(arr);
                });
            }
            fetchData();
        }
        // setPosts([{topic: "Racial Justice", title: "Should we close prisons?", body: "Random gibberish body transcript"}])
    }, []);

    return (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680, overflowY: "scroll"}}>
                    <h1>{topicName}</h1>
                    <div style={{alignItems: "center", justifyContent: "center", display: "flex"}}>
                        <IoMdCall className="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => history.push("/callscreen/" + topicName)}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center'}}>
                        {posts.map(post => {
                            console.log(post)
                            return (
                                <Post post={post}/>

                            );
                        })}
                        <Post post={{title: "erf", body: "ergoer"}}/>
                    </div>
                </div>
            :
                <div>
                    <h1>Log In or Sign Up</h1>
                </div>
            }
        </div>
    );
}

function Post(props) { 
    const [articleVisible, setArticleVisible] = useState(false);

    function ArticleCard() {
        return articleVisible ? (
            <div style={{width: "100%", height: "100%", backgroundColor: "rgba(10, 10, 10, 0.5)", position: "absolute", top: 0, left: 0}}>
                <div style={{height: "100%", width: "60%", borderRadius: 10, paddingLeft: 32, paddingRight: 32, backgroundColor: "white", position: "absolute", left: "20%"}}>
                    <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                        <h1>{props.post.title}</h1>
                        <IoMdCloseCircle className="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => setArticleVisible(false)}/>
                    </div>
                    <h5>TODO: body rendering</h5>
                </div>
            </div>) : null;
    }

    return (
        <div className="topic-card">
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h2 className="link" onClick={() => setArticleVisible(!articleVisible)}>{props.post.title}</h2>
                <div style={{width: "20%", flexDirection: "row", display: "flex", padding: 8, justifyContent: "space-evenly"}}>
                    <IoMdBook className="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => setArticleVisible(!articleVisible)}/>
                </div>
            </div>
            <ArticleCard/>
        </div>
    )
}