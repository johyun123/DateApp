import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
    } from "firebase/auth";

import { getStorage } from "firebase/storage"

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
    } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA7ljRGsgvFA3PwbARcwoi-ihAlXcYc_So",
  authDomain: "dateapp-4d5ef.firebaseapp.com",
  projectId: "dateapp-4d5ef",
  storageBucket: "dateapp-4d5ef.firebasestorage.app",
  messagingSenderId: "506283715984",
  appId: "1:506283715984:web:21aa6738115a30929bd715",
  measurementId: "G-QZSHTF8Z82"
};

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)}
    );

export const db = getFirestore(app);
export const storage = getStorage(app)

export const firebaseAuth = {
    signUp: async (email, pw) => {
        const userCreate = await createUserWithEmailAndPassword(auth, email, pw)
        return userCreate.user.uid
        },
    login: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    logout: () => signOut(auth),
    onChange: (callback) => onAuthStateChanged(auth, callback)
    };


export const firestoreDB = {
    getAllUsers: ()=> getDocs(collection(db, "users")),
    addUserData: (uid, data) => addDoc(collection(db, "users"), {uid, ...data}),
    updateUserData: (docId, data) => updateDoc(doc(db,"users", docId), data),

    addService: (uid, data) => addDoc(collection(db, "services"), {uid, ...data}),
    getAllServices: ()=> getDocs(collection(db, "services")),

    getAllTrades: ()=> getDocs(collection(db, "trades")),
    addTrades: (uid, data)=> addDoc(collection(db, "trades"), {uid, ...data}),
    deleteTrade: (docId) => deleteDoc(doc(db, "trades", docId)),

    deleteUserData: (docId) => deleteDoc(doc(db, "users", docId))
    };
