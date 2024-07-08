// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBukMk7W01ugCWPjynjewsKBUgJwpi7i_U',
  authDomain: 'nightapp-91264.firebaseapp.com',
  projectId: 'nightapp-91264',
  storageBucket: 'nightapp-91264.appspot.com',
  messagingSenderId: '43374019121',
  appId: '1:43374019121:web:47ed3cb3f20f9f11968b10',
  measurementId: 'G-K2YFHVCQ90',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);
const analytics = getAnalytics(app);
