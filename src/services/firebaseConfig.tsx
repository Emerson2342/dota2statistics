// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig1 = {
    apiKey: "AIzaSyDVU5NmFlyJk77nP1fJfyQS8-OuGTImYEQ",
    authDomain: "versions-a278f.firebaseapp.com",
    projectId: "versions-a278f",
    storageBucket: "versions-a278f.appspot.com",
    messagingSenderId: "546865103220",
    appId: "1:546865103220:web:06d094f66b4fcb966dec21",
    measurementId: "G-Q8ZW99K4DW"
};

const firebaseConfig2 = {
    apiKey: "AIzaSyDRknBUNYAhoBBaAkQxXvTWJ9IKonu-_0A",
    authDomain: "dota2-a2f17.firebaseapp.com",
    projectId: "dota2-a2f17",
    storageBucket: "dota2-a2f17.firebasestorage.app",
    messagingSenderId: "765970545033",
    appId: "1:765970545033:web:d9e2a477b0b2dcfb840958",
    measurementId: "G-CR41X9FLKC"
};

let app1, app2;

if (getApps().length === 0) {
    app1 = initializeApp(firebaseConfig1, "databaseVersion");
    app2 = initializeApp(firebaseConfig2, "auth");
} else {
    app1 = getApp("databaseVersion");
    app2 = getApp("auth");
}

export const auth = initializeAuth(app2, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db1 = getFirestore(app1);
export const db2 = getFirestore(app2)