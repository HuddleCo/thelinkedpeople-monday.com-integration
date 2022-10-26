import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyDme1OP33ac0p8g1q62FuZDjpnT_TcNfGI',
  authDomain: 'tpl-monday-api.firebaseapp.com',
  projectId: 'tpl-monday-api',
  storageBucket: 'tpl-monday-api.appspot.com',
  messagingSenderId: '320417964931',
  appId: '1:320417964931:web:69a8f8fc2efb28daa78cb6',
  measurementId: 'G-FQDQQ9SYXS',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
