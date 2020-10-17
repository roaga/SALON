import React from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, useLocation} from "react-router-dom";

import {colors} from "../App.js"
import '../App.css';

export default function Home() {
    const history = useHistory();

    return (
        <div>
            <div className="container" style={{backgroundImage: 'url(' + require('../cool-background.svg') + ')', backgroundSize: "cover", height: 1000}}>
                <h1 style={{fontSize: 72, textAlign: "right"}}>Where Progress is Made</h1>
                <h1 style={{textAlign: "right"}}>Creating Civil Debate on the Issues</h1>
                <form onSubmit={(e) => history.push("/dashboard")} style={{alignItems: "center", justifyContent: "flex-end", display: "flex"}}>
                    <input style={{fontSize: 32}} type="submit" value="Dive In"/>
                </form>
            </div>
            <div className="container" style={{backgroundImage: 'url(' + require('../cool-background-4.svg') + ')', backgroundSize: "cover"}}>
                <h1 style={{textAlign: "right", fontSize: 48}}>Bringing Back the Enlightenment</h1>
                <div style={{flexDirection: "row", display: "flex", justifyContent: "space-between", marginRight: 64}}>
                    <div style={{backgroundColor: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", padding: 16, width: "50%", marginLeft: "10%", marginTop: 100, height: 450, backgroundImage: 'url(' + require('../Salon.jpg') + ')', backgroundSize: "cover"}}></div>
                    <h1 style={{textAlign: "right", marginTop: 144}}>We look to history,<br/>gathered around<br/>progressive discourse<br/>and debate.</h1>
                </div>
            </div>
            <div className="container" style={{backgroundImage: 'url(' + require('../cool-background-1.svg') + ')', backgroundSize: "cover"}}>
                <h1 style={{textAlign: "right", fontSize: 48}}>A Quick and Casual Space</h1>
                <div style={{flexDirection: "row", display: "flex", justifyContent: "space-between", marginRight: 64}}>
                    <div style={{backgroundColor: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", padding: 16, width: "50%", marginLeft: "10%", marginTop: 100, height: 450, backgroundImage: 'url(' + require('../ExploreTopics.png') + ')', backgroundSize: "cover"}}></div>
                    <h1 style={{textAlign: "right", marginTop: 144}}>We look to today,<br/>full of content,<br/>fast<br/>and fun.</h1>
                </div>
            </div>
            <div className="container" style={{backgroundImage: 'url(' + require('../cool-background-2.svg') + ')', backgroundSize: "cover"}}>
                <h1 style={{textAlign: "right", fontSize: 48}}>Real-time, Objective Technology</h1>
                <div style={{flexDirection: "row", display: "flex", justifyContent: "space-between", marginRight: 64}}>
                    <div style={{backgroundColor: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", padding: 16, width: "50%", marginLeft: "10%", marginTop: 100, height: 450, backgroundImage: 'url(' + require('../Call.png') + ')', backgroundSize: "cover"}}></div>
                    <h1 style={{textAlign: "right", marginTop: 144}}>We look inward,<br/>to create easy<br/>and objective<br/>technology.</h1>
                </div>
            </div>
            <div className="container" style={{backgroundImage: 'url(' + require('../cool-background-3.svg') + ')', backgroundSize: "cover"}}>
                <h1 style={{textAlign: "right", fontSize: 48}}>Conversations for the Record Books</h1>
                <div style={{flexDirection: "row", display: "flex", justifyContent: "space-between", marginRight: 64}}>
                    <div style={{backgroundColor: "white", borderRadius: 10, boxShadow: "0px 2px 20px grey", padding: 16, width: "50%", marginLeft: "10%", marginTop: 100, height: 450, backgroundImage: 'url(' + require('../Collection.png') + ')', backgroundSize: "cover"}}></div>
                    <h1 style={{textAlign: "right", marginTop: 144}}>We look to the future,<br/>a space<br/>of civil discourse<br/>and intellectual debate.</h1>
                </div>
            </div>
            <div className="container" style={{backgroundImage: 'url(' + require('../cool-background-4.svg') + ')', backgroundSize: "cover"}}>
                <form onSubmit={(e) => history.push("/dashboard")} style={{alignItems: "center", justifyContent: "flex-end", display: "flex"}}>
                    <input style={{fontSize: 48}} type="submit" value="Dive In"/>
                </form>
            </div>
        </div>
    );
}