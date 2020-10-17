import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import {IoMdCall, IoMdBook, IoMdCloseCircle} from "react-icons/io";

import '../App.css';
import {colors} from '../App.js'

export default function CallScreen() {
    const [calls, setCalls] = useState([]);

    const location = useLocation();
    const topicName = location.pathname.split("/")[2];

    return (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680, overflowY: "scroll"}}>
                    <h1>Discussion on {topicName}</h1>
                    <h2>Call info: {}</h2>
                </div>
            :
                <div>
                    <h1>Log In or Sign Up</h1>
                </div>
            }
        </div>
    );
}