import Users from '../models/userModel.js';
import { getAuth, signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword } from "firebase/auth";
import {firebaseDb} from "../config/firebase.js";

export const userLogin = async (req, res,next) =>{

    const {email, password} = req.body;
    console.log("user login")
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const newUser = Users.getById(user.uid)
            res.status(200).send({
                ...JSON.parse(newUser.toString()),
                accessToken: user.accessToken,
                message: 'success',
            })
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error:', errorCode, errorMessage)
        });
}

export const userLogout = async (req, res, next) =>{
    const auth = getAuth();
    await signOut(auth).then(() => {
        res.status(200).send({
            message: 'Log out successfully',
        })
    }).catch((error) => {
        res.status(401).send({
            ...error.message,

            message: 'error',
        })
    });
}

export const userSignup = async (req,res,next) => {
    const {email, password, name, photoUrl, phoneNumber} = req.body;
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const newUser = new User(user.uid,email,name,photoUrl, phoneNumber);
            newUser.save();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
}