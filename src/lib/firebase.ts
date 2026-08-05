import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Fallback to literal if the import is somehow mangled
const dbId = firebaseConfig.firestoreDatabaseId || "ai-studio-sammyarafati-f35faabc-034e-404c-bd43-51fe29b539e9";
export const db = getFirestore(app, dbId);
export const auth = getAuth(app);
