import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import {IoMdCall, IoMdBook, IoMdCloseCircle} from "react-icons/io";

import '../App.css';
import {colors} from '../App.js'

export default function TopicView() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const history = useHistory();
    const topicName = location.pathname.split("/")[2];

    useEffect(() => {
        if (firebase.auth().currentUser != null) {
            const fetchData = async() => {
                await firebase.firestore().collection('posts').where("topic", "==", topicName).get().then(query => {
                    let arr = [...posts];
                    query.forEach(doc => {
                        arr.push(doc.data());
                    });
                    setPosts(arr);
                });
            }
            fetchData();
        }
        setLoading(false)
        // setPosts([{topic: "Racial Justice", title: "Should we close prisons?", body: "Random gibberish body transcript"}])
    }, []);

    return loading ? (<div className="container"></div>) : (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680, overflowY: "scroll"}}>
                    <h1>{topicName}</h1>
                    <div style={{alignItems: "center", justifyContent: "center", display: "flex"}}>
                        <IoMdCall className="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => history.push("/callscreen/" + topicName)}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center'}}>
                        {posts.map(post => {
                            return (
                                <Post post={post} key={post.title}/>
                            );
                        })}
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
                    {props.post.body.map(item => {
                        let valid = !item.flags.isOpinion && (item.flags.isSupported || !item.flags.isClaim);
                        return (
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div className="App-logo-spin" style={{background: valid ? colors.washed : item.flags.isClaim ? colors.tertiary : colors.secondary, padding: 16, borderRadius: 10, boxShadow: "0px 2px 20px grey", width: 256, minWidth: 256, animation: valid ? "" : "App-logo-spin infinite 0.4s alternate ease-in-out"}}>
                                    <h4 style={{margin: 4}}>{item.flags.isOpinion ? "Is this an opinion?" : ""}</h4>
                                    <h4 style={{margin: 4}}>{item.flags.isSupported || !(item.flags.isOpinion || item.flags.isClaim) ? "" : "Is this unsupported?"}</h4>
                                    <h4 style={{margin: 4}}>{item.flags.isClaim ? "Is the evidence factual?" : ""}</h4>
                                </div>
                                <h4 style={{marginLeft: 32, marginRight: 32, whiteSpace: "pre-line"}}>{item.text}</h4>
                            </div>
                        );
                    })}
                </div>
            </div>) : null;
    }

    return (
        <div className="topic-card">
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <div>
                    <h2 className="link" onClick={() => setArticleVisible(!articleVisible)}>{props.post.title}</h2>
                    <h5>{props.post.users.map(user => user.split("@")[0]).join(", ")}</h5>
                </div>
                <div style={{width: "20%", flexDirection: "row", display: "flex", padding: 8, justifyContent: "space-evenly"}}>
                    <IoMdBook className="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => setArticleVisible(!articleVisible)}/>
                </div>
            </div>
            <ArticleCard/>
        </div>
    )
}