import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const dbId = firebaseConfig.firestoreDatabaseId || "ai-studio-sammyarafati-f35faabc-034e-404c-bd43-51fe29b539e9";
const db = getFirestore(app, dbId);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  console.log("Found", querySnapshot.size, "projects");
  querySnapshot.forEach(doc => console.log(doc.id, doc.data()));
}
run().catch(console.error);
