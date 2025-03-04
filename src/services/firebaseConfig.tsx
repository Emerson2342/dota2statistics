// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig2 = {
    apiKey: "AIzaSyDRknBUNYAhoBBaAkQxXvTWJ9IKonu-_0A",
    authDomain: "dota2-a2f17.firebaseapp.com",
    projectId: "dota2-a2f17",
    storageBucket: "dota2-a2f17.firebasestorage.app",
    messagingSenderId: "765970545033",
    appId: "1:765970545033:web:d9e2a477b0b2dcfb840958",
    measurementId: "G-CR41X9FLKC"
};

let app2;

if (getApps().length === 0) {
    app2 = initializeApp(firebaseConfig2, "auth");
} else {
    app2 = getApp("auth");
}

export const auth = initializeAuth(app2, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app2)