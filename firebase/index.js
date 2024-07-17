import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBn5rBWFytSm5_vPOUiMhGX8naV9RwkvzQ",
  authDomain: "siscor-7d029.firebaseapp.com",
  projectId: "siscor-7d029",
  storageBucket: "siscor-7d029.appspot.com",
  messagingSenderId: "660623764227",
  appId: "1:660623764227:web:c7c452f84b015fdce25736"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }



