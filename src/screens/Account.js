import React, {useState, useEffect} from 'react';
import { colors } from '../App';
import * as firebase from 'firebase'

import '../App.css';

export default function Account(props) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            setUser(user);
            setLogin(user !== null && user.emailVerified ? true : false);
        });
    })

    const [onLoginPage, setOnLoginPage] = useState(!(props.user && props.user.emailVerified) && !(user && user.emailVerified));
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLogin] = useState((props.user && props.user.emailVerified) || (user && user.emailVerified));

    const handleSignup = (e) => {
        e.preventDefault();
        if (!onLoginPage) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(userCredentials => {
                userCredentials.user.sendEmailVerification().then(function() {
                    firebase.auth().signOut();
                    setMessage("Please check for a verification email.");
                });
                firebase.firestore().collection('users').doc(email).set({
                    maps: [],
                });
            }).catch(error => setMessage(error.message));
        } else {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(error => setMessage(error.message));
            firebase.auth().onAuthStateChanged(user => {
                if(user && !user.emailVerified){
                    setMessage("Your email is not verified. Check your inbox.");
                } else if (user && user.emailVerified) {
                    setLogin(true);
                }
            });
        }
    }

    const signOutUser = async(e) => {
        await firebase.auth().signOut();
    }

    const resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            setMessage("Check your inbox to reset your password.");
        }).catch(function(error) {
            // An error happened.
        });
    }

    return (
        <div className="container">
            {loggedIn ? 
                <h2>Your Account</h2> 
            : 
                <h2>{onLoginPage ? "Log In" : "Sign Up"}</h2>
            }
            {loggedIn ? 
                <form onSubmit={(e) => signOutUser(e)}>
                    <input type="submit" value="Sign Out"/>
                </form>
                : 
                <div style={{marginLeft: 32}}>
                    <form onSubmit={(e) => handleSignup(e)} style={{display: "flex", flexDirection: "column"}}>
                        <h5 style={{color: colors.dark, height: 16}}>{message}</h5> 

                        <h3>Email</h3>
                        <input type="email" value={email} onChange={event => setEmail(event.target.value)} />

                        <h3>Password</h3>
                        <input type="password" value={password} onChange={event => setPassword(event.target.value)} />

                        <input type="submit" value={onLoginPage ? "Log In" : "Sign Up"}/>
                    </form>

                    {onLoginPage ?
                        <h6 style={{color: colors.dark, cursor: "pointer"}} onClick={() => setOnLoginPage(false)}>New here? Sign up.</h6>
                    :
                        <h6 style={{color: colors.dark, cursor: "pointer"}} onClick={() => setOnLoginPage(true)}>Have an account? Log in.</h6>
                    }
                    {onLoginPage ?
                        <h6 style={{color: colors.dark, cursor: "pointer"}} onClick={() => resetPassword()}>Forgot your password?</h6>
                    : null}
                </div>
            }
        </div>
    );
}