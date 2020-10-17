import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import {IoMdCall, IoMdBook} from "react-icons/io";

import '../App.css';
import {colors} from '../App.js'

const topics = ["Response to COVID-19", "Racial Justice", "Election 2020"];



export default function Dashboard() {
    return (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680, overflowY: "scroll"}}>
                    <h1>Explore Topics</h1>
                    <div style={{display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center'}}>
                        {topics.map(topic => <TopicCard topic={topic}/>)}
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

function TopicCard(props) {
    const history = useHistory();

    return (
        <div class="topic-card">
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h2 class="link" onClick={() => history.push("/topicview/" + props.topic)}>{props.topic}</h2>
                <div style={{width: "20%", flexDirection: "row", display: "flex", padding: 8, justifyContent: "space-evenly"}}>
                    <IoMdBook class="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => history.push("/topicview/" + props.topic)}/>
                    <IoMdCall class="menu-button" size={28} style={{alignSelf: "center", color: colors.primary, borderRadius: 10, padding: 8}} onClick={() => history.push("/callscreen/" + props.topic)}/>
                </div>
            </div>
        </div>
    )
}