import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import '../App.css';
import {colors} from '../App.js'

export default function Dashboard() {

    return (
        <div className="container">
            {firebase.auth().currentUser != null ?
                <div style={{width: "100%", height: 680, minHeight: 680}}>

                </div>
            :
                <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <h2>Log In or Sign Up</h2>
                </div>
            }
        </div>
    );
}