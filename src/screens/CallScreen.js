import React, {useState, useEffect, useRef, useCallback, Fragment,} from 'react';
import socketIOClient from 'socket.io-client'
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import * as firebase from 'firebase'

import { IoMdCall, IoMdBook, IoMdCloseCircle } from "react-icons/io";

import '../App.css';
import { colors } from '../App.js'

export default function CallScreen() {
    const [connected, setConnected] = useState(true);
    const [chatText, setChatText] = useState("");
    const [allText, setAllText] = useState([]);
    const [started, setStarted] = useState(false);
    const [oldTranscript, setOldTranscript] = useState("");
    const [transcriptIndex, setTranscriptIndex] = useState(-1);
    const [timeSinceSpoke, setTimeSinceSpoke] = useState(0);
    const [hasSpoken, setHasSpoken] = useState(false);
    const [users, setUsers] = useState(["ro.agarwal@hotmail.com", "arjun11verma@gmail.com"]);
    var key = 0;

    const interval = useRef(undefined);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const location = useLocation();
    const history = useHistory();
    const topicName = location.pathname.split("/")[2];
    const elementRef = useRef();

    const [audioBLOB, setAudioBLOB] = useState(2)
    const serverPort = 3001;

    const endCall = () => {
        if (allText.length > 0) {
            firebase.firestore().collection('posts').add({
                topic: topicName,
                users: users,
                timestamp: Date.now(),
                body: allText,
                title: topicName + " - " + (new Date).toString().split(' ').splice(0, 4).join(' ')
            });
        }
        history.push('/topicview/' + topicName);
    }

    //Custom hook
    function useInterval(callback, delay) {
        const savedCallback = useRef();
      
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
    }

    // Set interval
    interval.current = useInterval(() => {
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            return <h1>This browser is not supported.<br/>We recommend Google Chrome.</h1>
        } else {
            SpeechRecognition.startListening({continuous: true});
        
            if (oldTranscript.trim() === transcript.trim()) {
                setTimeSinceSpoke(timeSinceSpoke + 0.5);
            } else {
                setTimeSinceSpoke(0);
            }

            if (timeSinceSpoke >= 1.5 && oldTranscript.trim() === transcript.trim() && hasSpoken) {
                if (transcript.length > 0) {
                    resetTranscript();
                }
                setOldTranscript("");
            }
            if(transcript.trim().length > 0 && oldTranscript.trim() !== transcript.trim()) {
                let arr = allText;
                if (timeSinceSpoke > 1.5 || !hasSpoken) {
                    let oldText = transcriptIndex >= 0 ? arr[transcriptIndex].text : "";
                    arr.push({text: firebase.auth().currentUser.email.split("@")[0] + ": \n" + transcript.replace(oldText, ""), flags: []});
                    setTranscriptIndex(arr.length - 1);
                    let flags = flagchecks.check(transcript);
                    arr[arr.length - 1].flags = flags;
                } else {
                    let flags = flagchecks.check(transcript);
                    let oldText = arr[transcriptIndex].text;
                    arr[transcriptIndex].text = firebase.auth().currentUser.email.split("@")[0] + ": \n" + transcript.startsWith(oldText) ? transcript : oldText + " " + transcript;
                    arr[transcriptIndex].flags = flags;
                }
                setHasSpoken(true);
                setAllText(arr);
                setOldTranscript(transcript);
            } 
        }
    }, 500);

    // socket.on('new comment', data => {
    //     if(data !== undefined || data !== null) {
    //         let arr = allText;
    //         var check = true;

    //         for(var i = data.length - 1; i > 0; i--) {
    //             for(var j = 0; j < arr.length; j++) {
    //                 if(arr[j].text === data[i].user.split("@")[0] + ": \n" + data[i].content) {
    //                     check = false;
    //                     break;
    //                 }
    //             }
    //             if(check) {
    //                 let flags = flagchecks.check(data[i].content);
    //                 arr.push({ text: data[i].user.split("@")[0] + ": \n" + data[i].content, flags: flags });

    //                 setAllText(arr);
    //                 setConnected(keyInc());

    //                 console.log(allText);
    //             } else {
    //                 break;
    //             }
    //         }
    //     }
    // });

    var user = firebase.auth().currentUser

    // if (user != null) {
    //     socket.emit('passUsername', user.email);
    // }

    // const addTrancsript = (transcriptData) => {
    //     var fulldata = {'user': user.email, 'transcript': transcriptData};
    //     socket.emit('transcript data', fulldata);
    // }

    // var interval;

    // const sendAudio = (audioBinData) => {
    //     interval = setInterval(() => {
    //         socket.emit('get audio', {'user': user.email, 'audioData': audioBinData});
    //     }, 1000);
    // }

    // const endAudio = () => {
    //     clearInterval(interval);
    // }

    // const keyInc = () => {
    //     key += 1;
    //     return key;
    // }

    return (
        <div className="container" style={{backgroundImage: 'url(' + require('../cool-background-2.svg') + ')', backgroundSize: "cover"}}>
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 750, minHeight: 750, overflowY: "hidden"}}>
                    <div style={{alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row"}}>
                        <IoMdCloseCircle class="menu-button" size={32} color={colors.primary} style={{marginLeft: 64}} onClick={() => endCall()}/>
                        <h1 style={{textAlign: "right"}}>Discussion on {topicName}</h1>
                    </div>
                    {connected ? 
                        <div>
                            <div style={{position: "absolute", right: 0, top: 200, width: "50%", height: "65%", background: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", overflowY: "scroll"}}>
                                <div style={{paddingBottom: "20%"}}>
                                    {allText.map(item => {
                                        let valid = !item.flags.isOpinion && (item.flags.isSupported || !item.flags.isClaim);
                                        return (
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                <div className="App-logo-spin" style={{background: valid ? colors.washed : item.flags.isClaim ? colors.tertiary : colors.secondary, padding: 16, borderTopRightRadius: 10, borderBottomRightRadius: 10, boxShadow: "0px 2px 20px grey", width: 256, minWidth: 256, animation: valid ? "" : "App-logo-spin infinite 0.4s alternate ease-in-out"}}>
                                                    <h4 style={{margin: 4}}>{item.flags.isOpinion ? "Is this an opinion?" : ""}</h4>
                                                    <h4 style={{margin: 4}}>{item.flags.isSupported || !(item.flags.isOpinion || item.flags.isClaim) ? "" : "Is this unsupported?"}</h4>
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

                                        // socket.emit('comment', { 'user': user, 'content': chatText });
                                    }
                                    elementRef.current.scrollIntoView();
                                    setChatText("");
                                    e.preventDefault();
                                }} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    <input placeholder="Send a message..." value={chatText} onChange={event => setChatText(event.target.value)} style={{width: "45%", position: "fixed", bottom: "15%"}}/>
                                </form>
                                <div ref={elementRef} style={{width: 1}}></div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", marginTop: 16}}>
                                {users.map(user => {
                                    let speaking = timeSinceSpoke < 1.5;
                                    return (
                                        <div style={{background: colors.primary, borderRadius: 10, boxShadow: "0px 2px 20px grey", width: "20%", height: "20%", padding: 64, margin: 64, justifyContent: "space-evenly", textAlign: "center", animation: speaking ? "App-logo-spin infinite 0.4s alternate ease-in-out" : ""}}>
                                            <h2>{user.split("@")[0]}</h2>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        : <h2 style={{ textAlign: "center" }}>Searching for a salon...</h2>
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
    check: function (text) {
        let flags = { isOpinion: false, isSupported: false, isClaim: false }

        text = text.toLowerCase();

        const isOpinionWords = ["believe", "think", "feel", "opinion", "makes sense", "wonder", "weak", "strong", "looks", "seems", "tells", "motives", "character", "should", "ought", "seriously", "like", "love", "loves", "good", "bad", "great", "terrible"];
        const isSupportedWords = ["therefore", "so", "thus", "because", "since", "warrant", "then"];
        const isClaimWords = ["known", "know", "fact", "true", "false", "evident", "obvious", "clear", "consensus", "agreed", "evidence", "data", "certainty", "impossible", "right", "wrong"];

        text.trim().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").split(' ').forEach(word => {
            if (isOpinionWords.includes(word)) { flags.isOpinion = true; }
            if (isSupportedWords.includes(word)) { flags.isSupported = true; }
            if (isClaimWords.includes(word)) { flags.isClaim = true; }
        });
        return flags;
    }
}