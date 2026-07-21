/*
  GENCY STORE — connexion Firebase
  ---------------------------------
  Config du projet Firebase "gency-store". Ces clés ne sont pas secrètes :
  une config Firebase web est prévue pour être visible dans le code
  côté client (la sécurité se fait via les règles Firestore, pas ici).
*/

const firebaseConfig = {
  apiKey: "AIzaSyBSD_GpO3VXwqAoZPZcFViXVGcZTYkXcYQ",
  authDomain: "gency-store.firebaseapp.com",
  projectId: "gency-store",
  storageBucket: "gency-store.firebasestorage.app",
  messagingSenderId: "559669300307",
  appId: "1:559669300307:web:0068d25af8beb2e6480aa6",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
