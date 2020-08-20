import * as Firebase from 'firebase';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBe3qU4656XtQOx0-VrEcsLBgVBRWnxaWk',
  authDomain: 'markit-india.firebaseapp.com',
  databaseURL: 'https://markit-india.firebaseio.com',
  projectId: 'markit-india',
  storageBucket: 'markit-india.appspot.com',
  messagingSenderId: '332525632914',
  appId: '1:332525632914:web:11cb7ee286b5eafaf8d54b',
  measurementId: 'G-TJ9M031V6G',
};
export const reactNativeApp = firebase.initializeApp(firebaseConfig);
let app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();
export const storage = app.storage();
export const auth = app.auth();
