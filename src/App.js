import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'
import { hidden } from 'kleur';

import {IoMdHome, IoMdCompass, IoMdContact} from "react-icons/io";

import './App.css';
import Home from './screens/Home.js';
import Dashboard from './screens/Dashboard.js';
import Account from './screens/Account.js';
import TopicView from "./screens/TopicView.js"
import CallScreen from "./screens/CallScreen.js"
import Dictaphone from './screens/Dictaphone';

var firebaseConfig = {
    apiKey: "AIzaSyBt0pzMeybs4DrPnt__eRlOO7ZcjtNZs8A",
    authDomain: "hackgt2020-2fa8a.firebaseapp.com",
    databaseURL: "https://hackgt2020-2fa8a.firebaseio.com",
    projectId: "hackgt2020-2fa8a",
    storageBucket: "hackgt2020-2fa8a.appspot.com",
    messagingSenderId: "294872934135",
    appId: "1:294872934135:web:2b45e58d263ed30213d5f2"
};
firebase.initializeApp(firebaseConfig);

export default function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            setUser(user);
        });
    })

    return (
        <Router>
            <NavBar/>

            <div>    
                {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route path="/account">
                        <Account user={user}/>
                    </Route>
                    <Route exact path="/topicview/:id">
                        <TopicView/>
                    </Route>
                    <Route exact path="/callscreen/:id">
                        <CallScreen/>
                    </Route>
                    <Route exact path="/dictaphone">
                        <Dictaphone/>
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>

            <Footer/>
        </Router>
    );
}

function NavBar() {
    return (
        <div style={{display: "flex", flexDirection: "row", boxShadow: "0px 2px 20px grey", borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
            <h1 style={{marginLeft: 64, color: colors.primary, marginTop: 8, width: 600}}>SALON</h1>
            <div style={{width: "100%", justifyContent: "flex-end", display: "flex"}}>
                <div style={{width: "50%", flexDirection: "row", display: "flex", padding: 8, justifyContent: "space-evenly"}}>
                    <MenuButton path="/" pageName="Home"/>
                    <MenuButton path="/dashboard" pageName="Dashboard"/>
                    <MenuButton path="/account" pageName="Account"/>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <div style={{marginTop: 16, width: "100%", alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>
            <h4 style={{color: colors.secondary}}>SALON</h4>
            <h5 style={{color: colors.dark, marginTop: 0}}>&copy; 2020 Rohan Agarwal, Arjun Verma, Anthony Wong</h5>
        </div>
    );
}

const MenuButton = (props) => {
    const history = useHistory();
    const location = useLocation();

    let color = location.pathname === props.path ? colors.primary : colors.secondary;
    let shadow = location.pathname === props.path ? "0px 1px 10px grey" : "0px 0px 0px grey";
    let icon = null;
    if (props.pageName === "Home") {
        icon = <IoMdHome size={28} style={{alignSelf: "center", color: color, borderRadius: 10, padding: 8, boxShadow: shadow}}/>;
    } else if (props.pageName === "Dashboard") {
        icon = <IoMdCompass size={28} style={{alignSelf: "center", color: color, borderRadius: 10, padding: 8, boxShadow: shadow}}/>;
    } else if (props.pageName === "Account") {
        icon = <IoMdContact size={28} style={{alignSelf: "center", color: color, borderRadius: 10, padding: 8, boxShadow: shadow}}/>;
    }

    return(
        <div className="menu-button" onClick={() => history.push(props.path)}>
            {icon}
        </div>
    );
}

export const colors = {
    primary: "orange",
    secondary: "#FCB5B5",
    tertiary: "#FCDDF2",
    washed: "#FAF6F6",
    dark: "#916953"
}