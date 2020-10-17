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
    const history = useHistory();
    const topicName = location.pathname.split("/")[2];
    const elementRef = useRef();

    const endCall = () => {
        history.push('/topicview/' + topicName);
    }


    return (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680, overflowY: "scroll"}}>
                    <h1>Discussion on {topicName}</h1>
                    {connected ? 
                        <div>
                            <div style={{alignItems: "center", justifyContent: "center", display: "flex"}}>
                                <IoMdCloseCircle class="menu-button" size={32} color={colors.primary} style={{alignSelf: "center"}} onClick={() => endCall()}/>
                            </div>
                            <div style={{position: "absolute", right: 0, top: 250, width: "50%", height: "60%", background: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", overflowY: "scroll"}}>
                                <div style={{paddingBottom: "20%"}}>
                                    {allText.map(item => {
                                        let valid = !item.flags.isOpinion && item.flags.isSupported;
                                        return (
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                <div style={{background: valid ? colors.washed : item.flags.isClaim ? colors.tertiary : colors.secondary, padding: 16, borderTopRightRadius: 10, borderBottomRightRadius: 10, boxShadow: "0px 2px 20px grey", width: 256}}>
                                                    <h4 style={{margin: 4}}>{item.flags.isOpinion ? "Is this an opinion?" : ""}</h4>
                                                    <h4 style={{margin: 4}}>{item.flags.isSupported ? "" : "Is this unsupported?"}</h4>
                                                    <h4 style={{margin: 4}}>{item.flags.isClaim ? "Is the evidence factual?" : ""}</h4>
                                                </div>
                                                <h4 style={{marginLeft: 32, marginRight: 32, whiteSpace: "pre-line"}}>{item.text}</h4>
                                            </div>
                                        );
                                    })}
                                </div>
                                <form onSubmit={(e) => {
                                    if (chatText.trim().length > 0) {
                                        let flags = flagchecks.check(chatText);
                                        let arr = allText;
                                        arr.push({text: firebase.auth().currentUser.email.split("@")[0] + ": \n" + chatText, flags: flags});
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

const flagchecks = {
    check: function(text) {
        let flags = {isOpinion: false, isSupported: false, isClaim: false}

        text = text.toLowerCase();

        const isOpinionWords = ["believe", "think", "feel", "opinion", "makes sense", "wonder", "weak", "strong", "looks", "seems", "tells", "motives", "character", "should", "ought", "seriously", "like", "love", "loves", "good", "bad", "great", "terrible"];
        const isSupportedWords = ["therefore", "so", "thus", "because", "since", "warrant", "then"];
        const isClaimWords = ["known", "fact", "true", "false", "evident", "obvious", "clear", "consensus", "agreed", "evidence", "data", "certainty", "impossible"];

        text.trim().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").split(' ').forEach(word => {
            if (isOpinionWords.includes(word)) {flags.isOpinion = true;}
            if (isSupportedWords.includes(word)) {flags.isSupported = true;}
            if (isClaimWords.includes(word)) {flags.isClaim = true;}
        });
        return flags;
    }
}