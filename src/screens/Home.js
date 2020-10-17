import React from 'react';

import {colors} from "../App.js"
import '../App.css';

export default function Home() {
    return (
        <div className="container" style={{backgroundImage: 'url(' + require('../cool-background.svg') + ')', backgroundSize: "cover"}}>
            <h1 style={{fontSize: 72, textAlign: "right"}}>Where Progress is Made</h1>
            <h1 style={{textAlign: "right"}}>Objectively encouraging debate on the most important issues</h1>
        </div>
    );
}