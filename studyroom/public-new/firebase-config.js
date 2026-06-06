import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
getFirestore
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
apiKey:"AIzaSyDGsE--_-3CDltySOnafzLOlIFSk3poamA",
authDomain:"mindzy-study-room.firebaseapp.com",
projectId:"mindzy-study-room",
storageBucket:"mindzy-study-room.firebasestorage.app",
messagingSenderId:"911061994901",
appId:"1:911061994901:web:a3668b07142bc6ac033a9c"
};

const app =
initializeApp(firebaseConfig);

export const db =
getFirestore(app);