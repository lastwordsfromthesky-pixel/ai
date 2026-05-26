const firebaseConfig = {
  apiKey: "AIzaSyDF4J5K7spTxP2vykG3e1Hzsgsr07VtiX4",
  authDomain: "ai-webapp-adac2.firebaseapp.com",
  projectId: "ai-webapp-adac2",
  storageBucket: "ai-webapp-adac2.firebasestorage.app",
  messagingSenderId: "205845978843",
  appId: "1:205845978843:web:da1ef4aa6a63105d6236fe",
  measurementId: "G-S236DR4XW0"
};

// Pre-set Gemini free key IMMEDIATELY
const GEMINI_FREE_KEY = 'AIzaSyCT1DbKMe-Fup5aONOL2Hg_C3gFBw1RuCs';
if (!localStorage.getItem('aikey_gemini')) {
  localStorage.setItem('aikey_gemini', GEMINI_FREE_KEY);
}
window.GEMINI_KEY_SET = true;

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({
  'login_hint': 'user@example.com'
});
