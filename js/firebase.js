// Firebase 앱과 Firestore DB를 연결하는 설정 파일입니다.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6l_jUya99zb6wdQbNShLe2tvaa7HAUOg",
  authDomain: "sw-project-aa5e6.firebaseapp.com",
  projectId: "sw-project-aa5e6",
  storageBucket: "sw-project-aa5e6.firebasestorage.app",
  messagingSenderId: "310952235209",
  appId: "1:310952235209:web:691d62db10f3b0d3a7bd18"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
};