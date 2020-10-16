import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";
import * as firebase from 'firebase'

import {IoMdHome, IoMdMap, IoMdContact} from "react-icons/io";

import './App.css';
import Home from './screens/Home.js';
import Dashboard from './screens/Dashboard.js';
import Account from './screens/Account.js';
import { hidden } from 'kleur';

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
        <div style={{display: "flex", flexDirection: "row"}}>
            <h1 style={{marginLeft: 64, color: colors.primary, marginTop: 8, width: 600}}>Project Name</h1>
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
        <div style={{marginTop: 32, width: "100%", marginLeft: 64}}>
            <h2 style={{color: colors.secondary}}>Project Name</h2>
            <h4 style={{color: colors.dark}}>&copy; 2020 Team Rojunthony @ HackGT 2020</h4>
        </div>
    );
}

const MenuButton = (props) => {
    const history = useHistory();
    const location = useLocation();

    let color = location.pathname === props.path ? colors.primary : colors.secondary;
    let icon = null;
    if (props.pageName === "Home") {
        icon = <IoMdHome size={32} style={{alignSelf: "center", color: color}}/>;
    } else if (props.pageName === "Dashboard") {
        icon = <IoMdMap size={32} style={{alignSelf: "center", color: color}}/>;
    } else if (props.pageName === "Account") {
        icon = <IoMdContact size={32} style={{alignSelf: "center", color: color}}/>;
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