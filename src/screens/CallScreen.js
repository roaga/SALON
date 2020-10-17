import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import {IoMdCall, IoMdBook, IoMdCloseCircle} from "react-icons/io";

import '../App.css';
import {colors} from '../App.js'

export default function CallScreen() {
    const [connected, setConnected] = useState(true);
    const [chatText, setChatText] = useState("");
    const [allText, setAllText] = useState([]);

    const location = useLocation();
    const topicName = location.pathname.split("/")[2];
    const elementRef = useRef();


    return (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680, overflowY: "scroll"}}>
                    <h1>Discussion on {topicName}</h1>
                    {connected ? 
                        <div style={{position: "absolute", right: 0, top: 200, width: "50%", height: "65%", background: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", overflowY: "scroll"}}>
                            <div style={{paddingBottom: "15%"}}>
                                {allText.map(text => {
                                    return (
                                        <h4 style={{marginLeft: 32, marginRight: 32, whiteSpace: "pre-line"}}>{text}</h4>
                                    );
                                })}
                            </div>
                            <form onSubmit={(e) => {
                                if (chatText.length > 0) {
                                    let arr = allText;
                                    arr.push(firebase.auth().currentUser.email.split("@")[0] + ": \n" + chatText);
                                    setAllText(arr);
                                }
                                elementRef.current.scrollIntoView();
                                setChatText("");
                                e.preventDefault();
                            }} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <input placeholder="Send a message..." value={chatText} onChange={event => setChatText(event.target.value)} style={{width: "45%", position: "fixed", bottom: "15%"}}/>
                            </form>
                            <div ref={elementRef}></div>
                        </div>
                    : <h2 style={{textAlign: "center"}}>Searching for a salon...</h2>
                    }
                </div>
            :
                <div>
                    <h1>Log In or Sign Up</h1>
                </div>
            }
        </div>
    );
}