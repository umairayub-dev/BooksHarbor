import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCTJ3H02HIupvbxsGQcv3Ua5ZWeGWo5SQ8",
  authDomain: "mflixi.firebaseapp.com",
  projectId: "mflixi",
  storageBucket: "mflixi.appspot.com",
  messagingSenderId: "653343281045",
  appId: "1:653343281045:web:ed580585c0ae02390af09c",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
