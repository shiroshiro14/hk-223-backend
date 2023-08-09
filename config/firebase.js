import { initializeApp } from "firebase/app";
export const firebaseConfig = {
    apiKey: "AIzaSyAWy9of_09D7QfHGQC8xUUAOcYoUNQCp9w",
    authDomain: "smarthouse-5d1ad.firebaseapp.com",
    databaseURL:
      "https://smarthouse-5d1ad-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smarthouse-5d1ad",
    storageBucket: "smarthouse-5d1ad.appspot.com",
    messagingSenderId: "937639420667",
    appId: "1:937639420667:web:6acc1a22c8913d821ac65e",
    measurementId: "G-L94LDPM10Z",
};
 export const firebaseDb = initializeApp(firebaseConfig);